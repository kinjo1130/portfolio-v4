/**
 * タイトルからスラッグを作る。ブラウザとサーバーの両方から使うので、Node の API は使わない。
 *
 * 記事のタイトルは日本語が多く、機械的にローマ字へ変換しても読めるスラッグにはならない。
 * そこでタイトルから英数字を拾えるときだけそれを使い、拾えなければ公開日に倒す。
 */

const MAX_LENGTH = 60;

/** 予約語。/admin/writing/new と衝突する */
const RESERVED = new Set(["new"]);

export function slugifyTitle(title: string): string {
	const slug = title
		.normalize("NFKC")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	// 英数字が1文字しか残らないなら、スラッグとして意味をなさない
	if (slug.replace(/-/g, "").length < 2) return "";
	if (slug.length <= MAX_LENGTH) return slug;
	// 途中で単語を切らないよう、最後の区切りで落とす
	return slug.slice(0, MAX_LENGTH).replace(/-[^-]*$/, "");
}

export function dateSlug(iso: string): string {
	return iso.slice(0, 10);
}

export function uniqueSlug(base: string, taken: Iterable<string>): string {
	const used = new Set(taken);
	let candidate = base;
	for (let n = 2; used.has(candidate) || RESERVED.has(candidate); n += 1) {
		candidate = `${base}-${n}`;
	}
	return candidate;
}

export function buildSlug(
	title: string,
	isoDate: string,
	taken: Iterable<string>,
): string {
	return uniqueSlug(slugifyTitle(title) || dateSlug(isoDate), taken);
}
