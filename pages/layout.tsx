import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Rss } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
	children: React.ReactNode;
	title?: string;
	eyebrow?: string;
	issueNumber?: string;
	className?: string;
	hideTitleBlock?: boolean;
};

export default function Layout({
	children,
	title,
	eyebrow,
	issueNumber,
	className,
	hideTitleBlock = false,
}: Props) {
	const [pageClass, setPageClass] = useState("");
	const router = useRouter();
	const routeFeed = () => {
		router.push("/api/feed");
	};
	const isBlogPath = router.pathname === "/blog";

	useEffect(() => {
		setPageClass("page-enter");
	}, []);

	return (
		<div className={`min-h-screen text-ink-primary ${className ?? ""}`}>
			<div className="flex justify-center">
				<Header />
			</div>

			<main className="px-6 md:px-12 lg:px-20 pb-32 max-w-wide mx-auto w-full">
				{/* Issue meta strip — left: section eyebrow, right: issue number */}
				<div className="flex items-baseline justify-between border-b border-ink-primary py-3 small-caps text-sm font-semibold text-ink-primary">
					<span>{eyebrow ?? <span aria-hidden>&nbsp;</span>}</span>
					<span className="tnum">{issueNumber ?? "§ 01 — 2026"}</span>
				</div>

				{/* Title block */}
				{!hideTitleBlock && title && (
					<section className="pt-12 md:pt-16 lg:pt-20 pb-12 lg:pb-16">
						<div className="flex items-start justify-between gap-6">
							<h1
								className="jp-display font-black leading-[0.95] tracking-tighter ink-settle"
								style={{ fontSize: "clamp(32px, 8vw, 120px)" }}
							>
								{title}
							</h1>
							{isBlogPath && (
								<div className="pt-3 shrink-0">
									<button
										type="button"
										className="small-caps text-sm font-semibold text-ink-primary border border-ink-primary px-3 py-1.5 flex items-center gap-2 hover:bg-ink-primary hover:text-paper transition-colors"
										onClick={() => routeFeed()}
									>
										<Rss size={14} />
										RSS
									</button>
								</div>
							)}
						</div>
					</section>
				)}

				<div className={pageClass}>{children}</div>
			</main>

			<div className="flex justify-center">
				<Footer />
			</div>
		</div>
	);
}
