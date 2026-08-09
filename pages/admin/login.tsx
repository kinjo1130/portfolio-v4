import {
	SESSION_COOKIE,
	isAdminConfigured,
	isValidSessionToken,
} from "@/libs/admin/auth";
import type { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AdminLogin() {
	const router = useRouter();
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	const onSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setPending(true);
		setError(null);
		const res = await fetch("/api/admin/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ password }),
		});
		setPending(false);
		if (!res.ok) {
			const data = (await res.json().catch(() => ({}))) as { error?: string };
			setError(data.error ?? "ログインできませんでした");
			return;
		}
		const next =
			typeof router.query.next === "string" ? router.query.next : "/admin";
		router.replace(next);
	};

	return (
		<div className="min-h-screen bg-surface-page text-ink-primary flex items-center justify-center px-6">
			<Head>
				<title>ログイン / 管理画面</title>
				<meta name="robots" content="noindex, nofollow" />
			</Head>

			<form
				onSubmit={onSubmit}
				className="w-full max-w-sm border border-line rounded-card bg-surface-card shadow-md p-8"
			>
				<h1 className="jp-display text-2xl font-medium">管理画面</h1>
				<p className="text-sm text-ink-secondary mt-2">
					パスワードを入力してください。
				</p>

				<label
					htmlFor="admin-password"
					className="block text-sm font-medium text-ink-secondary mt-6 mb-2"
				>
					パスワード
				</label>
				<input
					id="admin-password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					autoComplete="current-password"
					// biome-ignore lint/a11y/noAutofocus: ログイン専用画面で入力欄はこれだけ
					autoFocus
					className="w-full border border-line rounded-input bg-surface-page px-3 py-2 text-base"
				/>

				{error && (
					<p className="text-sm text-signal-critical mt-3" role="alert">
						{error}
					</p>
				)}

				<button
					type="submit"
					disabled={pending || !password}
					className="w-full mt-6 text-sm font-medium bg-ink-primary text-paper rounded-button px-4 py-2.5 transition-opacity"
				>
					{pending ? "確認中" : "ログイン"}
				</button>
			</form>
		</div>
	);
}

export function getServerSideProps(context: GetServerSidePropsContext) {
	if (!isAdminConfigured()) return { notFound: true as const };
	if (isValidSessionToken(context.req.cookies[SESSION_COOKIE])) {
		return { redirect: { destination: "/admin", permanent: false } };
	}
	return { props: {} };
}
