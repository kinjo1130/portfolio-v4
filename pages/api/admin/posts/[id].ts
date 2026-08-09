import { requireAdmin } from "@/libs/admin/auth";
import {
	type PostDoc,
	assertValidId,
	parsePost,
	postPath,
	serializePost,
} from "@/libs/admin/posts";
import { getContentStore } from "@/libs/admin/store";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (!requireAdmin(req, res)) return;

	let id: string;
	try {
		id = assertValidId(String(req.query.id ?? ""));
	} catch (error) {
		return res
			.status(400)
			.json({ error: error instanceof Error ? error.message : "不正なID" });
	}

	const store = await getContentStore();
	const raw = await store.read(postPath(id));

	if (req.method === "GET") {
		if (raw === null)
			return res.status(404).json({ error: "記事がありません" });
		return res
			.status(200)
			.json({ post: parsePost(id, raw), store: store.kind });
	}

	if (req.method === "PUT") {
		if (raw === null)
			return res.status(404).json({ error: "記事がありません" });
		try {
			const current = parsePost(id, raw);
			const input = req.body as Partial<PostDoc>;
			const post: PostDoc = {
				...current,
				title: input.title?.trim() || current.title,
				description: input.description ?? current.description,
				createdAt: input.createdAt ?? current.createdAt,
				publishedAt: input.publishedAt ?? current.publishedAt,
				heroImage:
					input.heroImage === null
						? undefined
						: (input.heroImage ?? current.heroImage),
				draft: input.draft ?? current.draft,
				body: input.body ?? current.body,
				updatedAt: new Date().toISOString(),
			};
			const result = await store.commit(
				[{ path: postPath(id), text: serializePost(post) }],
				`content: 記事「${post.title}」を更新`,
			);
			return res.status(200).json({ post, ...result });
		} catch (error) {
			return res.status(500).json({
				error: error instanceof Error ? error.message : "保存に失敗しました",
			});
		}
	}

	if (req.method === "DELETE") {
		if (raw === null)
			return res.status(404).json({ error: "記事がありません" });
		try {
			const { title } = parsePost(id, raw);
			const result = await store.commit(
				[{ path: postPath(id), deleted: true }],
				`content: 記事「${title}」を削除`,
			);
			return res.status(200).json({ ok: true, ...result });
		} catch (error) {
			return res.status(500).json({
				error: error instanceof Error ? error.message : "削除に失敗しました",
			});
		}
	}

	res.setHeader("Allow", "GET, PUT, DELETE");
	return res.status(405).json({ error: "GET / PUT / DELETE のみ受け付けます" });
}
