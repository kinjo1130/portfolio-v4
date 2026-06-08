import { SeoHead } from "@/components/SeoHead";
import { formatDate } from "@/libs/common";
import { getWorks } from "@/libs/content";
import type { Works } from "@/types/work";
import Link from "next/link";
import Layout from "../layout";

export default function Work({ works }: { works: Works }) {
	return (
		<Layout
			title="Work"
			eyebrow="§ 03 — Work"
			issueNumber="§ 03 — 2026"
			tooltipText="インターンや業務委託の経験をまとめたもの"
		>
			<SeoHead
				title="Work"
				titleTemplate="Work"
				description="Work List"
				imgUrl="/favicon.ico"
			/>

			<section className="grid grid-cols-12 gap-6 lg:gap-8 pt-8">
				<header className="col-span-12 md:col-span-3">
					<p className="small-caps text-sm font-semibold text-ink-primary tracking-wider">
						Index
					</p>
					<p className="tnum text-sm font-medium text-ink-secondary mt-2">
						{String(works.length).padStart(2, "0")} entries
					</p>
				</header>

				<ul className="col-span-12 md:col-span-9">
					{works.map((work, i) => (
						<li
							key={work.slug}
							className="grid grid-cols-12 items-baseline gap-3 border-b border-line py-6"
						>
							<span className="col-span-1 tnum small-caps text-sm font-medium text-ink-secondary">
								{String(i + 1).padStart(2, "0")}
							</span>
							<div className="col-span-11 md:col-span-7">
								<Link
									href={`/work/${work.slug}`}
									className="link-draw jp-display text-xl md:text-2xl font-medium text-ink-primary no-underline"
								>
									{work.title}
								</Link>
								<p className="text-sm text-ink-secondary mt-2 leading-relaxed">
									{work.description}
								</p>
								{work.position.length > 0 && (
									<p className="small-caps text-xs font-semibold text-ink-secondary mt-2 tracking-wider">
										{work.position.join(" / ")}
									</p>
								)}
							</div>
							<div className="col-span-12 md:col-span-4 md:text-right mt-2 md:mt-0">
								<p className="small-caps text-sm font-semibold text-ink-primary tnum">
									{formatDate(work.fromAt)} —{" "}
									{work.toAt ? formatDate(work.toAt) : "現在"}
								</p>
								<p className="small-caps text-xs font-medium text-ink-secondary mt-1">
									{work.toAt ? "closed" : "ongoing"}
								</p>
								<a
									href={work.link}
									target="_blank"
									rel="noopener noreferrer"
									className="small-caps text-xs font-semibold text-ink-primary link-draw mt-2 inline-block no-underline"
								>
									company →
								</a>
							</div>
						</li>
					))}
				</ul>
			</section>
		</Layout>
	);
}

export const getStaticProps = async () => {
	return {
		props: {
			works: await getWorks(),
		},
	};
};
