import fs from "node:fs";
import path from "node:path";
import { SeoHead } from "@/components/SeoHead";
import {
	ArrowUpRight,
	Backpack,
	type LucideIcon,
	Monitor,
	SquareTerminal,
} from "lucide-react";
import Layout from "../layout";

type UseItem = {
	name: string;
	note: string;
	url?: string;
};

type UseSection = {
	id: string;
	title: string;
	items: UseItem[];
};

// JSON はデータだけを持つので、見出しのアイコンはここで id に結び付ける
const SECTION_ICONS: Record<string, LucideIcon> = {
	desk: Monitor,
	software: SquareTerminal,
	carry: Backpack,
};

export default function Uses({ sections }: { sections: UseSection[] }) {
	const total = sections.reduce((n, s) => n + s.items.length, 0);

	return (
		<Layout title="持ち物">
			<SeoHead
				title="持ち物"
				titleTemplate="金城翔太郎 / Shotaro Kinjo"
				description="作業に使っている道具、ソフトウェア、普段持ち歩いているもの。"
				imgUrl="/ogp.png"
			/>

			<section className="grid gap-4 pt-6 md:pt-8 lg:pt-6">
				<header className="grid gap-2">
					<p className="tnum text-sm font-medium text-ink-secondary">
						{total}件
					</p>
					<p className="text-base text-ink-secondary leading-relaxed">
						毎日使っている道具。買い替えたら更新する。
					</p>
				</header>

				<nav aria-label="カテゴリ" className="flex flex-wrap gap-2">
					{sections.map((section) => (
						<a
							key={section.id}
							href={`#${section.id}`}
							className="inline-block text-sm font-medium text-ink-secondary border border-line rounded-badge px-3 py-1 no-underline hover:text-ink-primary hover:bg-surface-sunken transition-colors"
						>
							{section.title}
							<span className="tnum ml-1.5 text-ink-tertiary">
								{section.items.length}
							</span>
						</a>
					))}
				</nav>
			</section>

			<div className="grid gap-16 pt-16">
				{sections.map((section) => {
					const Icon = SECTION_ICONS[section.id];
					return (
						<section
							key={section.id}
							id={section.id}
							aria-labelledby={`${section.id}-heading`}
							className="scroll-mt-8"
						>
							<h2
								id={`${section.id}-heading`}
								className="jp-display flex items-center gap-2 text-2xl font-bold text-ink-primary pb-4 border-b border-line"
							>
								{Icon && (
									<Icon
										size={24}
										strokeWidth={1.5}
										aria-hidden
										className="text-ink-secondary"
									/>
								)}
								{section.title}
							</h2>

							<ul>
								{section.items.map((item) => (
									<li
										key={item.name}
										className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[18rem_minmax(0,1fr)] gap-1 md:gap-6 border-b border-line py-5"
									>
										<p className="text-base font-medium text-ink-primary">
											{item.url ? (
												<a
													href={item.url}
													target="_blank"
													rel="noopener noreferrer"
													className="row-link inline-flex items-center gap-1 text-ink-primary no-underline"
												>
													{/* link-draw は display: inline-block を持つので、flex の a ではなく名前側に付ける */}
													<span className="link-draw">{item.name}</span>
													<ArrowUpRight
														size={16}
														strokeWidth={1.5}
														aria-hidden
														className="text-ink-tertiary shrink-0"
													/>
												</a>
											) : (
												item.name
											)}
										</p>
										<p className="text-base text-ink-secondary leading-relaxed">
											{item.note}
										</p>
									</li>
								))}
							</ul>
						</section>
					);
				})}
			</div>
		</Layout>
	);
}

export const getStaticProps = async () => {
	const raw = fs.readFileSync(
		path.join(process.cwd(), "content", "uses.json"),
		"utf-8",
	);
	return {
		props: { sections: JSON.parse(raw) as UseSection[] },
	};
};
