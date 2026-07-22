import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Rss } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
	children: React.ReactNode;
	title?: string;
	eyebrow?: string;
	className?: string;
	hideTitleBlock?: boolean;
};

export default function Layout({
	children,
	title,
	eyebrow,
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
				{/* Title block */}
				{!hideTitleBlock && title && (
					<section className="pt-12 md:pt-16 pb-8 lg:pb-12 border-b border-line">
						<div className="flex items-start justify-between gap-6">
							<div>
								{eyebrow && (
									<p className="text-sm font-medium text-ink-secondary mb-3 ink-settle">
										{eyebrow}
									</p>
								)}
								<h1 className="jp-display text-4xl md:text-5xl font-bold leading-tight tracking-tight ink-settle">
									{title}
								</h1>
							</div>
							{isBlogPath && (
								<div className="pt-3 shrink-0">
									<button
										type="button"
										className="text-sm font-medium text-ink-primary border border-line rounded-button px-3 py-1.5 flex items-center gap-2 hover:bg-ink-primary hover:text-paper transition-colors"
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
