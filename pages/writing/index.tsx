import { SeoHead } from "@/components/SeoHead";
import { getPublishedDate, isPostWithPath, isPostWithUrl } from "@/libs/common";
import { getBlogs } from "@/libs/content";
import {
	fetchOgImage,
	fetchQiitaPosts,
	fetchZennPosts,
} from "@/libs/external-posts";
import type { QiitaPost } from "@/types/Qiita";
import type { BlogPost } from "@/types/blog";
import Link from "next/link";
import { useState } from "react";
import Layout from "../layout";

type Post = (BlogPost | QiitaPost | ZennPost) & { image: string | null };

const SERVICES = ["すべて", "Qiita", "Zenn"] as const;
type Service = (typeof SERVICES)[number];

function getHref(post: Post): string {
	if (isPostWithUrl(post)) return post.url;
	if (isPostWithPath(post))
		return `https://zenn.dev${post.path.startsWith("/") ? "" : "/"}${post.path}`;
	return `/writing/${post.id}`;
}

function isExternal(post: Post): boolean {
	return isPostWithUrl(post) || isPostWithPath(post);
}

function getSource(post: Post): "Qiita" | "Zenn" | null {
	if (isPostWithUrl(post)) return "Qiita";
	if (isPostWithPath(post)) return "Zenn";
	return null;
}

function Thumbnail({ post }: { post: Post }) {
	return post.image ? (
		<img
			src={post.image}
			alt={post.title}
			loading="lazy"
			decoding="async"
			className="w-full h-full object-cover"
		/>
	) : (
		<span className="w-full h-full flex items-center justify-center text-sm font-semibold text-ink-secondary">
			kinjo.me
		</span>
	);
}

