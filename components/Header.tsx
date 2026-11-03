import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Header はページごとにマウントし直される。ページを移るたびにロゴの演出が流れないよう、自動で流すのはタブを開いて最初の 1 回だけにする
let logoFilled = false;

const NAV = [
	{ href: "/about", label: "自己紹介" },
	{ href: "/work", label: "職歴" },
	{ href: "/products", label: "プロダクト" },
	{ href: "/writing", label: "記事" },
	{ href: "/talks", label: "登壇" },
	{ href: "/tools", label: "ツール" },
];

export const Header: React.FC = () => {
	const router = useRouter();
	// 演出の途中かどうか。ホバーで再生するときは key を変えて塗り側を作り直し、CSS アニメーションを頭から流す
	const [waving, setWaving] = useState(() => !logoFilled);
	const [waveRun, setWaveRun] = useState(0);
	const replayWave = () => {
		if (waving) return;
		setWaveRun((n) => n + 1);
		setWaving(true);
	};

	useEffect(() => {
		logoFilled = true;
	}, []);

	const isActive = (href: string) => {
		if (href === "/") return router.pathname === "/";
		return router.pathname === href || router.pathname.startsWith(`${href}/`);
	};

	return (
		<header className="w-full border-b border-line">
			<div className="max-w-wide mx-auto px-6 md:px-12 py-4 flex flex-col gap-y-2 md:flex-row md:items-center md:justify-between md:gap-x-6">
				<Link
					href="/"
					className="text-base font-semibold text-ink-primary no-underline link-draw self-start shrink-0"
					onMouseEnter={replayWave}
					onFocus={replayWave}
				>
					<span
						className="logo-wave"
						data-animate={waving}
						data-delayed={waveRun === 0}
					>
						<span className="logo-wave-line">kinjo.me</span>
						<span
							key={waveRun}
							aria-hidden
							className="logo-wave-fill"
							onAnimationEnd={() => setWaving(false)}
						>
							kinjo.me
						</span>
					</span>
				</Link>
				{/* モバイルでは折り返さず横スクロールさせる (2行になるのを防ぐ) */}
				<nav className="flex items-center gap-x-1 flex-nowrap overflow-x-auto scrollbar-none -mx-6 px-6 md:mx-0 md:px-0 md:overflow-visible md:justify-end md:gap-x-4">
					{NAV.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={`text-xs md:text-sm font-medium no-underline rounded-button px-1.5 md:px-3 py-1.5 whitespace-nowrap shrink-0 transition-colors ${
								isActive(item.href)
									? "bg-surface-sunken text-ink-primary"
									: "text-ink-secondary hover:text-ink-primary hover:bg-surface-sunken"
							}`}
						>
							{item.label}
						</Link>
					))}
				</nav>
			</div>
		</header>
	);
};
