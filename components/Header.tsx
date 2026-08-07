import Link from "next/link";
import { useRouter } from "next/router";

const NAV = [
	{ href: "/about", label: "About" },
	{ href: "/work", label: "Work" },
	{ href: "/products", label: "Products" },
	{ href: "/blog", label: "Writing" },
	{ href: "/tools", label: "Tools" },
];

export const Header: React.FC = () => {
	const router = useRouter();

	const isActive = (href: string) => {
		if (href === "/") return router.pathname === "/";
		return router.pathname === href || router.pathname.startsWith(`${href}/`);
	};

	return (
		<header className="w-full border-b border-line">
			<div className="max-w-wide mx-auto px-6 md:px-12 lg:px-20 py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
				<Link
					href="/"
					className="text-base font-semibold text-ink-primary no-underline link-draw shrink-0"
				>
					kinjo.me
				</Link>
				<nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 md:gap-x-7">
					{NAV.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={`text-sm font-medium no-underline rounded-button px-3 py-1.5 transition-colors ${
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
