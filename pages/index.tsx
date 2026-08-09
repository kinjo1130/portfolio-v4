import fs from "node:fs";
import path from "node:path";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import SNS from "@/components/SNS";
import { SeoHead } from "@/components/SeoHead";
import { getBlogs, getProducts, getWorkLogo, getWorks } from "@/libs/content";
import type { BlogPost } from "@/types/blog";
import type { Product } from "@/types/product";
import type { Work } from "@/types/work";
import Image from "next/image";
import Link from "next/link";

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

const year = (iso: string) => new Date(iso).getFullYear();

// ロゴがない会社は法人格を除いた頭文字をモノグラム表示する
const monogram = (title: string) =>
	title
		.replace(/^(株式会社|合同会社|有限会社|NPO法人)/, "")
		.charAt(0)
		.toUpperCase();

type Props = {
	featuredWorks: (Pick<Work, "slug" | "title" | "fromAt" | "toAt"> & {
		logo: string | null;
	})[];
	featuredProducts: Pick<Product, "slug" | "title" | "publishedAt" | "image">[];
	recentPosts: (Pick<BlogPost, "id" | "title" | "createdAt"> & {
		image: string;
	})[];
	recentTalks: {
		title: string;
		event: string;
		date: string;
		url: string;
		image: { url: string; width: number; height: number };
	}[];
};

// リスト行は SP で 1 カラムに積み、md 以上で 12 カラムの罫線グリッドに戻す。
// 行番号と年は SP ではメタ行としてまとめ、md 以上は `contents` でグリッドへ流す。
const ROW =
	"grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-3 border-b border-line py-6 md:py-5";
const META = "flex items-baseline justify-between gap-3 md:contents";
const INDEX =
	"tnum small-caps text-sm font-medium text-ink-secondary md:col-start-1 md:col-span-1 md:row-start-1";
const YEAR =
	"tnum text-sm font-medium text-ink-secondary shrink-0 md:col-start-11 md:col-span-2 md:row-start-1 md:text-right";
// サムネイルは SP では全幅、md 以上で行番号の右に 3 カラム分
const THUMB =
	"block border border-line rounded-card bg-surface-sunken overflow-hidden md:col-start-2 md:col-span-3 md:row-start-1";
const THUMB_SIZES = "(min-width: 768px) 22vw, 100vw";

