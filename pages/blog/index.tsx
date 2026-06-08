import { SeoHead } from "@/components/SeoHead";
import { getPublishedDate, isPostWithPath, isPostWithUrl } from "@/libs/common";
import { getBlogs } from "@/libs/content";
import type { BlogPost, BlogPosts } from "@/types/blog";
import type { QiitaPost } from "@/types/Qiita";
import Link from "next/link";
import Layout from "../layout";

function getHref(post: BlogPost | QiitaPost | ZennPost): string {
	if (isPostWithUrl(post)) return post.url;
	if (isPostWithPath(post)) return `https://zenn.dev/${post.path}`;
	return `/blog/${post.id}`;
}

function isExternal(post: BlogPost | QiitaPost | ZennPost): boolean {
	return isPostWithUrl(post) || isPostWithPath(post);
}

export default function Blog({
	blog,
}: {
	blog: (BlogPost | QiitaPost | ZennPost)[];
}) {
	return (
		<Layout
			title="Writing"
			eyebrow="§ 05 — Blog"
			issueNumber="§ 05 — 2026"
		>
			<SeoHead
				title="Blog"
				titleTemplate="Top"
				description="Blogの一覧ページです"
				imgUrl="/favicon.ico"
			/>

			<section className="grid grid-cols-12 gap-6 lg:gap-8 pt-8">
				<header className="col-span-12 md:col-span-3">
					<p className="small-caps text-sm font-semibold text-ink-primary tracking-wider">
						Index
					</p>
					<p className="tnum text-sm font-medium text-ink-secondary mt-2">
						{String(blog.length).padStart(2, "0")} entries
					</p>
				</header>

				<ul className="col-span-12 md:col-span-9">
					{blog.map((post, i) => {
						const external = isExternal(post);
						const href = getHref(post);
						const published = getPublishedDate(post);
						return (
							<li
								key={post.id}
								className="grid grid-cols-12 items-baseline gap-3 border-b border-line py-5"
							>
								<span className="col-span-1 tnum small-caps text-sm font-medium text-ink-secondary">
									{String(i + 1).padStart(2, "0")}
								</span>
								<Link
									href={href}
									target={external ? "_blank" : undefined}
									rel={external ? "noopener noreferrer" : undefined}
									className="col-span-8 md:col-span-8 link-draw jp-display text-lg md:text-xl font-medium text-ink-primary no-underline"
								>
									{post.title}
								</Link>
								<span className="col-span-3 md:col-span-3 small-caps text-sm font-semibold text-ink-primary tnum text-right">
									{published.toLocaleDateString("ja-JP")}
								</span>
							</li>
						);
					})}
				</ul>
			</section>
		</Layout>
	);
}

export const getStaticProps = async () => {
	const blog: BlogPosts = getBlogs();
	return {
		props: {
			blog,
		},
	};
};
