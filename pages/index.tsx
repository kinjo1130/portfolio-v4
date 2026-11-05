import fs from "node:fs";
import path from "node:path";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
	Badge,
	IndexRow,
	IndexSection,
	StatusBadge,
	THUMB_IMG,
	THUMB_SIZES,
	ThumbRow,
	order,
} from "@/components/IndexList";
import { ProfileFlipCard } from "@/components/ProfileFlipCard";
import SNS from "@/components/SNS";
import { SeoHead } from "@/components/SeoHead";
import {
	getBlogs,
	getProducts,
	getWorkLogo,
	getWorks,
	sortByTenure,
} from "@/libs/content";
import { type ExternalPost, getExternalPosts } from "@/libs/external-posts";
import type { BlogPost } from "@/types/blog";
import type { Product } from "@/types/product";
import type { Work } from "@/types/work";
import Image from "next/image";

const ACHIEVEMENTS = [
	{
		title: "Civictech Challenge Cup u-21 Code for japan賞",
		url: "https://ccc2021.code4japan.org",
		year: "2021",
	},
	{
		title: "ハックツハッカソン ツマジロカップ studist賞",
		url: "https://hackz.team/news/28VSpLaigPOw6KcqbgbVZT",
		year: "2024",
	},
	{
		title: "ハックツハッカソン スピノカップ 最優秀賞",
		url: "https://x.com/Hackz_team/status/1839224546358079765",
		year: "2024",
	},
];

const NAME = "金城翔太郎";
// プロダクト / 職歴 / 記事 / 外部の記事 / 登壇 / 受賞 / SNS
const SECTION_COUNT = 7;

// トップに出す職歴。並び順は職歴一覧と同じく在籍期間が長い順
const FEATURED_WORK_SLUGS = ["moji", "helpfeel", "tavern"];
// プロダクトは新しい順に 2 件、3 件目はこれに固定する
const PINNED_PRODUCT_SLUG = "psynaut";

const year = (iso: string) => new Date(iso).getFullYear();

// ロゴがない会社は法人格を除いた頭文字をモノグラム表示する
const monogram = (title: string) =>
	title
		.replace(/^(株式会社|合同会社|有限会社|NPO法人)/, "")
		.charAt(0)
		.toUpperCase();
const date = (iso: string) => iso.slice(0, 10).replaceAll("-", ".");

type Props = {
	featuredWorks: (Pick<
		Work,
		"slug" | "title" | "description" | "fromAt" | "toAt"
	> & { logo: string | null })[];
	featuredProducts: (Pick<
		Product,
		"slug" | "title" | "publishedAt" | "image"
	> & {
		description: string;
	})[];
	recentPosts: (Pick<BlogPost, "id" | "title" | "createdAt"> & {
		image: string;
	})[];
	recentExternalPosts: ExternalPost[];
	recentTalks: {
		title: string;
		event: string;
		date: string;
		url: string;
		image: { url: string; width: number; height: number };
	}[];
};

