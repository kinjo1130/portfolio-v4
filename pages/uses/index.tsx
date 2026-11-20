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
import Image from "next/image";
import Layout from "../layout";

type UseItem = {
	name: string;
	note: string;
	url?: string;
	icon?: string;
};

type UsePhoto = {
	src: string;
	alt: string;
	width: number;
	height: number;
	caption?: string;
};

type UseSection = {
	id: string;
	title: string;
	photo?: UsePhoto;
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
					// アイコンを持つ項目が 1 つでもあるカテゴリだけ、全行にアイコン枠を出して名前の頭をそろえる
					const showItemIcons = section.items.some((item) => item.icon);
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

							{section.photo && (
								<figure className="pt-6 pb-2">
									<Image
										src={section.photo.src}
										alt={section.photo.alt}
										width={section.photo.width}
										height={section.photo.height}
										sizes="(min-width: 768px) 48rem, 100vw"
										className="w-full max-w-3xl h-auto rounded-card border border-line"
									/>
									{section.photo.caption && (
										<figcaption className="text-sm text-ink-secondary mt-2">
											{section.photo.caption}
										</figcaption>
									)}
								</figure>
							)}

							<ul>
								{section.items.map((item) => (
									<li
										key={item.name}
										className={`grid grid-cols-[minmax(0,1fr)] md:grid-cols-[18rem_minmax(0,1fr)] gap-1 md:gap-6 border-b border-line py-5 ${showItemIcons ? "md:items-center" : ""}`}
									>
										<p className="flex items-center gap-3 min-w-0 text-base font-medium text-ink-primary">
											{showItemIcons &&
												(item.icon ? (
													<img
														src={item.icon}
														alt=""
														width={28}
														height={28}
														className="w-7 h-7 rounded-md object-contain shrink-0"
													/>
												) : (
													<span
														aria-hidden
														className="w-7 h-7 rounded-md border border-line bg-surface-sunken text-xs font-semibold text-ink-secondary flex items-center justify-center shrink-0"
													>
														{item.name.charAt(0)}
													</span>
												))}
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
