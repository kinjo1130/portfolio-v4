import { SeoHead } from "@/components/SeoHead";
import { formatDate } from "@/libs/common";
import { getWorkLogo, getWorks } from "@/libs/content";
import type { Work as WorkType } from "@/types/work";
import Link from "next/link";
import Layout from "../layout";

type WorkWithLogo = WorkType & { logo: string | null };

// ロゴがない会社は法人格を除いた頭文字をモノグラム表示する
const monogram = (title: string) =>
	title
		.replace(/^(株式会社|合同会社|有限会社|NPO法人)/, "")
		.charAt(0)
		.toUpperCase();

export default function Work({ works }: { works: WorkWithLogo[] }) {
	return (
		<Layout title="職歴">
			<SeoHead
				title="職歴"
				titleTemplate="金城翔太郎 / Shotaro Kinjo"
				description="これまでに関わった会社と案件の一覧です。"
				imgUrl="/ogp.png"
			/>

			{/* 全件を最初から出す。件数が少なく、ページ内検索や検索エンジンにも全件を見せたいため */}
			<section className="grid gap-4 pt-6 md:pt-8 lg:pt-6">
				<p className="tnum text-sm font-medium text-ink-secondary">
					{works.length}件
				</p>

				<ul>
					{works.map((work, i) => (
						<li
							key={work.slug}
							className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-3 md:gap-x-6 border-b border-line py-6 lg:py-5"
						>
							<span className="tnum small-caps text-sm font-medium text-ink-secondary">
								{String(i + 1).padStart(2, "0")}
							</span>
							<div className="min-w-0">
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
							<div className="md:text-right mt-2 md:mt-0">
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
