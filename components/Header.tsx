import Link from "next/link";
import { useRouter } from "next/router";

const NAV = [
	{ href: "/about", label: "About" },
	{ href: "/work", label: "Work" },
	{ href: "/products", label: "Products" },
	{ href: "/blog", label: "Blog" },
	{ href: "/tools", label: "Tools" },
];

export const Header: React.FC = () => {
	const router = useRouter();

	const isActive = (href: string) => {
		if (href === "/") return router.pathname === "/";
		return router.pathname === href || router.pathname.startsWith(`${href}/`);
	};

	return (
		<header className="w-full px-6 md:px-12 lg:px-20 py-5 max-w-wide mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
			<Link
				href="/"
				className="small-caps text-sm font-semibold text-ink-primary tracking-wider no-underline link-draw shrink-0"
			>
				kinjo.me
			</Link>
			<nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 md:gap-x-7">
				{NAV.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className={`small-caps text-sm font-semibold no-underline link-draw text-ink-primary ${
							isActive(item.href) ? "underline underline-offset-4" : ""
						}`}
					>
						{item.label}
					</Link>
				))}
			</nav>
		</header>
	);
};