export default function Home({
	featuredWorks,
	featuredProducts,
	recentPosts,
	recentTalks,
}: Props) {
	return (
		<>
			<SeoHead
				title="Home"
				titleTemplate="金城翔太郎 / Shotaro Kinjo"
				description="A product engineer's portfolio."
				imgUrl="/favicon.ico"
			/>
			<div className="home-plain-paper min-h-screen text-ink-primary">
				<div className="flex justify-center">
					<Header />
				</div>

				<main className="px-6 md:px-12 lg:px-20 pb-32 max-w-wide mx-auto w-full">
					{/* Cover */}
					<section className="pt-16 md:pt-24 pb-16 lg:pb-20">
						<p className="text-sm font-medium text-ink-secondary mb-6 ink-settle">
							プロダクトエンジニアのポートフォリオ
						</p>

						<h1 className="jp-display text-5xl md:text-7xl font-bold leading-tight tracking-tight ink-settle">
							金城翔太郎
						</h1>

						<p className="text-xl md:text-3xl font-semibold mt-4 tracking-tight text-ink-secondary ink-settle">
							Shotaro Kinjo
						</p>

						<div className="mt-12 grid grid-cols-12 gap-6">
							<p className="col-span-12 md:col-span-7 text-lg md:text-xl font-medium leading-relaxed">
								ソフトウェアで少しの役立つものをつくるために
								<br className="hidden md:inline" />
								コードを書くということをしています。
							</p>
							<div className="col-span-12 md:col-span-4 md:col-start-9 self-end flex flex-wrap gap-2">
								<span className="inline-block text-sm font-medium text-ink-secondary border border-line rounded-badge px-3 py-1">
									Product Engineer
								</span>
								<span className="inline-block text-sm font-medium text-ink-secondary border border-line rounded-badge px-3 py-1">
									Based in Kyoto
								</span>
							</div>
						</div>
					</section>

					<span className="rule-line" />

					{/* Featured: Products */}
					<section className="pt-16 lg:pt-20 grid grid-cols-12 gap-6 lg:gap-8">
						<header className="col-span-12 md:col-span-3 flex items-baseline gap-3 md:block">
							<p className="text-sm font-medium text-ink-secondary">
								プロダクト
							</p>
							<p className="tnum text-sm font-medium text-ink-secondary md:mt-2">
								01 / {String(featuredProducts.length).padStart(2, "0")}
							</p>
						</header>
						<ul className="col-span-12 md:col-span-9">
							{featuredProducts.map((product, i) => (
								<li key={product.slug} className={ROW}>
									<div className={META}>
										<span className={INDEX}>
											{String(i + 1).padStart(2, "0")}
										</span>
										<span className={YEAR}>{year(product.publishedAt)}</span>
									</div>
									<Link
										href={`/products/${product.slug}`}
										className={`${THUMB} aspect-[1200/630]`}
									>
										<Image
											src={product.image.url}
											alt={product.title}
											width={product.image.width}
											height={product.image.height}
											sizes={THUMB_SIZES}
											className="w-full h-full object-contain"
										/>
									</Link>
									<Link
										href={`/products/${product.slug}`}
										className="link-draw jp-display text-xl md:text-2xl font-medium text-ink-primary md:col-start-5 md:col-span-6 md:row-start-1"
									>
										{product.title}
									</Link>
								</li>
							))}
						</ul>
						<Link
							href="/products"
							className="col-span-12 md:col-start-4 md:col-span-9 text-sm font-medium text-ink-primary link-draw mt-2"
						>
							プロダクト一覧へ →
						</Link>
					</section>

					{/* Featured: Work */}
					<section className="pt-20 lg:pt-24 grid grid-cols-12 gap-6 lg:gap-8">
						<header className="col-span-12 md:col-span-3 flex items-baseline gap-3 md:block">
							<p className="text-sm font-medium text-ink-secondary">職歴</p>
							<p className="tnum text-sm font-medium text-ink-secondary md:mt-2">
								02 / {String(featuredWorks.length).padStart(2, "0")}
							</p>
						</header>
						<ul className="col-span-12 md:col-span-9">
							{featuredWorks.map((work, i) => (
								<li key={work.slug} className={`${ROW} md:items-baseline`}>
									<div className={META}>
										<span className={INDEX}>
											{String(i + 1).padStart(2, "0")}
										</span>
										<span className="flex items-baseline gap-3 shrink-0 md:contents">
											<span className="tnum text-sm font-medium text-ink-secondary md:col-start-9 md:col-span-2 md:row-start-1">
												{year(work.fromAt)}—
												{work.toAt ? year(work.toAt) : "現在"}
											</span>
											<span className="md:col-start-11 md:col-span-2 md:row-start-1 md:text-right">
												<span className="inline-block text-xs font-medium text-ink-secondary border border-line rounded-badge px-2 py-0.5">
													{work.toAt ? "終了" : "継続中"}
												</span>
											</span>
										</span>
									</div>
									<span className="flex items-center gap-3 min-w-0 md:col-start-2 md:col-span-7 md:row-start-1">
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
											className="link-draw jp-display text-xl md:text-2xl font-medium text-ink-primary"
										>
											{work.title}
										</Link>
									</span>
								</li>
							))}
						</ul>
						<Link
							href="/work"
							className="col-span-12 md:col-start-4 md:col-span-9 text-sm font-medium text-ink-primary link-draw mt-2"
						>
							職歴一覧へ →
						</Link>
					</section>

					{/* Recent: Blog */}
					<section className="pt-20 lg:pt-24 grid grid-cols-12 gap-6 lg:gap-8">
						<header className="col-span-12 md:col-span-3 flex items-baseline gap-3 md:block">
							<p className="text-sm font-medium text-ink-secondary">記事</p>
							<p className="tnum text-sm font-medium text-ink-secondary md:mt-2">
								03 / {String(recentPosts.length).padStart(2, "0")}
							</p>
						</header>
						<ul className="col-span-12 md:col-span-9">
							{recentPosts.map((post, i) => (
								<li key={post.id} className={ROW}>
									<div className={META}>
										<span className={INDEX}>
											{String(i + 1).padStart(2, "0")}
										</span>
										<span className={YEAR}>{year(post.createdAt)}</span>
									</div>
									<Link
										href={`/writing/${post.id}`}
										className={`${THUMB} aspect-[1200/630]`}
									>
										<img
											src={post.image}
											alt={post.title}
											loading="lazy"
											decoding="async"
											className="w-full h-full object-cover"
										/>
									</Link>
									<Link
										href={`/writing/${post.id}`}
										className="link-draw jp-display text-lg md:text-xl font-medium text-ink-primary md:col-start-5 md:col-span-6 md:row-start-1"
									>
										{post.title}
									</Link>
								</li>
							))}
						</ul>
						<Link
							href="/writing"
							className="col-span-12 md:col-start-4 md:col-span-9 text-sm font-medium text-ink-primary link-draw mt-2"
						>
							記事一覧へ →
						</Link>
					</section>

					{/* Recent: Talks */}
					<section className="pt-20 lg:pt-24 grid grid-cols-12 gap-6 lg:gap-8">
						<header className="col-span-12 md:col-span-3 flex items-baseline gap-3 md:block">
							<p className="text-sm font-medium text-ink-secondary">登壇</p>
							<p className="tnum text-sm font-medium text-ink-secondary md:mt-2">
								04 / {String(recentTalks.length).padStart(2, "0")}
							</p>
						</header>
						<ul className="col-span-12 md:col-span-9">
							{recentTalks.map((talk, i) => (
								<li key={`${talk.date}-${talk.title}`} className={ROW}>
									<div className={META}>
										<span className={INDEX}>
											{String(i + 1).padStart(2, "0")}
										</span>
										<span className={YEAR}>{year(talk.date)}</span>
									</div>
									<a
										href={talk.url}
										target="_blank"
										rel="noopener noreferrer"
										className={`${THUMB} aspect-video`}
									>
										<Image
											src={talk.image.url}
											alt={talk.title}
											width={talk.image.width}
											height={talk.image.height}
											sizes={THUMB_SIZES}
											className="w-full h-full object-cover"
										/>
									</a>
									<div className="md:col-start-5 md:col-span-6 md:row-start-1">
										<a
											href={talk.url}
											target="_blank"
											rel="noopener noreferrer"
											className="link-draw jp-display text-lg md:text-xl font-medium text-ink-primary no-underline"
										>
											{talk.title}
										</a>
										<p className="text-sm font-medium text-ink-secondary mt-1">
											{talk.event}
										</p>
									</div>
								</li>
							))}
						</ul>
						<Link
							href="/talks"
							className="col-span-12 md:col-start-4 md:col-span-9 text-sm font-medium text-ink-primary link-draw mt-2"
						>
							登壇一覧へ →
						</Link>
					</section>

					{/* Awards */}
					<section className="pt-20 lg:pt-24 grid grid-cols-12 gap-6 lg:gap-8">
						<header className="col-span-12 md:col-span-3">
							<p className="text-sm font-medium text-ink-secondary">受賞</p>
						</header>
						<ul className="col-span-12 md:col-span-9">
							{ACHIEVEMENTS.map((a, i) => (
								<li key={a.title} className={`${ROW} md:items-baseline`}>
									<div className={META}>
										<span className={INDEX}>
											{String(i + 1).padStart(2, "0")}
										</span>
										<span className={YEAR}>{a.year}</span>
									</div>
									<a
										href={a.url}
										target="_blank"
										rel="noopener noreferrer"
										className="link-draw text-base md:text-lg font-medium text-ink-primary md:col-start-2 md:col-span-9 md:row-start-1"
									>
										{a.title}
									</a>
								</li>
							))}
						</ul>
					</section>

					{/* SNS */}
					<section className="pt-24 lg:pt-32">
						<SNS />
					</section>
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

	const ongoing = works.filter((w) => !w.toAt);
	const closed = works.filter((w) => w.toAt);
	const featuredWorks = [...ongoing, ...closed].slice(0, 4).map((w) => ({
		slug: w.slug,
		title: w.title,
		fromAt: w.fromAt,
		toAt: w.toAt,
		logo: getWorkLogo(w.slug),
	}));

	const featuredProducts = products.slice(0, 3).map((p) => ({
		slug: p.slug,
		title: p.title,
		publishedAt: p.publishedAt,
		image: p.image,
	}));

	const recentPosts = blogs.slice(0, 3).map((p) => ({
		id: p.id,
		title: p.title,
		createdAt: p.createdAt,
		// ローカル記事のサムネイルは自前の OGP 生成 API
		image: `/api/og?title=${encodeURIComponent(p.title)}&date=${p.createdAt.slice(0, 10)}`,
	}));

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
		props: { featuredWorks, featuredProducts, recentPosts, recentTalks },
	};
};
