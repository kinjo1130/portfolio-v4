import Button from "@/components/Button";
import { SeoHead } from "@/components/SeoHead";
import { formatDate } from "@/libs/common";
import { getWorkLogo, getWorks } from "@/libs/content";
import type { Work as WorkType } from "@/types/work";
import Link from "next/link";
import { useState } from "react";
import Layout from "../layout";

type WorkWithLogo = WorkType & { logo: string | null };

// 初期表示件数と「もっと見る」1回あたりの追加件数
const INITIAL_COUNT = 5;
const STEP = 5;

// ロゴがない会社は法人格を除いた頭文字をモノグラム表示する
const monogram = (title: string) =>
	title
		.replace(/^(株式会社|合同会社|有限会社|NPO法人)/, "")
		.charAt(0)
		.toUpperCase();

export default function Work({ works }: { works: WorkWithLogo[] }) {
	const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
	const visibleWorks = works.slice(0, visibleCount);
	const restCount = works.length - visibleWorks.length;

	return (
		<Layout title="職歴">
			<SeoHead
				title="職歴"
				titleTemplate="金城翔太郎 / Shotaro Kinjo"
				description="これまでに関わった会社と案件の一覧です。"
				imgUrl="/ogp.png"
			/>

			<section className="grid grid-cols-12 gap-y-4 md:gap-6 lg:gap-8 pt-6 md:pt-8">
				<header className="col-span-12 md:col-span-3 flex items-baseline gap-3 md:block">
					<p className="text-sm font-medium text-ink-secondary">一覧</p>
					<p className="tnum text-sm font-medium text-ink-secondary md:mt-2">
						{works.length}件
					</p>
				</header>

				<ul className="col-span-12 md:col-span-9">
					{visibleWorks.map((work, i) => (
						<li
							key={work.slug}
							className="grid grid-cols-12 items-baseline gap-3 md:gap-4 border-b border-line py-6"
						>
							<span className="col-span-12 md:col-span-1 tnum small-caps text-sm font-medium text-ink-secondary">
								{String(i + 1).padStart(2, "0")}
							</span>
							<div className="col-span-12 md:col-span-7">
								<span className="flex items-center gap-3 min-w-0">
									{work.logo ? (
										<img
											src={work.logo}
											alt=""
											className="w-7 h-7 rounded-md border border-line bg-surface-card object-contain shrink-0"
										/>
									) : (
										<span className="w-7 h-7 rounded-md border border-line bg-surface-sunken text-xs font-semibold text-ink-secondary flex items-center justify-center shrink-0">
											{monogram(work.title)}
										</span>
									)}
									<Link
										href={`/work/${work.slug}`}
										className="link-draw jp-display text-xl md:text-2xl font-medium text-ink-primary no-underline"
									>
										{work.title}
									</Link>
								</span>
								<p className="text-base text-ink-secondary mt-2 leading-relaxed">
									{work.description}
								</p>
								{work.position.length > 0 && (
									<p className="text-sm font-medium text-ink-secondary mt-2">
										{work.position.join(" / ")}
									</p>
								)}
							</div>
							<div className="col-span-12 md:col-span-4 md:text-right mt-2 md:mt-0">
								<p className="text-sm font-medium text-ink-primary tnum">
									{formatDate(work.fromAt)} —{" "}
									{work.toAt ? formatDate(work.toAt) : "現在"}
								</p>
								<p className="mt-2">
									<span className="inline-block text-xs font-medium text-ink-secondary border border-line rounded-badge px-2 py-0.5">
										{work.toAt ? "終了" : "継続中"}
									</span>
								</p>
								{work.link && (
									<a
										href={work.link}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm font-medium text-ink-primary link-draw mt-2 inline-block no-underline"
									>
										会社サイト →
									</a>
								)}
							</div>
						</li>
					))}
				</ul>

				{restCount > 0 && (
					<div className="col-span-12 md:col-span-9 md:col-start-4 pt-2 md:pt-4">
						<Button
							variant="secondary"
							className="w-full md:w-auto"
							handleClick={() => setVisibleCount((c) => c + STEP)}
						>
							もっと見る（残り{restCount}件）
						</Button>
					</div>
				)}
			</section>
		</Layout>
	);
}

export const getStaticProps = async () => {
	const works = await getWorks();
	return {
		props: {
			works: works.map((w) => ({ ...w, logo: getWorkLogo(w.slug) })),
		},
	};
};
