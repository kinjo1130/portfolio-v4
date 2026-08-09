import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
	children: React.ReactNode;
	title: string;
	storeKind?: "fs" | "github";
	actions?: React.ReactNode;
	// エディタは画面幅いっぱいまで使いたいので中央寄せの上限を外す
	fluid?: boolean;
};

const STORE_LABEL: Record<"fs" | "github", string> = {
	fs: "ローカルのファイルに保存",
	github: "GitHub にコミット",
};

export function AdminShell({
	children,
	title,
	storeKind,
	actions,
	fluid = false,
}: Props) {
	const container = fluid ? "w-full" : "max-w-wide mx-auto";
	const router = useRouter();

	const signOut = async () => {
		await fetch("/api/admin/logout", { method: "POST" });
		router.push("/admin/login");
	};

	return (
		<div className="min-h-screen bg-surface-page text-ink-primary">
			<Head>
				<title>{`${title} / 管理画面`}</title>
				<meta name="robots" content="noindex, nofollow" />
			</Head>

			<header className="sticky top-0 z-20 border-b border-line bg-surface-page/95 backdrop-blur">
				<div
					className={`${container} px-6 md:px-8 h-14 flex items-center gap-4`}
				>
					<Link
						href="/admin"
						className="text-sm font-semibold text-ink-primary no-underline shrink-0"
					>
						管理画面
					</Link>
					<span className="text-line" aria-hidden="true">
						/
					</span>
					<span className="text-sm font-medium text-ink-secondary truncate">
						{title}
					</span>

					<div className="ml-auto flex items-center gap-3 shrink-0">
						{storeKind && (
							<span className="hidden md:inline-block text-xs font-medium text-ink-secondary border border-line rounded-badge px-2 py-0.5">
								{STORE_LABEL[storeKind]}
							</span>
						)}
						{actions}
						<button
							type="button"
							onClick={signOut}
							className="text-xs font-medium text-ink-secondary border border-line rounded-button px-2.5 py-1.5 hover:text-ink-primary hover:bg-surface-sunken transition-colors"
						>
							ログアウト
						</button>
					</div>
				</div>
			</header>

			<main className={`${container} px-6 md:px-8 py-8`}>{children}</main>
		</div>
	);
}
