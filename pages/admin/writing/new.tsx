import { PostEditor } from "@/components/admin/PostEditor";
import { type AdminPageProps, withAdminPage } from "@/libs/admin/guard";
import type { PostDoc } from "@/libs/admin/posts";
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

	return <PostEditor mode="create" initial={initial} storeKind={storeKind} />;
}

export const getServerSideProps = withAdminPage;
