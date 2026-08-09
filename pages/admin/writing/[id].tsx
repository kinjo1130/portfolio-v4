import { AdminShell } from "@/components/admin/AdminShell";
import { PostEditor } from "@/components/admin/PostEditor";
import { type AdminPageProps, withAdminPage } from "@/libs/admin/guard";
import type { PostDoc } from "@/libs/admin/posts";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditPost({ storeKind }: AdminPageProps) {
	const router = useRouter();
	const id = typeof router.query.id === "string" ? router.query.id : null;
	const [post, setPost] = useState<PostDoc | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;
		fetch(`/api/admin/posts/${id}`)
			.then(async (res) => {
				if (!res.ok) throw new Error("記事を読み込めませんでした");
				return (await res.json()) as { post: PostDoc };
			})
			.then((data) => setPost(data.post))
			.catch((e: Error) => setError(e.message));
	}, [id]);

	return (
		<AdminShell
			title={post?.title ?? "記事を編集"}
			storeKind={storeKind}
			fluid
			actions={
				<>
					{id && (
						<a
							href={`/writing/${id}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-xs font-medium text-ink-secondary border border-line rounded-button px-2.5 py-1.5 no-underline"
						>
							公開ページ
						</a>
					)}
					<Link
						href="/admin"
						className="text-xs font-medium text-ink-secondary border border-line rounded-button px-2.5 py-1.5 no-underline"
					>
						一覧へ
					</Link>
				</>
			}
		>
			{error && (
				<p className="text-sm text-signal-critical" role="alert">
					{error}
				</p>
			)}
			{!post && !error && (
				<p className="text-sm text-ink-secondary">読み込み中</p>
			)}
			{post && <PostEditor mode="edit" initial={post} />}
		</AdminShell>
	);
}

export const getServerSideProps = withAdminPage;
