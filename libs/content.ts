import fs from "node:fs";
import path from "node:path";
import {
	describeCosense,
	normalizeTitle,
	readCosenseSnapshots,
	renderCosense,
} from "@/libs/cosense";
import {
	listMarkdownFiles,
	readMarkdownFile,
	renderMarkdown,
	slugFromPath,
} from "@/libs/markdown";
import type { BlogPost, BlogPosts } from "@/types/blog";
import type { Product, Products } from "@/types/product";
import type { Work, Works } from "@/types/work";

const CONTENT_DIR = path.join(process.cwd(), "content");

// draft はデフォルトで常に非表示。 SHOW_DRAFTS=true を渡したときだけ表示。
const showDrafts = process.env.SHOW_DRAFTS === "true";

type BlogFrontmatter = Omit<BlogPost, "id" | "body" | "source">;

// content/cosense は GitHub Actions が公開 Cosense から同期する (scripts/cosense/sync.mjs)
function getCosensePosts(): BlogPosts {
	const snapshots = readCosenseSnapshots();
	const hrefByTitle = new Map(
		snapshots.map((page) => [
			normalizeTitle(page.title),
			`/writing/${page.id}`,
		]),
	);
	const resolve = (title: string) => hrefByTitle.get(normalizeTitle(title));
	return snapshots.map((page) => ({
		id: page.id,
		source: "cosense",
		title: page.title,
		createdAt: page.createdAt,
		updatedAt: page.updatedAt,
		description: describeCosense(page.lines),
		body: renderCosense(page.lines, resolve),
	}));
}

// 記事ページは1件ごとに getBlog を呼ぶので、本番ビルドでは全件の変換を1回で済ませる。
// 開発中は content の編集をすぐ反映したいので毎回読み直す
let cachedBlogs: Promise<BlogPosts> | undefined;

export function getBlogs(): Promise<BlogPosts> {
	if (process.env.NODE_ENV !== "production") return loadBlogs();
	cachedBlogs ??= loadBlogs();
	return cachedBlogs;
}

async function loadBlogs(): Promise<BlogPosts> {
	const dir = path.join(CONTENT_DIR, "blogs");
	const files = listMarkdownFiles(dir);
	const local = await Promise.all(
		files.map(async (file) => {
			const { data, content } = readMarkdownFile<BlogFrontmatter>(file);
			const body = await renderMarkdown(content);
			return {
				id: slugFromPath(file),
				source: "local",
				...data,
				body,
			} satisfies BlogPost;
		}),
	);
	const posts = [...local, ...getCosensePosts()];
	const ids = new Set<string>();
	for (const post of posts) {
		if (ids.has(post.id))
			throw new Error(
				`記事の id ${post.id} が content/blogs と content/cosense で重複しています`,
			);
		ids.add(post.id);
	}
	const visible = !showDrafts ? posts.filter((p) => !p.draft) : posts;
	return visible.sort(
		(a, b) =>
			new Date(b.publishedAt ?? b.createdAt).getTime() -
			new Date(a.publishedAt ?? a.createdAt).getTime(),
	);
}

export async function getBlog(id: string): Promise<BlogPost | undefined> {
	const posts = await getBlogs();
	return posts.find((post) => post.id === id);
}

type WorkFrontmatter = Omit<Work, "slug" | "body">;

export async function getWorks(): Promise<Works> {
	const dir = path.join(CONTENT_DIR, "works");
	const files = listMarkdownFiles(dir);
	const works = await Promise.all(
		files.map(async (file) => {
			const { data, content } = readMarkdownFile<WorkFrontmatter>(file);
			const body = await renderMarkdown(content);
			return {
				slug: slugFromPath(file),
				...data,
				body,
			} satisfies Work;
		}),
	);
	const visible = !showDrafts ? works.filter((w) => !w.draft) : works;
	return visible.sort((a, b) => {
		const aTo = a.toAt ? new Date(a.toAt).getTime() : Number.POSITIVE_INFINITY;
		const bTo = b.toAt ? new Date(b.toAt).getTime() : Number.POSITIVE_INFINITY;
		return bTo - aTo;
	});
}

export async function getWork(slug: string): Promise<Work | undefined> {
	const works = await getWorks();
	return works.find((w) => w.slug === slug);
}

// public/images/works/<slug>.(png|svg) があればロゴとして使う (slug 規約)
export function getWorkLogo(slug: string): string | null {
	for (const ext of ["png", "svg"]) {
		const file = path.join(
			process.cwd(),
			"public",
			"images",
			"works",
			`${slug}.${ext}`,
		);
		if (fs.existsSync(file)) return `/images/works/${slug}.${ext}`;
	}
	return null;
}

type ProductFrontmatter = Omit<Product, "slug" | "body">;

export async function getProducts(): Promise<Products> {
	const dir = path.join(CONTENT_DIR, "products");
	const files = listMarkdownFiles(dir);
	const products = await Promise.all(
		files.map(async (file) => {
			const { data, content } = readMarkdownFile<ProductFrontmatter>(file);
			const body = await renderMarkdown(content);
			return {
				slug: slugFromPath(file),
				...data,
				body,
			} satisfies Product;
		}),
	);
	const visible = !showDrafts ? products.filter((p) => !p.draft) : products;
	return visible.sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
	);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
	const products = await getProducts();
	return products.find((p) => p.slug === slug);
}

export type AboutFrontmatter = {
	name: string;
	birth: string;
	origin: string;
};

export type About = AboutFrontmatter & { body: string };

export async function getAbout(): Promise<About> {
	const file = path.join(CONTENT_DIR, "about.md");
	const { data, content } = readMarkdownFile<AboutFrontmatter>(file);
	const body = await renderMarkdown(content);
	return { ...data, body };
}
