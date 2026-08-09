import { requireAdmin } from "@/libs/admin/auth";
import {
	BLOG_DIR,
	type PostDoc,
	assertValidId,
	parsePost,
	postPath,
	serializePost,
	toSummary,
} from "@/libs/admin/posts";
import { buildSlug } from "@/libs/admin/slug";
import { getContentStore } from "@/libs/admin/store";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (!requireAdmin(req, res)) return;
	const store = await getContentStore();

	if (req.method === "GET") {
		const files = await store.list(BLOG_DIR);
		const posts = await Promise.all(
			files
				.filter((name) => name.endsWith(".md"))
				.map(async (name) => {
					const id = name.replace(/\.md$/, "");
					const raw = await store.read(`${BLOG_DIR}/${name}`);
					return raw ? toSummary(parsePost(id, raw)) : null;
				}),
		);
		const visible = posts.filter((p) => p !== null);
		visible.sort(
			(a, b) =>
				new Date(b.publishedAt ?? b.createdAt).getTime() -
				new Date(a.publishedAt ?? a.createdAt).getTime(),
		);
		return res.status(200).json({ posts: visible, store: store.kind });
	}

	if (req.method === "POST") {
		try {
			const input = req.body as Partial<PostDoc>;
			const now = new Date().toISOString();
			const title = input.title?.trim() || "無題";

			// スラッグが空ならタイトルと公開日から作る。既存と重ならない形はここで
			// 確定させる (ブラウザ側の生成は入力欄に先回りで出しているだけ)
			let id: string;
			if (input.id) {
				id = assertValidId(String(input.id));
			} else {
				const taken = (await store.list(BLOG_DIR))
					.filter((name) => name.endsWith(".md"))
					.map((name) => name.replace(/\.md$/, ""));
				id = assertValidId(
					buildSlug(title, input.publishedAt ?? input.createdAt ?? now, taken),
				);
			}

			if (await store.read(postPath(id))) {
				return res
					.status(409)
					.json({ error: `スラッグ ${id} の記事はすでにあります` });
			}
			const post: PostDoc = {
				id,
				title,
				description: input.description ?? "",
				createdAt: input.createdAt ?? now,
				updatedAt: now,
				publishedAt: input.publishedAt ?? input.createdAt ?? now,
				heroImage: input.heroImage ?? undefined,
				draft: input.draft ?? true,
				body: input.body ?? "",
			};
			const result = await store.commit(
				[{ path: postPath(id), text: serializePost(post) }],
				`content: 記事「${post.title}」を追加`,
			);
			return res.status(201).json({ post, ...result });
		} catch (error) {
			return res.status(400).json({
				error: error instanceof Error ? error.message : "保存に失敗しました",
			});
		}
	}

	res.setHeader("Allow", "GET, POST");
	return res.status(405).json({ error: "GET と POST のみ受け付けます" });
}
