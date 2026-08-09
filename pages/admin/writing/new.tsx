import { AdminShell } from "@/components/admin/AdminShell";
import { PostEditor } from "@/components/admin/PostEditor";
import { type AdminPageProps, withAdminPage } from "@/libs/admin/guard";
import type { PostDoc } from "@/libs/admin/posts";
import Link from "next/link";
import { useState } from "react";

function emptyPost(): PostDoc {
	const now = new Date().toISOString();
	return {
		id: "",
		title: "",
		description: "",
		createdAt: now,
		updatedAt: now,
		publishedAt: now,
		draft: true,
		body: "",
	};
}

export default function NewPost({ storeKind }: AdminPageProps) {
	// マウント時刻を固定して、再レンダリングのたびに日付が動かないようにする
	const [initial] = useState(emptyPost);

	return (
		<AdminShell
			title="新しい記事"
			storeKind={storeKind}
			actions={
				<Link
					href="/admin"
					className="text-xs font-medium text-ink-secondary border border-line rounded-button px-2.5 py-1.5 no-underline"
				>
					一覧へ
				</Link>
			}
		>
			<PostEditor mode="create" initial={initial} />
		</AdminShell>
	);
}

export const getServerSideProps = withAdminPage;
