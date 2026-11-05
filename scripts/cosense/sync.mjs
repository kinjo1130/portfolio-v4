// 公開 Cosense プロジェクトから [public.icon] の付いたページを取得し、
// content/cosense/<pageId>.json に書き出す。GitHub Actions が1日2回実行し、
// 差分があればコミットする (.github/workflows/sync-cosense.yml)。
//
// 取得に1件でも失敗したら何も書き換えずに終了する。途中まで取れた状態で
// 消えたページのファイルを削除すると、公開中の記事が誤って消えるため。
import fs from "node:fs";
import path from "node:path";
import { parse } from "@progfay/scrapbox-parser";

const PROJECT = "kinjo1130";
const API = `https://scrapbox.io/api/pages/${PROJECT}`;
const OUT_DIR = path.join(process.cwd(), "content", "cosense");
const CONCURRENCY = 4;

async function fetchJson(url) {
	for (let attempt = 1; ; attempt++) {
		const res = await fetch(url);
		if (res.ok) return res.json();
		const retryable = res.status === 429 || res.status >= 500;
		if (!retryable || attempt === 3) {
			throw new Error(`${res.status} ${res.statusText}: ${url}`);
		}
		await new Promise((r) => setTimeout(r, 2000 * attempt));
	}
}

async function listTitles() {
	const titles = [];
	for (let skip = 0; ; ) {
		const data = await fetchJson(`${API}?limit=1000&skip=${skip}`);
		titles.push(...data.pages.map((p) => p.title));
		skip += data.pages.length;
		if (data.pages.length === 0 || skip >= data.count) return titles;
	}
}

function hasIcon(nodes, name) {
	return nodes.some((node) => {
		if (node.type === "icon" || node.type === "strongIcon") {
			return node.pathType === "relative" && node.path === name;
		}
		return "nodes" in node && hasIcon(node.nodes, name);
	});
}

// コードブロック内に書かれた "[public.icon]" という文字列には反応させない
function pageHasIcon(blocks, name) {
	return blocks.some((block) => {
		if (block.type === "line") return hasIcon(block.nodes, name);
		if (block.type === "table")
			return block.cells.some((row) => row.some((cell) => hasIcon(cell, name)));
		return false;
	});
}

function isPublished(lines) {
	const blocks = parse(lines.join("\n"));
	return pageHasIcon(blocks, "public") && !pageHasIcon(blocks, "private");
}

async function mapConcurrent(items, fn) {
	const results = new Array(items.length);
	let next = 0;
	await Promise.all(
		Array.from({ length: CONCURRENCY }, async () => {
			while (next < items.length) {
				const i = next++;
				results[i] = await fn(items[i]);
			}
		}),
	);
	return results;
}

const toIso = (unixSeconds) => new Date(unixSeconds * 1000).toISOString();

async function main() {
	const titles = await listTitles();
	const pages = await mapConcurrent(titles, (title) =>
		fetchJson(`${API}/${encodeURIComponent(title)}`),
	);

	const published = pages
		.map((page) => ({
			id: page.id,
			title: page.title,
			createdAt: toIso(page.created),
			updatedAt: toIso(page.updated),
			lines: page.lines.map((line) => line.text),
		}))
		.filter((page) => isPublished(page.lines));

	fs.mkdirSync(OUT_DIR, { recursive: true });
	const keep = new Set(published.map((page) => `${page.id}.json`));
	for (const name of fs.readdirSync(OUT_DIR)) {
		if (name.endsWith(".json") && !keep.has(name)) {
			fs.rmSync(path.join(OUT_DIR, name));
		}
	}
	for (const page of published) {
		fs.writeFileSync(
			path.join(OUT_DIR, `${page.id}.json`),
			`${JSON.stringify(page, null, "\t")}\n`,
		);
	}
	console.log(
		`${titles.length} pages fetched, ${published.length} published to content/cosense`,
	);
}

await main();