export default function Blog({ blog }: { blog: Post[] }) {
	const [service, setService] = useState<Service>("すべて");
	const own = blog.filter((post) => !isExternal(post));
	const external = blog
		.filter(isExternal)
		.filter((post) => service === "すべて" || getSource(post) === service);

	return (
		<Layout title="記事">
			<SeoHead
				title="記事"
				titleTemplate="金城翔太郎 / Shotaro Kinjo"
				description="このサイトに書いた記事と、Qiita・Zennに投稿した記事の一覧です。"
				imgUrl="/ogp.png"
			/>

			<section className="grid grid-cols-12 gap-y-4 md:gap-6 lg:gap-8 pt-6 md:pt-8">
				<header className="col-span-12 md:col-span-3 flex items-baseline gap-3 md:block">
					<p className="text-sm font-medium text-ink-secondary">
						このサイトの記事
					</p>
					<p className="tnum text-sm font-medium text-ink-secondary md:mt-2">
						{own.length}件
					</p>
				</header>

				<ul className="col-span-12 md:col-span-9">
					{own.map((post, i) => (
						<li
							key={post.id}
							className="grid grid-cols-12 gap-4 md:gap-6 border-b border-line py-6"
						>
							<span className="col-span-12 md:col-span-1 tnum small-caps text-sm font-medium text-ink-secondary md:pt-1">
								{String(i + 1).padStart(2, "0")}
							</span>
							<Link
								href={getHref(post)}
								className="col-span-12 md:col-span-3 block border border-line rounded-card bg-surface-sunken overflow-hidden aspect-[1200/630]"
							>
								<Thumbnail post={post} />
							</Link>
							<div className="col-span-12 md:col-span-8">
								<div className="flex items-baseline justify-between gap-4">
									<Link
										href={getHref(post)}
										className="link-draw jp-display text-lg md:text-xl font-medium text-ink-primary no-underline"
									>
										{post.title}
									</Link>
									<span className="text-sm font-medium text-ink-secondary tnum shrink-0">
										{getPublishedDate(post).toLocaleDateString("ja-JP")}
									</span>
								</div>
							</div>
						</li>
					))}
				</ul>
			</section>

			<section className="grid grid-cols-12 gap-y-4 md:gap-6 lg:gap-8 pt-16 lg:pt-20">
				<header className="col-span-12 md:col-span-3">
					<div className="flex items-baseline gap-3 md:block">
						<p className="text-sm font-medium text-ink-secondary">
							外部サービスへの投稿
						</p>
						<p className="tnum text-sm font-medium text-ink-secondary md:mt-2">
							{external.length}件
						</p>
					</div>
					<div className="flex flex-wrap md:flex-col items-start gap-2 mt-4">
						{SERVICES.map((s) => (
							<button
								type="button"
								key={s}
								onClick={() => setService(s)}
								aria-pressed={service === s}
								className={`text-xs font-medium border rounded-badge px-3 py-1 transition-colors ${
									service === s
										? "bg-ink-primary text-paper border-ink-primary"
										: "text-ink-secondary border-line hover:text-ink-primary hover:bg-surface-sunken"
								}`}
							>
								{s}
							</button>
						))}
					</div>
				</header>

				<ul className="col-span-12 md:col-span-9">
					{external.map((post, i) => (
						<li
							key={`${getSource(post)}-${post.id}`}
							className="grid grid-cols-12 gap-4 md:gap-6 border-b border-line py-6"
						>
							<span className="col-span-12 md:col-span-1 tnum small-caps text-sm font-medium text-ink-secondary md:pt-1">
								{String(i + 1).padStart(2, "0")}
							</span>
							<a
								href={getHref(post)}
								target="_blank"
								rel="noopener noreferrer"
								className="col-span-12 md:col-span-3 block border border-line rounded-card bg-surface-sunken overflow-hidden aspect-[1200/630]"
							>
								<Thumbnail post={post} />
							</a>
							<div className="col-span-12 md:col-span-8">
								<div className="flex items-baseline justify-between gap-4">
									<a
										href={getHref(post)}
										target="_blank"
										rel="noopener noreferrer"
										className="link-draw jp-display text-lg md:text-xl font-medium text-ink-primary no-underline"
									>
										{post.title}
									</a>
									<span className="text-sm font-medium text-ink-secondary tnum shrink-0">
										{getPublishedDate(post).toLocaleDateString("ja-JP")}
									</span>
								</div>
								<p className="mt-2">
									<span className="inline-block text-xs font-medium text-ink-secondary border border-line rounded-badge px-2 py-0.5">
										{getSource(post)}
									</span>
								</p>
							</div>
						</li>
					))}
				</ul>
			</section>
		</Layout>
	);
}

export const getStaticProps = async () => {
	const [qiita, zenn] = await Promise.all([
		fetchQiitaPosts(),
		fetchZennPosts(),
	]);
	// 一覧表示に使うフィールドだけ残す (本文まで含めるとページデータが肥大するため)
	const localSlim = (await getBlogs()).map(
		({ id, title, createdAt }) => ({ id, title, createdAt }) as BlogPost,
	);
	const qiitaSlim = qiita.map(
		({ id, title, url, created_at }) =>
			({ id, title, url, created_at }) as QiitaPost,
	);
	const zennSlim = zenn.map(
		({ id, title, path, published_at }) =>
			({ id, title, path, published_at }) as ZennPost,
	);
	const blog: Post[] = await Promise.all(
		[...localSlim, ...qiitaSlim, ...zennSlim].map(async (post) => {
			const withImage = { ...post, image: null } as Post;
			if (isExternal(withImage)) {
				return { ...withImage, image: await fetchOgImage(getHref(withImage)) };
			}
			// ローカル記事は自前の OGP 生成 API をサムネイルに使う
			const local = post as BlogPost;
			return {
				...withImage,
				image: `/api/og?title=${encodeURIComponent(local.title)}&date=${local.createdAt.slice(0, 10)}`,
			};
		}),
	);
	blog.sort(
		(a, b) => getPublishedDate(b).getTime() - getPublishedDate(a).getTime(),
	);
	return {
		props: {
			blog,
		},
		// Qiita / Zenn の新着を再デプロイなしで反映する (1時間ごと)
		revalidate: 3600,
	};
};
