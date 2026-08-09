import { AdminShell } from "@/components/admin/AdminShell";
import {
	BODY_PRESETS,
	COVER_PRESETS,
	type CroppedImage,
	ImageCropDialog,
} from "@/components/admin/ImageCropDialog";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import { SplitPane } from "@/components/admin/SplitPane";
import type { PostDoc } from "@/libs/admin/posts";
import { buildSlug } from "@/libs/admin/slug";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

export type EditorMode = "create" | "edit";

type Props = {
	mode: EditorMode;
	initial: PostDoc;
	storeKind?: "fs" | "github";
};

/** 本文に差し込む画像の長辺。記事の表示幅の2倍あれば足りる */
const BODY_IMAGE_MAX_WIDTH = 1600;

type PendingImage = {
	src: string;
	name: string;
	kind: "cover" | "body";
};

type Message = { kind: "error" | "info"; text: string };

const toDateInput = (iso: string | undefined) =>
	iso ? new Date(iso).toISOString().slice(0, 10) : "";

const fromDateInput = (value: string) =>
	value ? new Date(`${value}T00:00:00.000Z`).toISOString() : undefined;

const field =
	"w-full border border-line rounded-input bg-surface-page px-3 py-2 text-base";
const label = "block text-sm font-medium text-ink-secondary mb-1.5";
const headerLink =
	"text-xs font-medium text-ink-secondary border border-line rounded-button px-2.5 py-1.5 no-underline hover:text-ink-primary hover:bg-surface-sunken transition-colors";