export default function Home({
	featuredWorks,
	featuredProducts,
	recentPosts,
	recentExternalPosts,
	recentTalks,
}: Props) {
	return (
		<>
			<SeoHead
				title="Home"
				titleTemplate="金城翔太郎 / Shotaro Kinjo"
				description="A product engineer's portfolio."
				imgUrl="/ogp.png"
			/>
			<div className="home-plain-paper min-h-screen text-ink-primary">
				<div className="flex justify-center">
					<Header />
				</div>

				<main className="px-6 md:px-12 pb-32 lg:pb-8 max-w-wide mx-auto w-full">
					{/* Cover */}
					<section className="pt-16 md:pt-24 lg:pt-8 pb-16 lg:pb-8">
						{/* 1 行目: 名前とカード / 2 行目: キャッチコピーとバッジ (全幅) */}
						<div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-5 md:gap-x-6">
							<div>
								<h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
									<span className="sr-only">{NAME}</span>
									{[...NAME].map((char, i) => (
										<span key={char} className="reveal-char" aria-hidden>
											<span style={order(i)}>{char}</span>
										</span>
									))}
								</h1>

								<p
									className="rise text-xl font-semibold mt-2 tracking-snug text-ink-secondary"
									style={order(1)}
								>
									Shotaro Kinjo
								</p>
							</div>
							<div className="rise" style={order(3)}>
								<ProfileFlipCard />
							</div>

							<div
								className="rise col-span-2 mt-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4"
								style={order(2)}
							>
								<p className="text-lg font-medium leading-relaxed max-w-[30em]">
									ソフトウェアで少しの役立つものをつくるために、コードを書くということをしています。
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="inline-block text-sm font-medium text-ink-secondary border border-line rounded-badge px-3 py-1">
										Product Engineer
									</span>
									<span className="inline-block text-sm font-medium text-ink-secondary border border-line rounded-badge px-3 py-1">
										Based in Kyoto
									</span>
								</div>
							</div>
						</div>
					</section>

					<IndexSection
						number={1}
						total={SECTION_COUNT}
						label="プロダクト"
						more={{ href: "/products", label: "プロダクト一覧へ" }}
					>
						{featuredProducts.map((product, i) => (
							<ThumbRow
								key={product.slug}
								href={`/products/${product.slug}`}
								index={i + 1}
								title={product.title}
								description={product.description}
								meta={year(product.publishedAt)}
								thumb={
									<Image
										src={product.image.url}
										alt=""
										width={product.image.width}
										height={product.image.height}
										sizes={THUMB_SIZES}
										className={`${THUMB_IMG} object-contain`}
									/>
								}
							/>
						))}
					</IndexSection>

					<IndexSection
						number={2}
						total={SECTION_COUNT}
						label="職歴"
						more={{ href: "/work", label: "職歴一覧へ" }}
					>
						{featuredWorks.map((work, i) => (
							<IndexRow
								key={work.slug}
								href={`/work/${work.slug}`}
								index={i + 1}
								title={work.title}
								description={work.description}
								icon={
									work.logo ? (
										<img
											src={work.logo}
											alt=""
											className="w-[28px] h-[28px] rounded-md border border-line bg-surface-card object-contain shrink-0"
										/>
									) : (
										<span className="w-[28px] h-[28px] rounded-md border border-line bg-surface-sunken text-xs font-semibold text-ink-secondary flex items-center justify-center shrink-0">
											{monogram(work.title)}
										</span>
									)
								}
								meta={
									<>
										<span>
											{year(work.fromAt)}—{work.toAt ? year(work.toAt) : "現在"}
										</span>
										<StatusBadge ongoing={!work.toAt} />
									</>
								}
							/>
						))}
					</IndexSection>

					<IndexSection
						number={3}
						total={SECTION_COUNT}
						label="記事"
						more={{ href: "/writing", label: "記事一覧へ" }}
					>
						{recentPosts.map((post, i) => (
							<ThumbRow
								key={post.id}
								href={`/writing/${post.id}`}
								index={i + 1}
								title={post.title}
								meta={date(post.createdAt)}
								thumb={
									<img
										src={post.image}
										alt=""
										loading="lazy"
										decoding="async"
										className={`${THUMB_IMG} object-cover`}
									/>
								}
							/>
						))}
					</IndexSection>

					<IndexSection
						number={4}
						total={SECTION_COUNT}
						label="外部の記事"
						more={{ href: "/writing", label: "Qiita・Zenn の記事一覧へ" }}
					>
						{recentExternalPosts.map((post, i) => (
							<ThumbRow
								key={`${post.source}-${post.id}`}
								href={post.url}
								external
								index={i + 1}
								title={post.title}
								meta={
									<>
										<Badge>{post.source}</Badge>
										<span>{date(post.publishedAt)}</span>
									</>
								}
								thumb={
									post.image ? (
										<img
											src={post.image}
											alt=""
											loading="lazy"
											decoding="async"
											className={`${THUMB_IMG} object-cover`}
										/>
									) : (
										<span className="w-full h-full flex items-center justify-center text-sm font-semibold text-ink-secondary">
											{post.source}
										</span>
									)
								}
							/>
						))}
					</IndexSection>

					<IndexSection
						number={5}
						total={SECTION_COUNT}
						label="登壇"
						more={{ href: "/talks", label: "登壇一覧へ" }}
					>
						{recentTalks.map((talk, i) => (
							<ThumbRow
								key={`${talk.date}-${talk.title}`}
								href={talk.url}
								external
								index={i + 1}
								title={talk.title}
								description={talk.event}
								meta={date(talk.date)}
								aspect="aspect-video"
								thumb={
									<Image
										src={talk.image.url}
										alt=""
										width={talk.image.width}
										height={talk.image.height}
										sizes={THUMB_SIZES}
										className={`${THUMB_IMG} object-cover`}
									/>
								}
							/>
						))}
					</IndexSection>

					<IndexSection number={6} total={SECTION_COUNT} label="受賞">
						{ACHIEVEMENTS.map((a, i) => (
							<IndexRow
								key={a.title}
								href={a.url}
								external
								index={i + 1}
								title={a.title}
								meta={a.year}
							/>
						))}
					</IndexSection>

					<SNS number={7} total={SECTION_COUNT} />
				</main>

				<Footer />
			</div>
		</>
	);
}

