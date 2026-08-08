import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import SNS from "@/components/SNS";
import { SeoHead } from "@/components/SeoHead";
import { getBlogs, getProducts, getWorks } from "@/libs/content";
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

type Props = {
	featuredWorks: Pick<Work, "slug" | "title" | "fromAt" | "toAt">[];
	featuredProducts: Pick<Product, "slug" | "title" | "publishedAt" | "image">[];
	recentPosts: (Pick<BlogPost, "id" | "title" | "createdAt"> & {
		image: string;
	})[];
};

export default function Home({
	featuredWorks,
	featuredProducts,
	recentPosts,
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
							a product engineer&apos;s portfolio
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
						<header className="col-span-12 md:col-span-3">
							<p className="text-sm font-medium text-ink-secondary">
								Featured — Products
							</p>
							<p className="tnum text-sm font-medium text-ink-secondary mt-2">
								01 / {String(featuredProducts.length).padStart(2, "0")}
							</p>
						</header>
						<ul className="col-span-12 md:col-span-9">
							{featuredProducts.map((product, i) => (
								<li
									key={product.slug}
									className="grid grid-cols-12 gap-3 md:gap-4 border-b border-line py-5"
								>
									<span className="col-span-1 tnum small-caps text-sm font-medium text-ink-secondary md:pt-1">
										{String(i + 1).padStart(2, "0")}
									</span>
									<Link
										href={`/products/${product.slug}`}
										className="col-span-11 md:col-span-3 block border border-line rounded-card bg-surface-sunken overflow-hidden aspect-[1200/630]"
									>
										<Image
											src={product.image.url}
											alt={product.title}
											width={product.image.width}
											height={product.image.height}
											className="w-full h-full object-contain"
										/>
									</Link>
									<div className="col-span-11 col-start-2 md:col-span-8 md:col-start-auto flex items-baseline justify-between gap-4">
										<Link
											href={`/products/${product.slug}`}
											className="link-draw jp-display text-xl md:text-2xl font-medium text-ink-primary"
										>
											{product.title}
										</Link>
										<span className="text-sm font-medium text-ink-secondary tnum shrink-0">
											{year(product.publishedAt)}
										</span>
									</div>
								</li>
							))}
						</ul>
						<Link
							href="/products"
							className="col-span-12 md:col-start-4 md:col-span-9 text-sm font-medium text-ink-primary link-draw mt-2"
						>
							see all products →
						</Link>
					</section>

					{/* Featured: Work */}
					<section className="pt-20 lg:pt-24 grid grid-cols-12 gap-6 lg:gap-8">
						<header className="col-span-12 md:col-span-3">
							<p className="text-sm font-medium text-ink-secondary">
								Featured — Work
							</p>
							<p className="tnum text-sm font-medium text-ink-secondary mt-2">
								02 / {String(featuredWorks.length).padStart(2, "0")}
							</p>
						</header>
						<ul className="col-span-12 md:col-span-9">
							{featuredWorks.map((work, i) => (
								<li
									key={work.slug}
									className="grid grid-cols-12 items-baseline gap-3 border-b border-line py-5"
								>
									<span className="col-span-1 tnum small-caps text-sm font-medium text-ink-secondary">
										{String(i + 1).padStart(2, "0")}
									</span>
									<Link
										href={`/work/${work.slug}`}
										className="col-span-7 md:col-span-7 link-draw jp-display text-xl md:text-2xl font-medium text-ink-primary"
									>
										{work.title}
									</Link>
									<span className="col-span-2 text-sm font-medium text-ink-secondary tnum hidden md:block">
										{year(work.fromAt)}—{work.toAt ? year(work.toAt) : "now"}
									</span>
									<span className="col-span-4 md:col-span-2 text-right">
										<span className="inline-block text-xs font-medium text-ink-secondary border border-line rounded-badge px-2 py-0.5">
											{work.toAt ? "closed" : "ongoing"}
										</span>
									</span>
								</li>
							))}
						</ul>
						<Link
							href="/work"
							className="col-span-12 md:col-start-4 md:col-span-9 text-sm font-medium text-ink-primary link-draw mt-2"
						>
							see all work →
						</Link>
					</section>

					{/* Recent: Blog */}
					<section className="pt-20 lg:pt-24 grid grid-cols-12 gap-6 lg:gap-8">
						<header className="col-span-12 md:col-span-3">
							<p className="text-sm font-medium text-ink-secondary">
								Recent — Writing
							</p>
							<p className="tnum text-sm font-medium text-ink-secondary mt-2">
								03 / {String(recentPosts.length).padStart(2, "0")}
							</p>
						</header>
						<ul className="col-span-12 md:col-span-9">
							{recentPosts.map((post, i) => (
								<li
									key={post.id}
									className="grid grid-cols-12 gap-3 md:gap-4 border-b border-line py-5"
								>
									<span className="col-span-1 tnum small-caps text-sm font-medium text-ink-secondary md:pt-1">
										{String(i + 1).padStart(2, "0")}
									</span>
									<Link
										href={`/writing/${post.id}`}
										className="col-span-11 md:col-span-3 block border border-line rounded-card bg-surface-sunken overflow-hidden aspect-[1200/630]"
									>
										<img
											src={post.image}
											alt={post.title}
											loading="lazy"
											decoding="async"
											className="w-full h-full object-cover"
										/>
									</Link>
									<div className="col-span-11 col-start-2 md:col-span-8 md:col-start-auto flex items-baseline justify-between gap-4">
										<Link
											href={`/writing/${post.id}`}
											className="link-draw jp-display text-lg md:text-xl font-medium text-ink-primary"
										>
											{post.title}
										</Link>
										<span className="text-sm font-medium text-ink-secondary tnum shrink-0">
											{year(post.createdAt)}
										</span>
									</div>
								</li>
							))}
						</ul>
						<Link
							href="/writing"
							className="col-span-12 md:col-start-4 md:col-span-9 text-sm font-medium text-ink-primary link-draw mt-2"
						>
							see all writing →
						</Link>
					</section>

					{/* Awards */}
					<section className="pt-20 lg:pt-24 grid grid-cols-12 gap-6 lg:gap-8">
						<header className="col-span-12 md:col-span-3">
							<p className="text-sm font-medium text-ink-secondary">Awards</p>
						</header>
						<ul className="col-span-12 md:col-span-9">
							{ACHIEVEMENTS.map((a, i) => (
								<li
									key={a.title}
									className="grid grid-cols-12 items-baseline gap-3 border-b border-line py-5"
								>
									<span className="col-span-1 tnum small-caps text-sm font-medium text-ink-secondary">
										{String(i + 1).padStart(2, "0")}
									</span>
									<a
										href={a.url}
										target="_blank"
										rel="noopener noreferrer"
										className="col-span-9 link-draw text-base md:text-lg font-medium text-ink-primary"
									>
										{a.title}
									</a>
									<span className="col-span-2 text-sm font-medium text-ink-secondary tnum text-right">
										{a.year}
									</span>
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
	const blogs = getBlogs();

	const ongoing = works.filter((w) => !w.toAt);
	const closed = works.filter((w) => w.toAt);
	const featuredWorks = [...ongoing, ...closed].slice(0, 4).map((w) => ({
		slug: w.slug,
		title: w.title,
		fromAt: w.fromAt,
		toAt: w.toAt,
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

	return {
		props: { featuredWorks, featuredProducts, recentPosts },
	};
};