export function PostEditor({ mode, initial, storeKind }: Props) {
	const router = useRouter();
	const [post, setPost] = useState<PostDoc>(initial);
	const [html, setHtml] = useState("");
	const [message, setMessage] = useState<Message | null>(null);
	const [saving, setSaving] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [pending, setPending] = useState<PendingImage | null>(null);
	const [bodyOver, setBodyOver] = useState(false);
	// 作成に成功したら、そのまま編集画面として振る舞う。ページ遷移すると
	// エディタが作り直されて「保存しました」が消えてしまうため
	const [editing, setEditing] = useState(mode === "edit");
	// 公開済みのURLを動かさないため、編集中はスラッグを固定する
	const [slugPinned, setSlugPinned] = useState(mode === "edit");
	const [takenSlugs, setTakenSlugs] = useState<string[]>([]);
	const dirty = useRef(false);
	const bodyRef = useRef<HTMLTextAreaElement>(null);
	const bodyFileRef = useRef<HTMLInputElement>(null);

	const update = <K extends keyof PostDoc>(key: K, value: PostDoc[K]) => {
		dirty.current = true;
		setPost((prev) => ({ ...prev, [key]: value }));
	};

	// 連番を振るために既存のスラッグを控えておく。取れなくても生成はできる
	useEffect(() => {
		if (mode !== "create") return;
		let alive = true;
		fetch("/api/admin/posts")
			.then((res) => (res.ok ? res.json() : { posts: [] }))
			.then((data: { posts: { id: string }[] }) => {
				if (alive) setTakenSlugs(data.posts.map((p) => p.id));
			})
			.catch(() => {});
		return () => {
			alive = false;
		};
	}, [mode]);

	// スラッグはタイトルと公開日から作る。自分で書き換えたらそれ以降は追随しない
	useEffect(() => {
		if (slugPinned) return;
		const next = buildSlug(
			post.title,
			post.publishedAt ?? post.createdAt,
			takenSlugs,
		);
		setPost((prev) => (prev.id === next ? prev : { ...prev, id: next }));
	}, [slugPinned, takenSlugs, post.title, post.publishedAt, post.createdAt]);

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

	const canSave = !saving && Boolean(post.title.trim()) && Boolean(post.id);

	const save = useCallback(async () => {
		if (!canSave) return;
		setSaving(true);
		setMessage(null);
		const res = await fetch(
			editing ? `/api/admin/posts/${post.id}` : "/api/admin/posts",
			{
				method: editing ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				// カバー画像を外したことを伝えるには null を送る必要がある
				// (undefined は JSON.stringify が落としてしまう)
				body: JSON.stringify({ ...post, heroImage: post.heroImage ?? null }),
			},
		);
		setSaving(false);
		if (!res.ok) {
			const data = (await res.json().catch(() => ({}))) as { error?: string };
			setMessage({ kind: "error", text: data.error ?? "保存できませんでした" });
			return;
		}
		const data = (await res.json()) as { post: PostDoc; committed: boolean };
		dirty.current = false;
		setPost(data.post);
		setSlugPinned(true);
		setMessage({
			kind: "info",
			text: data.committed
				? "GitHub にコミットしました"
				: "ローカルのファイルに保存しました",
		});
		if (!editing) {
			setEditing(true);
			// router.replace はページを作り直してしまうので、URL だけ差し替える
			window.history.replaceState(null, "", `/admin/writing/${data.post.id}`);
		}
	}, [canSave, editing, post]);

	// エディタは縦に長いので、キーボードからも保存できるようにする
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (!(event.metaKey || event.ctrlKey) || event.key !== "s") return;
			event.preventDefault();
			void save();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [save]);

	const remove = async () => {
		if (!window.confirm(`記事「${post.title}」を削除します。よろしいですか？`))
			return;
		const res = await fetch(`/api/admin/posts/${post.id}`, {
			method: "DELETE",
		});
		if (!res.ok) {
			const data = (await res.json().catch(() => ({}))) as { error?: string };
			setMessage({ kind: "error", text: data.error ?? "削除できませんでした" });
			return;
		}
		dirty.current = false;
		router.push("/admin");
	};

	// 画像は記事のスラッグごとのフォルダに置くので、スラッグが決まる前は受け取れない
	const openCropper = (file: File, kind: PendingImage["kind"]) => {
		if (!post.id) {
			setMessage({
				kind: "error",
				text: "画像を入れる前にスラッグを決めてください",
			});
			return;
		}
		setMessage(null);
		const reader = new FileReader();
		reader.onload = () =>
			setPending({ src: reader.result as string, name: file.name, kind });
		reader.readAsDataURL(file);
	};

	const insertIntoBody = (markdown: string) => {
		const textarea = bodyRef.current;
		const at = textarea?.selectionStart ?? post.body.length;
		const before = post.body.slice(0, at).replace(/\n*$/, "");
		const after = post.body.slice(at).replace(/^\n*/, "");
		const next = `${before ? `${before}\n\n` : ""}${markdown}${after ? `\n\n${after}` : "\n"}`;
		update("body", next);
		requestAnimationFrame(() => {
			const caret = (before ? before.length + 2 : 0) + markdown.length;
			textarea?.focus();
			textarea?.setSelectionRange(caret, caret);
		});
	};

	const uploadCropped = async (image: CroppedImage) => {
		if (!pending) return;
		setUploading(true);
		setMessage(null);
		const res = await fetch("/api/admin/upload", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				slug: post.id,
				name: pending.name,
				mimeType: image.mimeType,
				base64: image.base64,
			}),
		});
		setUploading(false);
		if (!res.ok) {
			const data = (await res.json().catch(() => ({}))) as { error?: string };
			setMessage({
				kind: "error",
				text: data.error ?? "アップロードできませんでした",
			});
			return;
		}
		const { url } = (await res.json()) as { url: string };
		// 置いた画像はスラッグ名のフォルダに入る。あとからタイトルを直しても
		// フォルダと記事がずれないよう、ここでスラッグを確定させる
		setSlugPinned(true);
		if (pending.kind === "cover") {
			update("heroImage", {
				url,
				width: image.width,
				height: image.height,
			});
		} else {
			insertIntoBody(`![](${url})`);
		}
		setPending(null);
	};

	const editor = (
		<div className="space-y-5 lg:pr-4">
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
					onChange={(e) => {
						setSlugPinned(true);
						update("id", e.target.value);
					}}
					readOnly={editing}
					className={`${field} font-mono text-sm ${editing ? "text-ink-tertiary" : ""}`}
				/>
				<p className="text-xs text-ink-tertiary mt-1">
					公開URLは /writing/{post.id || "..."} になります
					{editing
						? "。あとから変更するとリンクが切れるため固定しています"
						: "。タイトルから自動で作ります"}
				</p>
				{!editing && slugPinned && (
					<button
						type="button"
						onClick={() => setSlugPinned(false)}
						className="text-xs text-ink-secondary underline mt-1"
					>
						タイトルから作り直す
					</button>
				)}
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
				<p className={label}>カバー画像</p>
				<ImageDropzone
					onFile={(file) => openCropper(file, "cover")}
					previewUrl={post.heroImage?.url ?? null}
					onClear={() => update("heroImage", undefined)}
					disabled={uploading}
				/>
			</div>

			<div>
				<div className="flex items-baseline justify-between mb-1.5">
					<label className={`${label} mb-0`} htmlFor="post-body">
						本文
					</label>
					<button
						type="button"
						onClick={() => bodyFileRef.current?.click()}
						disabled={uploading}
						className="text-xs font-medium text-ink-secondary border border-line rounded-button px-2.5 py-1 hover:text-ink-primary hover:bg-surface-sunken transition-colors"
					>
						画像を挿入
					</button>
				</div>
				<input
					ref={bodyFileRef}
					type="file"
					accept="image/*"
					className="sr-only"
					onChange={(e) => {
						const file = e.target.files?.[0];
						// 同じファイルを続けて選べるように毎回クリアする
						e.target.value = "";
						if (file) openCropper(file, "body");
					}}
				/>
				<textarea
					id="post-body"
					ref={bodyRef}
					value={post.body}
					onChange={(e) => update("body", e.target.value)}
					onDragOver={(e) => {
						e.preventDefault();
						setBodyOver(true);
					}}
					onDragLeave={() => setBodyOver(false)}
					onDrop={(e) => {
						const file = e.dataTransfer.files?.[0];
						if (!file?.type.startsWith("image/")) return;
						e.preventDefault();
						setBodyOver(false);
						openCropper(file, "body");
					}}
					rows={26}
					spellCheck={false}
					className={`${field} font-mono text-sm leading-relaxed resize-y ${
						bodyOver ? "border-ink-primary bg-surface-sunken" : ""
					}`}
				/>
				<p className="text-xs text-ink-tertiary mt-1">
					Markdown で書けます。画像はここに直接ドラッグ＆ドロップするか、
					画像を挿入から選ぶと、トリミングしてカーソル位置に差し込みます
				</p>
			</div>
		</div>
	);

	const preview = (
		// 高さを左のカラムに合わせないと、中のプレビューが sticky で追従できない
		<div className="lg:pl-4 lg:h-full">
			<p className="text-sm font-medium text-ink-secondary mb-3">プレビュー</p>
			<div className="border border-line rounded-card bg-surface-card p-6 lg:sticky lg:top-20 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
				{post.heroImage && (
					<img
						src={post.heroImage.url}
						alt=""
						className="w-full h-auto border border-line rounded-card mb-8"
					/>
				)}
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
					// biome-ignore lint/security/noDangerouslySetInnerHtml: 自分の本文を公開ページと同じ変換器で描画している
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</div>
	);

	const noticeText = uploading ? "アップロード中" : message?.text;
	const noticeIsError = !uploading && message?.kind === "error";
	const notice = noticeText && (
		<span
			role={noticeIsError ? "alert" : "status"}
			title={noticeText}
			className={`text-xs truncate ${
				noticeIsError ? "text-signal-critical" : "text-ink-secondary"
			}`}
		>
			{noticeText}
		</span>
	);

	const actions = (
		<>
			{editing && (
				<a
					href={`/writing/${post.id}`}
					target="_blank"
					rel="noopener noreferrer"
					className={`hidden sm:inline-block ${headerLink}`}
				>
					公開ページ
				</a>
			)}
			<Link href="/admin" className={`hidden sm:inline-block ${headerLink}`}>
				一覧へ
			</Link>
			{editing && (
				<button
					type="button"
					onClick={remove}
					className="text-xs font-medium text-signal-critical border border-line rounded-button px-2.5 py-1.5 hover:bg-surface-sunken transition-colors"
				>
					削除
				</button>
			)}
			<button
				type="button"
				onClick={save}
				disabled={!canSave}
				title="Cmd+S でも保存できます"
				className="text-xs font-medium bg-ink-primary text-paper rounded-button px-3 py-1.5"
			>
				{saving ? "保存中" : "保存"}
			</button>
		</>
	);

	return (
		<AdminShell
			title={editing ? post.title || "記事を編集" : "新しい記事"}
			storeKind={storeKind}
			fluid
			notice={notice}
			actions={actions}
		>
			<SplitPane
				left={editor}
				right={preview}
				storageKey="admin:post-editor-split"
				label="エディタとプレビューの分割位置"
			/>

			{pending && (
				<ImageCropDialog
					imageSrc={pending.src}
					fileName={pending.name}
					presets={pending.kind === "cover" ? COVER_PRESETS : BODY_PRESETS}
					maxWidth={BODY_IMAGE_MAX_WIDTH}
					busy={uploading}
					onCancel={() => setPending(null)}
					onConfirm={uploadCropped}
				/>
			)}
		</AdminShell>
	);
}