export const getStaticProps = async () => {
	const works = await getWorks();
	const products = await getProducts();
	const blogs = await getBlogs();

	const featured = FEATURED_WORK_SLUGS.map((slug) => {
		const w = works.find((work) => work.slug === slug);
		if (!w)
			throw new Error(`トップに出す職歴 ${slug} が content/works にありません`);
		return w;
	});
	const featuredWorks = sortByTenure(featured).map((w) => {
		return {
			slug: w.slug,
			title: w.title,
			description: w.description ?? "",
			fromAt: w.fromAt,
			toAt: w.toAt,
			logo: getWorkLogo(w.slug),
		};
	});

	const pinned = products.find((p) => p.slug === PINNED_PRODUCT_SLUG);
	if (!pinned)
		throw new Error(
			`トップに固定するプロダクト ${PINNED_PRODUCT_SLUG} が content/products にありません`,
		);
	const featuredProducts = [
		...products.filter((p) => p.slug !== PINNED_PRODUCT_SLUG).slice(0, 2),
		pinned,
	].map((p) => ({
		slug: p.slug,
		title: p.title,
		description: p.description ?? "",
		publishedAt: p.publishedAt,
		image: p.image,
	}));

	const recentPosts = blogs.slice(0, 3).map((p) => ({
		id: p.id,
		title: p.title,
		createdAt: p.createdAt,
		// ローカル記事のサムネイルは自前の OGP 生成 API
		image: `/api/og?variant=thumb&title=${encodeURIComponent(p.title)}&date=${p.createdAt.slice(0, 10)}`,
	}));

	const recentExternalPosts = await getExternalPosts(3);

	const talks = JSON.parse(
		fs.readFileSync(path.join(process.cwd(), "content", "talks.json"), "utf-8"),
	) as {
		title: string;
		event: string;
		date: string;
		links: { url: string }[];
		image: { url: string; width: number; height: number };
	}[];
	const recentTalks = [...talks]
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, 3)
		.map((t) => ({
			title: t.title,
			event: t.event,
			date: t.date,
			url: t.links[0].url,
			image: t.image,
		}));

	return {
		props: {
			featuredWorks,
			featuredProducts,
			recentPosts,
			recentExternalPosts,
			recentTalks,
		},
		// Qiita / Zenn の新着を再デプロイなしで反映する (1時間ごと)
		revalidate: 3600,
	};
};
