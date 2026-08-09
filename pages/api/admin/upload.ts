import { requireAdmin } from "@/libs/admin/auth";
import { assertValidId } from "@/libs/admin/posts";
import { getContentStore } from "@/libs/admin/store";
import type { NextApiRequest, NextApiResponse } from "next";

// トリミングと圧縮はブラウザ側で終わっているので、届くのは加工後の画像だけ。
// それでも元が大きい PNG などは数MBになるため、既定の 1MB では足りない。
export const config = { api: { bodyParser: { sizeLimit: "12mb" } } };

const MAX_BYTES = 8 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
	"image/webp": "webp",
	"image/png": "png",
	"image/jpeg": "jpg",
};

type Body = {
	slug?: unknown;
	name?: unknown;
	mimeType?: unknown;
	base64?: unknown;
};

// ファイル名はこちらで作り直す。ユーザーが付けた名前をそのままパスに使わない。
// 日本語のファイル名は削ると数字や記号しか残らないので、その場合は image に倒す。
function safeName(name: string): string {
	const base = name
		.toLowerCase()
		.replace(/\.[^.]+$/, "")
		.replace(/[^a-z0-9-]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 40);
	return /[a-z]/.test(base) ? base : "image";
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (!requireAdmin(req, res)) return;
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({ error: "POST のみ受け付けます" });
	}

	const body = (req.body ?? {}) as Body;

	try {
		const slug = assertValidId(String(body.slug ?? ""));
		const mimeType = String(body.mimeType ?? "");
		const extension = EXTENSIONS[mimeType];
		if (!extension) {
			return res
				.status(400)
				.json({ error: "webp / png / jpeg のみアップロードできます" });
		}

		const base64 = String(body.base64 ?? "");
		if (!base64) return res.status(400).json({ error: "画像がありません" });
		const bytes = Buffer.byteLength(base64, "base64");
		if (bytes > MAX_BYTES) {
			return res.status(413).json({ error: "画像が大きすぎます (8MB まで)" });
		}

		const store = await getContentStore();
		const stem = safeName(String(body.name ?? "image"));
		const dir = `public/images/blogs/${slug}`;

		// 同じ名前を上書きすると、公開済みの記事の画像が差し替わってしまう。
		// 空いている連番を探して別ファイルにする。
		const existing = new Set(await store.list(dir));
		let fileName = `${stem}.${extension}`;
		for (let n = 2; existing.has(fileName); n += 1) {
			fileName = `${stem}-${n}.${extension}`;
		}

		const result = await store.commit(
			[{ path: `${dir}/${fileName}`, base64 }],
			`content: 記事 ${slug} に画像 ${fileName} を追加`,
		);

		return res.status(201).json({
			url: `/images/blogs/${slug}/${fileName}`,
			...result,
		});
	} catch (error) {
		return res.status(400).json({
			error:
				error instanceof Error ? error.message : "アップロードに失敗しました",
		});
	}
}
