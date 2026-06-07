import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const processor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkRehype)
	.use(rehypeSlug)
	.use(rehypeHighlight)
	.use(rehypeStringify);

export async function renderMarkdown(body: string): Promise<string> {
	const file = await processor.process(body);
	return String(file);
}

export type MarkdownDoc<T> = {
	data: T;
	content: string;
};

export function readMarkdownFile<T>(absPath: string): MarkdownDoc<T> {
	const raw = fs.readFileSync(absPath, "utf-8");
	const { data, content } = matter(raw);
	return { data: data as T, content };
}

export function listMarkdownFiles(dir: string): string[] {
	if (!fs.existsSync(dir)) return [];
	return fs
		.readdirSync(dir)
		.filter((name) => name.endsWith(".md"))
		.map((name) => path.join(dir, name));
}

export function slugFromPath(filePath: string): string {
	return path.basename(filePath, ".md");
}
