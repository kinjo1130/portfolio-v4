import type { QiitaPost } from "@/types/Qiita";

const QIITA_USER = "abcshotaro616";
const ZENN_USER = "kinjyo";

export type ExternalSource = "Qiita" | "Zenn";

/** Qiita と Zenn の差を吸収した、一覧に出すのに必要な分だけの形 */
export type ExternalPost = {
	id: string;
	title: string;
	url: string;
	source: ExternalSource;
	publishedAt: string;
	image: string | null;
};

export async function fetchQiitaPosts(): Promise<QiitaPost[]> {
	try {
		const res = await fetch(
			`https://qiita.com/api/v2/users/${QIITA_USER}/items?per_page=100`,
		);
		if (!res.ok) return [];
		return (await res.json()) as QiitaPost[];
	} catch {
		return [];
	}
}

export async function fetchZennPosts(): Promise<ZennPost[]> {
	try {
		const res = await fetch(
			`https://zenn.dev/api/articles?username=${ZENN_USER}&order=latest`,
		);
		if (!res.ok) return [];
		const data = (await res.json()) as { articles: ZennPost[] };
		return data.articles ?? [];
	} catch {
		return [];
	}
}

// 記事ページの og:image をビルド/ISR時に取得する (Qiita/Zenn の API は画像を返さないため)
export async function fetchOgImage(url: string): Promise<string | null> {
	try {
		const res = await fetch(url);
		if (!res.ok) return null;
		const html = await res.text();
		const match = html.match(/<meta property="og:image" content="([^"]+)"/);
		return match ? match[1].replace(/&amp;/g, "&") : null;
	} catch {
		return null;
	}
}

export function zennUrl(path: string): string {
	return `https://zenn.dev${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * 新しい順に並べた外部記事。og:image は1件ずつ記事ページを取りに行くので、
 * 件数を絞るなら先に絞ってから取る (limit を渡す理由)。
 */
export async function getExternalPosts(
	limit?: number,
): Promise<ExternalPost[]> {
	const [qiita, zenn] = await Promise.all([
		fetchQiitaPosts(),
		fetchZennPosts(),
	]);

	const merged: Omit<ExternalPost, "image">[] = [
		...qiita.map((post) => ({
			id: post.id,
			title: post.title,
			url: post.url,
			source: "Qiita" as const,
			publishedAt: post.created_at,
		})),
		...zenn.map((post) => ({
			id: String(post.id),
			title: post.title,
			url: zennUrl(post.path),
			source: "Zenn" as const,
			publishedAt: post.published_at,
		})),
	];
	merged.sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
	);

	const picked = limit === undefined ? merged : merged.slice(0, limit);
	return Promise.all(
		picked.map(async (post) => ({
			...post,
			image: await fetchOgImage(post.url),
		})),
	);
}
