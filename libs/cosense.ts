import fs from "node:fs";
import path from "node:path";
import {
	type Block,
	type CodeBlock,
	type Line,
	type Node,
	type Table,
	parse,
} from "@progfay/scrapbox-parser";
import type { Element, ElementContent, Root } from "hast";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";

const SNAPSHOT_DIR = path.join(process.cwd(), "content", "cosense");

/** scripts/cosense/sync.mjs が非公開プロジェクトから書き出す1ページ分のスナップショット */
export type CosenseSnapshot = {
	id: string;
	title: string;
	createdAt: string;
	updatedAt: string;
	lines: string[];
};

export function readCosenseSnapshots(): CosenseSnapshot[] {
	if (!fs.existsSync(SNAPSHOT_DIR)) return [];
	return fs
		.readdirSync(SNAPSHOT_DIR)
		.filter((name) => name.endsWith(".json"))
		.map(
			(name) =>
				JSON.parse(
					fs.readFileSync(path.join(SNAPSHOT_DIR, name), "utf-8"),
				) as CosenseSnapshot,
		);
}

/** Cosense のリンクは大文字小文字と空白・アンダースコアを区別しない */
export function normalizeTitle(title: string): string {
	return title.toLowerCase().replace(/ /g, "_");
}

/** ページ内リンク [タイトル] の飛び先。公開していないページなら undefined */
export type ResolveLink = (title: string) => string | undefined;

const h = (
	tagName: string,
	properties: Element["properties"],
	children: ElementContent[],
): Element => ({ type: "element", tagName, properties, children });

const text = (value: string): ElementContent => ({ type: "text", value });

const isHttpUrl = (url: string) => /^https?:\/\//.test(url);

// Gyazo のページ URL は画像そのものではないので /raw を付ける
const IMAGES_DIR = path.join(process.cwd(), "public", "images", "cosense");

function imageSrc(src: string): string {
	const gyazo = src.match(/^https:\/\/gyazo\.com\/([0-9a-f]+)$/);
	if (gyazo) return `https://gyazo.com/${gyazo[1]}/raw`;
	// 非公開プロジェクトの画像はログインしないと見られないので、同期で保存したものを使う
	const file = src.match(
		/^https:\/\/scrapbox\.io\/files\/([0-9a-f]+\.[a-z]+)$/,
	);
	if (file && fs.existsSync(path.join(IMAGES_DIR, file[1])))
		return `/images/cosense/${file[1]}`;
	return src;
}

function externalLink(href: string, children: ElementContent[]): Element {
	return h(
		"a",
		{ href, target: "_blank", rel: ["noopener", "noreferrer"] },
		children,
	);
}

function renderNodes(nodes: Node[], resolve: ResolveLink): ElementContent[] {
	return nodes.flatMap((node) => renderNode(node, resolve));
}

function renderNode(node: Node, resolve: ResolveLink): ElementContent[] {
	switch (node.type) {
		case "plain":
		case "blank":
		case "helpfeel":
			return [text(node.text)];
		case "code":
			return [h("code", {}, [text(node.text)])];
		case "commandLine":
			return [h("code", {}, [text(`${node.symbol} ${node.text}`)])];
		case "formula":
			return [h("code", {}, [text(node.formula)])];
		case "strong":
			return [h("strong", {}, renderNodes(node.nodes, resolve))];
		case "decoration": {
			let children = renderNodes(node.nodes, resolve);
			for (const deco of node.decos) {
				const tag = deco.startsWith("*-")
					? "strong"
					: { "/": "em", "-": "del", _: "u" }[deco as string];
				if (tag) children = [h(tag, {}, children)];
			}
			return children;
		}
		case "quote":
			return renderNodes(node.nodes, resolve);
		case "numberList":
			return [text(`${node.number}. `), ...renderNodes(node.nodes, resolve)];
		case "image":
		case "strongImage": {
			const src = imageSrc(node.src);
			if (!isHttpUrl(src) && !src.startsWith("/images/cosense/")) return [];
			const img = h(
				"img",
				{ src, alt: "", loading: "lazy", decoding: "async" },
				[],
			);
			return node.type === "image" && isHttpUrl(node.link)
				? [externalLink(node.link, [img])]
				: [img];
		}
		case "link": {
			if (node.pathType === "absolute") {
				if (!isHttpUrl(node.href)) return [text(node.raw)];
				return [externalLink(node.href, [text(node.content || node.href)])];
			}
			if (node.pathType === "root") {
				return [
					externalLink(`https://scrapbox.io${encodeURI(node.href)}`, [
						text(node.href),
					]),
				];
			}
			const href = resolve(node.href);
			return href ? [h("a", { href }, [text(node.href)])] : [text(node.href)];
		}
		case "hashTag": {
			const href = resolve(node.href);
			return href
				? [h("a", { href }, [text(`#${node.href}`)])]
				: [text(`#${node.href}`)];
		}
		case "googleMap":
			return [externalLink(node.url, [text(node.place || node.url)])];
		// アイコン ([public.icon] など) は公開の目印なので本文には出さない
		case "icon":
		case "strongIcon":
			return [];
	}
}

