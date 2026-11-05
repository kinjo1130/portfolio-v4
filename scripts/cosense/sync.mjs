// 非公開の Cosense プロジェクトから [public.icon] の付いたページを取得し、
// content/cosense/<pageId>.json に書き出す。本文に貼られた Cosense の画像は
// ログインしないと見られないので、public/images/cosense/ に保存する。
// GitHub Actions が1日2回実行し、差分があればコミットする (.github/workflows/sync-cosense.yml)。
//
// ページの取得に1件でも失敗したら何も書き換えずに終了する。途中まで取れた状態で
// 消えたページのファイルを削除すると、公開中の記事が誤って消えるため。
//
// 手元で動かすときは Cosense の Personal Access Token を COSENSE_PAT に入れる。
import fs from "node:fs";
import path from "node:path";
import { parse } from "@progfay/scrapbox-parser";

const PROJECT = "kinjyo-secret";
const ORIGIN = "https://scrapbox.io";
const PAGES_DIR = path.join(process.cwd(), "content", "cosense");
const IMAGES_DIR = path.join(process.cwd(), "public", "images", "cosense");
const CONCURRENCY = 4;

// SVG はスクリプトを含められるので、自分のドメインから配信しない
const FILE_URL =
	/https:\/\/scrapbox\.io\/files\/[0-9a-f]+\.(?:png|jpe?g|gif|webp)/g;

const token = process.env.COSENSE_PAT;
if (!token) {
	console.error("COSENSE_PAT が設定されていません");
	process.exit(1);
}
const headers = { "x-personal-access-token": token };

async function request(url) {
	for (let attempt = 1; ; attempt++) {
		const res = await fetch(url, { headers });
		if (res.ok) return res;
		const retryable = res.status === 429 || res.status >= 500;
		if (!retryable || attempt === 3) {
			throw new Error(`${res.status} ${res.statusText}: ${url}`);
		}
		await new Promise((r) => setTimeout(r, 2000 * attempt));
	}
}

const fetchJson = async (url) => (await request(url)).json();

// filterType=icon で、本文に [public.icon] を書いたページだけに絞って一覧する
async function listTitles() {
	const titles = [];
	for (let skip = 0; ; ) {
		const data = await fetchJson(
			`${ORIGIN}/api/pages/${PROJECT}/?filterType=icon&filterValue=public&limit=1000&skip=${skip}`,
		);
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

// 一覧の絞り込みはユーザー名 public の編集履歴にも当たるので、本文を見て確かめ直す。
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

function writeAll(dir, files) {
	fs.mkdirSync(dir, { recursive: true });
	for (const name of fs.readdirSync(dir)) {
		if (!files.has(name)) fs.rmSync(path.join(dir, name));
	}
	for (const [name, data] of files) {
		fs.writeFileSync(path.join(dir, name), data);
	}
}

// 画像は取れなくても記事は出す。本文の画像が表示されないだけで済むため
async function downloadImages(urls) {
	const files = new Map();
	await mapConcurrent(urls, async (url) => {
		const name = path.basename(url);
		const existing = path.join(IMAGES_DIR, name);
		// Cosense のファイル URL は中身が変わらないので、一度保存したものは取り直さない
		if (fs.existsSync(existing)) {
			files.set(name, fs.readFileSync(existing));
			return;
		}
		try {
			const res = await request(url);
			const type = res.headers.get("content-type") ?? "";
			if (!type.startsWith("image/") || type.includes("svg")) {
				throw new Error(`画像ではない content-type: ${type}`);
			}
			files.set(name, Buffer.from(await res.arrayBuffer()));
		} catch (error) {
			console.warn(`画像を保存できませんでした ${url}: ${error.message}`);
		}
	});
	return files;
}

async function main() {
	const titles = await listTitles();
	const pages = await mapConcurrent(titles, (title) =>
		fetchJson(`${ORIGIN}/api/pages/v2/${PROJECT}/${encodeURIComponent(title)}`),
	);

	const published = pages
		.filter((page) => page.persistent !== false)
		.map((page) => ({
			id: page.id,
			title: page.title,
			createdAt: toIso(page.created),
			updatedAt: toIso(page.updated),
			lines: page.lines.map((line) => line.text),
		}))
		.filter((page) => isPublished(page.lines));

	// 認証の不備や API の変化で0件になったときに、公開中の記事を全部消さない
	if (published.length === 0) throw new Error("公開するページが0件でした");

	const imageUrls = [
		...new Set(
			published.flatMap((page) => page.lines.join("\n").match(FILE_URL) ?? []),
		),
	];
	const images = await downloadImages(imageUrls);

	writeAll(
		PAGES_DIR,
		new Map(
			published.map((page) => [
				`${page.id}.json`,
				`${JSON.stringify(page, null, "\t")}\n`,
			]),
		),
	);
	writeAll(IMAGES_DIR, images);
	console.log(
		`${titles.length} pages listed, ${published.length} published, ${images.size}/${imageUrls.length} images saved`,
	);
}

await main();
