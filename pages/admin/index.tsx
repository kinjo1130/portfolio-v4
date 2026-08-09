import { AdminShell } from "@/components/admin/AdminShell";
import { type AdminPageProps, withAdminPage } from "@/libs/admin/guard";
import type { PostSummary } from "@/libs/admin/posts";
import Link from "next/link";
import { useEffect, useState } from "react";

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("ja-JP");

export default function AdminHome({ storeKind }: AdminPageProps) {
	const [posts, setPosts] = useState<PostSummary[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch("/api/admin/posts")
			.then(async (res) => {
				if (!res.ok) throw new Error("記事の一覧を取得できませんでした");
				return (await res.json()) as { posts: PostSummary[] };
			})
			.then((data) => setPosts(data.posts))
			.catch((e: Error) => setError(e.message));
	}, []);

	return (
		<AdminShell
			title="記事"
			storeKind={storeKind}
			actions={
				<Link
					href="/admin/writing/new"
					className="text-xs font-medium bg-ink-primary text-paper rounded-button px-3 py-1.5 no-underline"
				>
					新規作成
				</Link>
			}
		>
			{error && (
				<p className="text-sm text-signal-critical" role="alert">
					{error}
				</p>
			)}

			{posts === null && !error && (
				<p className="text-sm text-ink-secondary">読み込み中</p>
			)}

			{posts?.length === 0 && (
				<p className="text-sm text-ink-secondary">まだ記事がありません。</p>
			)}

			{posts && posts.length > 0 && (
				<ul className="border-t border-line">
					{posts.map((post) => (
						<li
							key={post.id}
							className="grid grid-cols-12 items-baseline gap-4 border-b border-line py-4"
						>
							<div className="col-span-12 md:col-span-7 min-w-0">
								<Link
									href={`/admin/writing/${post.id}`}
									className="jp-display text-lg font-medium text-ink-primary no-underline link-draw"
								>
									{post.title}
								</Link>
								<p className="text-xs text-ink-tertiary mt-1 font-mono truncate">
									{post.id}
								</p>
							</div>
							<div className="col-span-6 md:col-span-2">
								<span className="text-xs font-medium text-ink-secondary border border-line rounded-badge px-2 py-0.5">
									{post.draft ? "下書き" : "公開中"}
								</span>
							</div>
							<div className="col-span-6 md:col-span-3 md:text-right">
								<span className="text-sm text-ink-secondary tnum">
									{formatDate(post.publishedAt ?? post.createdAt)}
								</span>
							</div>
						</li>
					))}
				</ul>
			)}
		</AdminShell>
	);
}

export const getServerSideProps = withAdminPage;
