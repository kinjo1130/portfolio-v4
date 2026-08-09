import type { PostDoc } from "@/libs/admin/posts";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

export type EditorMode = "create" | "edit";

type Props = {
	mode: EditorMode;
	initial: PostDoc;
};

const toDateInput = (iso: string | undefined) =>
	iso ? new Date(iso).toISOString().slice(0, 10) : "";

const fromDateInput = (value: string) =>
	value ? new Date(`${value}T00:00:00.000Z`).toISOString() : undefined;

const field =
	"w-full border border-line rounded-input bg-surface-page px-3 py-2 text-base";
const label = "block text-sm font-medium text-ink-secondary mb-1.5";

export function PostEditor({ mode, initial }: Props) {
	const router = useRouter();
	const [post, setPost] = useState<PostDoc>(initial);
	const [html, setHtml] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const dirty = useRef(false);

	const update = <K extends keyof PostDoc>(key: K, value: PostDoc[K]) => {
		dirty.current = true;
		setPost((prev) => ({ ...prev, [key]: value }));
	};

	// 本文プレビューは公開ページと同じ変換をサーバー側で通す
	useEffect(() => {
		const timer = setTimeout(() => {
			fetch("/api/admin/preview", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ body: post.body }),
			})
				.then((res) => (res.ok ? res.json() : { html: "" }))
				.then((data: { html: string }) => setHtml(data.html))
				.catch(() => setHtml(""));
		}, 400);
		return () => clearTimeout(timer);
	}, [post.body]);

	// 保存前に閉じてしまう事故を防ぐ
	useEffect(() => {
		const warn = (event: BeforeUnloadEvent) => {
			if (dirty.current) event.preventDefault();
		};
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, []);

	const save = useCallback(async () => {
		setSaving(true);
		setError(null);
		setStatus(null);
		const res = await fetch(
			mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${post.id}`,
			{
				method: mode === "create" ? "POST" : "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(post),
			},
		);
		setSaving(false);
		if (!res.ok) {
			const data = (await res.json().catch(() => ({}))) as { error?: string };
			setError(data.error ?? "保存できませんでした");
			return;
		}
		const data = (await res.json()) as { post: PostDoc; committed: boolean };
		dirty.current = false;
		setPost(data.post);
		setStatus(
			data.committed
				? "GitHub にコミットしました。反映まで少し待ってください。"
				: "ローカルのファイルに保存しました。",
		);
		if (mode === "create") router.replace(`/admin/writing/${data.post.id}`);
	}, [mode, post, router]);

	const remove = async () => {
		if (!window.confirm(`記事「${post.title}」を削除します。よろしいですか？`))
			return;
		const res = await fetch(`/api/admin/posts/${post.id}`, {
			method: "DELETE",
		});
		if (!res.ok) {
			const data = (await res.json().catch(() => ({}))) as { error?: string };
			setError(data.error ?? "削除できませんでした");
			return;
		}
		dirty.current = false;
		router.push("/admin");
	};

	return (
		<div className="grid grid-cols-12 gap-8">
			<div className="col-span-12 lg:col-span-6 space-y-5">
				<div>
					<label className={label} htmlFor="post-title">
						タイトル
					</label>
					<input
						id="post-title"
						value={post.title}
						onChange={(e) => update("title", e.target.value)}
						className={`${field} jp-display text-lg`}
					/>
				</div>

				<div>
					<label className={label} htmlFor="post-id">
						スラッグ
					</label>
					<input
						id="post-id"
						value={post.id}
						onChange={(e) => update("id", e.target.value)}
						readOnly={mode === "edit"}
						className={`${field} font-mono text-sm ${mode === "edit" ? "text-ink-tertiary" : ""}`}
					/>
					<p className="text-xs text-ink-tertiary mt-1">
						公開URLは /writing/{post.id || "..."} になります
						{mode === "edit" &&
							"。あとから変更するとリンクが切れるため固定しています"}
					</p>
				</div>

				<div>
					<label className={label} htmlFor="post-description">
						説明
					</label>
					<textarea
						id="post-description"
						value={post.description}
						onChange={(e) => update("description", e.target.value)}
						rows={2}
						className={`${field} resize-y`}
					/>
					<p className="text-xs text-ink-tertiary mt-1">
						一覧と検索結果に出る要約です
					</p>
				</div>

				<div className="flex items-end gap-6">
					<div>
						<label className={label} htmlFor="post-published">
							公開日
						</label>
						<input
							id="post-published"
							type="date"
							value={toDateInput(post.publishedAt ?? post.createdAt)}
							onChange={(e) =>
								update("publishedAt", fromDateInput(e.target.value))
							}
							className={`${field} tnum`}
						/>
					</div>
					<label className="flex items-center gap-2 text-sm font-medium text-ink-secondary pb-2.5">
						<input
							type="checkbox"
							checked={post.draft}
							onChange={(e) => update("draft", e.target.checked)}
							className="w-4 h-4 accent-current"
						/>
						下書きにする
					</label>
				</div>

				<div>
					<label className={label} htmlFor="post-body">
						本文
					</label>
					<textarea
						id="post-body"
						value={post.body}
						onChange={(e) => update("body", e.target.value)}
						rows={26}
						spellCheck={false}
						className={`${field} font-mono text-sm leading-relaxed resize-y`}
					/>
					<p className="text-xs text-ink-tertiary mt-1">Markdown で書けます</p>
				</div>

				{error && (
					<p className="text-sm text-signal-critical" role="alert">
						{error}
					</p>
				)}
				{status && <p className="text-sm text-ink-secondary">{status}</p>}

				<div className="flex items-center gap-3 pt-2 border-t border-line">
					<button
						type="button"
						onClick={save}
						disabled={saving || !post.title || !post.id}
						className="text-sm font-medium bg-ink-primary text-paper rounded-button px-4 py-2 mt-4"
					>
						{saving ? "保存中" : "保存"}
					</button>
					{mode === "edit" && (
						<button
							type="button"
							onClick={remove}
							className="text-sm font-medium text-signal-critical border border-line rounded-button px-4 py-2 mt-4 hover:bg-surface-sunken transition-colors"
						>
							削除
						</button>
					)}
				</div>
			</div>

			<div className="col-span-12 lg:col-span-6">
				<p className="text-sm font-medium text-ink-secondary mb-3">
					プレビュー
				</p>
				<div className="border border-line rounded-card bg-surface-card p-6 lg:sticky lg:top-20 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
					<h1 className="jp-display text-3xl font-bold leading-tight">
						{post.title || "無題"}
					</h1>
					{post.description && (
						<p className="text-lg font-medium leading-relaxed mt-4">
							{post.description}
						</p>
					)}
					<div
						className="prose prose-editorial max-w-none mt-8"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: 自分の本文を同じ変換器で描画している
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				</div>
			</div>
		</div>
	);
}
