import { SeoHead } from "@/components/SeoHead";
import { TableOfContents } from "@/components/TableOfContents";
import { formatDate } from "@/libs/common";
import { getBlog, getBlogs } from "@/libs/content";
import { renderToc } from "@/libs/renderDoc";
import type { BlogPost } from "@/types/blog";
import Link from "next/link";
import Layout from "../layout";

export default function BlogId({ blog }: { blog: BlogPost }) {
	const toc = renderToc(blog.body);
	const isDevImageUrl =
		process.env.NODE_ENV === "development"
			? "http://localhost:3000"
			: "https://kinjo.me";

	return (
		<Layout
			title={blog.title}
			eyebrow="§ 05 — Writing"
			issueNumber="§ 05 — 2026"
		>
			<SeoHead
				title="Blog"
				titleTemplate={blog.title}
				description={blog.description}
				imgUrl={`${isDevImageUrl}/api/og?title=${encodeURIComponent(blog.title)}`}
			/>

			<section className="grid grid-cols-12 gap-6 lg:gap-8 pt-8">
				<aside className="col-span-12 md:col-span-3">
					<div className="md:sticky md:top-10 space-y-6">
						<dl className="space-y-4 text-sm">
							<div>
								<dt className="small-caps text-xs font-semibold text-ink-secondary tracking-wider">
									Published
								</dt>
								<dd className="font-semibold text-ink-primary mt-1 tnum">
									{formatDate(blog.createdAt)}
								</dd>
							</div>
							{blog.updatedAt && blog.updatedAt !== blog.createdAt && (
								<div>
									<dt className="small-caps text-xs font-semibold text-ink-secondary tracking-wider">
										Updated
									</dt>
									<dd className="font-semibold text-ink-primary mt-1 tnum">
										{formatDate(blog.updatedAt)}
									</dd>
								</div>
							)}
						</dl>
						{toc.length > 0 && (
							<div>
								<p className="small-caps text-xs font-semibold text-ink-secondary tracking-wider mb-2">
									Contents
								</p>
								<TableOfContents toc={toc} />
							</div>
						)}
					</div>
				</aside>

				<article className="col-span-12 md:col-span-9">
					{blog.description && (
						<p className="text-lg md:text-xl font-medium leading-relaxed mb-10">
							{blog.description}
						</p>
					)}
					<div
						className="prose prose-editorial max-w-none"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: rendered HTML
						dangerouslySetInnerHTML={{ __html: blog.body }}
					/>

					<div className="mt-16 pt-6 border-t border-line">
						<Link
							href="/blog"
							className="small-caps text-sm font-semibold text-ink-primary link-draw no-underline"
						>
							← Back to index
						</Link>
					</div>
				</article>
			</section>
		</Layout>
	);
}

export const getStaticPaths = async () => {
	const paths = getBlogs().map((post) => `/blog/${post.id}`);
	return { paths, fallback: false };
};

export const getStaticProps = async (context: { params: { id: string } }) => {
	const blog = getBlog(context.params.id);
	if (!blog) {
		return { notFound: true as const };
	}
	return { props: { blog } };
};