/** 行全体が [** 見出し] / [*** 見出し] のときだけ見出しにする */
function headingOf(line: Line): { level: number; nodes: Node[] } | undefined {
	if (line.indent !== 0) return undefined;
	const nodes = line.nodes.filter(
		(node) =>
			!(node.type === "blank" || (node.type === "plain" && !node.text.trim())),
	);
	const [only] = nodes;
	if (nodes.length !== 1 || only.type !== "decoration") return undefined;
	const weight = Math.max(
		0,
		...only.decos
			.filter((deco) => deco.startsWith("*-"))
			.map((deco) => Number(deco.slice(2))),
	);
	if (weight >= 3) return { level: 2, nodes: only.nodes };
	if (weight === 2) return { level: 3, nodes: only.nodes };
	return undefined;
}

function codeBlock(block: CodeBlock): Element {
	const lang = block.fileName.includes(".")
		? block.fileName.split(".").pop()
		: block.fileName;
	return h("pre", {}, [
		h("code", { className: lang ? [`language-${lang}`] : [] }, [
			text(block.content),
		]),
	]);
}

function table(block: Table, resolve: ResolveLink): Element {
	const [head, ...rows] = block.cells;
	const row = (cells: Node[][], tag: "th" | "td") =>
		h(
			"tr",
			{},
			cells.map((cell) => h(tag, {}, renderNodes(cell, resolve))),
		);
	return h("table", {}, [
		h("thead", {}, head ? [row(head, "th")] : []),
		h(
			"tbody",
			{},
			rows.map((cells) => row(cells, "td")),
		),
	]);
}

/**
 * Cosense は字下げで箇条書きを表すので、字下げの深さをそのまま入れ子の ul にする。
 * 字下げのない行は、空行で区切られるまでを1段落にまとめる。
 */
function buildTree(blocks: Block[], resolve: ResolveLink): ElementContent[] {
	const root: ElementContent[] = [];
	const lists: { list: Element; item: Element | null }[] = [];
	let pending: Element | null = null;

	const flush = () => {
		if (pending) root.push(pending);
		pending = null;
	};

	const placeAt = (depth: number, content: ElementContent[]) => {
		flush();
		lists.length = Math.min(lists.length, depth);
		while (lists.length < depth) {
			const list = h("ul", {}, []);
			const parent = lists.at(-1);
			if (parent) {
				if (!parent.item) {
					parent.item = h("li", {}, []);
					parent.list.children.push(parent.item);
				}
				parent.item.children.push(list);
			} else {
				root.push(list);
			}
			lists.push({ list, item: null });
		}
		const level = lists[depth - 1];
		level.item = h("li", {}, content);
		level.list.children.push(level.item);
	};

	const placeTop = (element: Element) => {
		flush();
		lists.length = 0;
		root.push(element);
	};

	for (const block of blocks) {
		if (block.type === "title") continue;
		if (block.type === "codeBlock" || block.type === "table") {
			const element =
				block.type === "codeBlock" ? codeBlock(block) : table(block, resolve);
			if (block.indent > 0) placeAt(block.indent, [element]);
			else placeTop(element);
			continue;
		}

		const heading = headingOf(block);
		if (heading) {
			placeTop(h(`h${heading.level}`, {}, renderNodes(heading.nodes, resolve)));
			continue;
		}

		const content = renderNodes(block.nodes, resolve);
		const isEmpty = content.every(
			(node) => node.type === "text" && !node.value.trim(),
		);
		if (block.indent > 0) {
			if (!isEmpty) placeAt(block.indent, content);
			continue;
		}
		if (isEmpty) {
			flush();
			lists.length = 0;
			continue;
		}

		lists.length = 0;
		const kind = block.nodes[0]?.type === "quote" ? "blockquote" : "p";
		const current = pending as Element | null;
		if (current && current.tagName === kind) {
			const target =
				kind === "blockquote" ? (current.children[0] as Element) : current;
			target.children.push(h("br", {}, []), ...content);
			continue;
		}
		flush();
		pending =
			kind === "blockquote"
				? h("blockquote", {}, [h("p", {}, content)])
				: h("p", {}, content);
	}
	flush();
	return root;
}

const processor = unified()
	.use(rehypeSlug)
	.use(rehypeHighlight)
	.use(rehypeStringify);

export function renderCosense(lines: string[], resolve: ResolveLink): string {
	const tree: Root = {
		type: "root",
		children: buildTree(parse(lines.join("\n")), resolve),
	};
	return processor.stringify(processor.runSync(tree) as Root);
}

function plainText(nodes: Node[]): string {
	return nodes
		.map((node) => {
			switch (node.type) {
				case "plain":
				case "blank":
				case "code":
				case "helpfeel":
					return node.text;
				case "link":
					return node.pathType === "absolute" ? node.content : node.href;
				case "hashTag":
					return "";
				case "strong":
				case "decoration":
				case "quote":
				case "numberList":
					return plainText(node.nodes);
				default:
					return "";
			}
		})
		.join("")
		.trim();
}

/** 一覧と OGP に出す説明文。本文の最初の文章の行を使う */
export function describeCosense(lines: string[]): string {
	for (const block of parse(lines.join("\n"))) {
		if (block.type !== "line") continue;
		const value = plainText(block.nodes);
		if (value) return value.length > 120 ? `${value.slice(0, 120)}…` : value;
	}
	return "";
}
