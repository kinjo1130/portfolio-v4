import matter from "gray-matter";

export const BLOG_DIR = "content/blogs";

export type HeroImage = { url: string; width: number; height: number };

export type PostDoc = {
	id: string;
	title: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	publishedAt?: string;
	heroImage?: HeroImage;
	draft: boolean;
	body: string;
};

export type PostSummary = Omit<PostDoc, "body">;

export function postPath(id: string): string {
	return `${BLOG_DIR}/${id}.md`;
}

const SLUG_PATTERN = /^[a-z0-9][a-z0-9_-]{0,79}$/;

// 管理画面のルート /admin/writing/new と衝突するため使えない
const RESERVED_IDS = new Set(["new"]);

export function assertValidId(id: string): string {
	if (!SLUG_PATTERN.test(id)) {
		throw new Error(
			"スラッグは英小文字・数字・ハイフン・アンダースコアのみ、80文字以内で指定してください",
		);
	}
	if (RESERVED_IDS.has(id)) {
		throw new Error(`スラッグ ${id} は予約語のため使えません`);
	}
	return id;
}

// frontmatter の日付は引用符が外れると YAML が Date として解釈してしまうため、
// 読み込み時に必ず文字列へ戻す。
function asIsoString(value: unknown, fallback: string): string {
	if (value instanceof Date) return value.toISOString();
	if (typeof value === "string" && value.trim()) return value;
	return fallback;
}

function asHeroImage(value: unknown): HeroImage | undefined {
	if (!value || typeof value !== "object") return undefined;
	const { url, width, height } = value as Record<string, unknown>;
	if (typeof url !== "string" || !url) return undefined;
	return {
		url,
		width: Number(width) || 0,
		height: Number(height) || 0,
	};
}

export function parsePost(id: string, raw: string): PostDoc {
	const { data, content } = matter(raw);
	const now = new Date().toISOString();
	const createdAt = asIsoString(data.createdAt, now);
	return {
		id,
		title: typeof data.title === "string" ? data.title : "",
		description: typeof data.description === "string" ? data.description : "",
		createdAt,
		updatedAt: asIsoString(data.updatedAt, createdAt),
		publishedAt: data.publishedAt
			? asIsoString(data.publishedAt, createdAt)
			: undefined,
		heroImage: asHeroImage(data.heroImage),
		draft: data.draft === true,
		body: content.replace(/^\n+/, ""),
	};
}

function quote(value: string): string {
	return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

// キー順を固定して手で組む。YAML ライブラリ任せにすると日付の引用符が揺れて
// 差分がノイズだらけになるため。
export function serializePost(post: PostDoc): string {
	const lines = [`title: ${quote(post.title)}`];
	if (post.description) lines.push(`description: ${quote(post.description)}`);
	lines.push(`createdAt: ${quote(post.createdAt)}`);
	lines.push(`updatedAt: ${quote(post.updatedAt)}`);
	if (post.publishedAt) lines.push(`publishedAt: ${quote(post.publishedAt)}`);
	if (post.heroImage) {
		lines.push("heroImage:");
		lines.push(`  url: ${quote(post.heroImage.url)}`);
		lines.push(`  width: ${post.heroImage.width}`);
		lines.push(`  height: ${post.heroImage.height}`);
	}
	if (post.draft) lines.push("draft: true");

	const body = post.body.replace(/\s+$/, "");
	return `---\n${lines.join("\n")}\n---\n\n${body}\n`;
}

export function toSummary(post: PostDoc): PostSummary {
	const { body: _body, ...summary } = post;
	return summary;
}
