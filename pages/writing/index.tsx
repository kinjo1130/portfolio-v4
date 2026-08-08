import { SeoHead } from "@/components/SeoHead";
import { getPublishedDate, isPostWithPath, isPostWithUrl } from "@/libs/common";
import { getBlogs } from "@/libs/content";
import type { QiitaPost } from "@/types/Qiita";
import type { BlogPost } from "@/types/blog";
import Link from "next/link";
import Layout from "../layout";

type Post = (BlogPost | QiitaPost | ZennPost) & { image: string | null };

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

export default function Blog({ blog }: { blog: Post[] }) {
	return (
		<Layout title="Writing">
			<SeoHead
				title="Writing"
				titleTemplate="Top"
				description="記事の一覧ページです"
				imgUrl="/favicon.ico"
			/>

			<section className="grid grid-cols-12 gap-6 lg:gap-8 pt-8">
				<header className="col-span-12 md:col-span-3">
					<p className="text-sm font-medium text-ink-secondary">Index</p>
					<p className="tnum text-sm font-medium text-ink-secondary mt-2">
						{String(blog.length).padStart(2, "0")} entries
					</p>
				</header>

				<ul className="col-span-12 md:col-span-9">
					{blog.map((post, i) => {
						const external = isExternal(post);
						const href = getHref(post);
						const published = getPublishedDate(post);
						const source = getSource(post);
						return (
							<li
								key={`${source ?? "blog"}-${post.id}`}
								className="grid grid-cols-12 gap-4 md:gap-6 border-b border-line py-6"
							>
								<span className="col-span-12 md:col-span-1 tnum small-caps text-sm font-medium text-ink-secondary md:pt-1">
									{String(i + 1).padStart(2, "0")}
								</span>
								<Link
									href={href}
									target={external ? "_blank" : undefined}
									rel={external ? "noopener noreferrer" : undefined}
									className="col-span-12 md:col-span-3 block border border-line rounded-card bg-surface-sunken overflow-hidden aspect-[1200/630]"
								>
									{post.image ? (
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
									)}
								</Link>
								<div className="col-span-12 md:col-span-8">
									<div className="flex items-baseline justify-between gap-4">
										<Link
											href={href}
											target={external ? "_blank" : undefined}
											rel={external ? "noopener noreferrer" : undefined}
											className="link-draw jp-display text-lg md:text-xl font-medium text-ink-primary no-underline"
										>
											{post.title}
										</Link>
										<span className="text-sm font-medium text-ink-secondary tnum shrink-0">
											{published.toLocaleDateString("ja-JP")}
										</span>
									</div>
									{source && (
										<p className="mt-2">
											<span className="inline-block text-xs font-medium text-ink-secondary border border-line rounded-badge px-2 py-0.5">
												{source}
											</span>
										</p>
									)}
								</div>
							</li>
						);
					})}
				</ul>
			</section>
		</Layout>
	);
}

const QIITA_USER = "abcshotaro616";
const ZENN_USER = "kinjyo";

async function fetchQiitaPosts(): Promise<QiitaPost[]> {
	try {
		const res = await fetch(
			`https://qiita.com/api/v2/users/${QIITA_USER}/items?per_page=100`,
		);
		if (!res.ok) return [];
		return (await res.json()) as QiitaPost[];
	} catch {
		return [];
	}
}

async function fetchZennPosts(): Promise<ZennPost[]> {
	try {
		const res = await fetch(
			`https://zenn.dev/api/articles?username=${ZENN_USER}&order=latest`,
		);
		if (!res.ok) return [];
		const data = (await res.json()) as { articles: ZennPost[] };
		return data.articles ?? [];
	} catch {
		return [];
	}
}

// 記事ページの og:image をビルド/ISR時に取得する (Qiita/Zenn の API は画像を返さないため)
async function fetchOgImage(url: string): Promise<string | null> {
	try {
		const res = await fetch(url);
		if (!res.ok) return null;
		const html = await res.text();
		const match = html.match(/<meta property="og:image" content="([^"]+)"/);
		return match ? match[1].replace(/&amp;/g, "&") : null;
	} catch {
		return null;
	}
}

export const getStaticProps = async () => {
	const [qiita, zenn] = await Promise.all([
		fetchQiitaPosts(),
		fetchZennPosts(),
	]);
	// 一覧表示に使うフィールドだけ残す (本文まで含めるとページデータが肥大するため)
	const localSlim = getBlogs().map(
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
