import fs from "node:fs";
import path from "node:path";
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

function readJson<T>(file: string): T {
	const fullPath = path.join(CONTENT_DIR, file);
	const raw = fs.readFileSync(fullPath, "utf-8");
	return JSON.parse(raw) as T;
}

export function getBlogs(): BlogPosts {
	const posts = readJson<BlogPosts>("blogs.json");
	const visible = !showDrafts ?posts.filter((p) => !p.draft) : posts;
	return [...visible].sort(
		(a, b) =>
			new Date(b.publishedAt ?? b.createdAt).getTime() -
			new Date(a.publishedAt ?? a.createdAt).getTime(),
	);
}

export function getBlog(id: string): BlogPost | undefined {
	return getBlogs().find((post) => post.id === id);
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
	const visible = !showDrafts ?works.filter((w) => !w.draft) : works;
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
	const visible = !showDrafts ?products.filter((p) => !p.draft) : products;
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
