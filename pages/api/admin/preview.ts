import { requireAdmin } from "@/libs/admin/auth";
import { renderMarkdown } from "@/libs/markdown";
import type { NextApiRequest, NextApiResponse } from "next";

// 公開ページと同じレンダリング経路を通す。プレビューと本番の見た目をずらさないため。
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (!requireAdmin(req, res)) return;
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({ error: "POST のみ受け付けます" });
	}

	const body = (req.body as { body?: unknown } | undefined)?.body;
	const html = await renderMarkdown(typeof body === "string" ? body : "");
	return res.status(200).json({ html });
}
