import Link from "next/link";
import { useRouter } from "next/router";

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

	const isActive = (href: string) => {
		if (href === "/") return router.pathname === "/";
		return router.pathname === href || router.pathname.startsWith(`${href}/`);
	};

	return (
		<header className="w-full border-b border-line">
			<div className="max-w-wide mx-auto px-6 md:px-12 lg:px-20 py-4 flex flex-col gap-y-2 md:flex-row md:items-center md:justify-between md:gap-x-6">
				<Link
					href="/"
					className="text-base font-semibold text-ink-primary no-underline link-draw self-start shrink-0"
				>
					kinjo.me
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
