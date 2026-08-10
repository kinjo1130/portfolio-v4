import { SeoHead } from "@/components/SeoHead";
import { ShareLinks } from "@/components/ShareLinks";
import { TableOfContents } from "@/components/TableOfContents";
import { formatDate, isDev } from "@/libs/common";
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
	// シェア先には canonical と同じ URL を渡す (プレビュー URL を共有させない)
	const shareUrl = `${isDev}/writing/${blog.id}`;

	return (
		<Layout title={blog.title} eyebrow="記事">
			<SeoHead
				title={blog.title}
				titleTemplate="金城翔太郎 / Shotaro Kinjo"
				description={blog.description}
				imgUrl={`${isDevImageUrl}/api/og?title=${encodeURIComponent(blog.title)}&date=${blog.createdAt.slice(0, 10)}`}
			/>

			<section className="grid grid-cols-12 gap-6 lg:gap-8 pt-8">
				<aside className="col-span-12 md:col-span-3">
					<div className="md:sticky md:top-10 space-y-6">
						<dl className="space-y-4 text-sm">
							<div>
								<dt className="text-sm font-medium text-ink-secondary">
									公開日
								</dt>
								<dd className="font-semibold text-ink-primary mt-1 tnum">
									{formatDate(blog.createdAt)}
								</dd>
							</div>
							{blog.updatedAt && blog.updatedAt !== blog.createdAt && (
								<div>
									<dt className="text-sm font-medium text-ink-secondary">
										更新日
									</dt>
									<dd className="font-semibold text-ink-primary mt-1 tnum">
										{formatDate(blog.updatedAt)}
									</dd>
								</div>
							)}
						</dl>
						{toc.length > 0 && (
							<div>
								<p className="text-sm font-medium text-ink-secondary mb-2">
									目次
								</p>
								<TableOfContents toc={toc} />
							</div>
						)}
					</div>
				</aside>

				<article className="col-span-12 md:col-span-9">
					{blog.description && (
						<p className="text-lg md:text-xl font-medium leading-relaxed mb-6">
							{blog.description}
						</p>
					)}
					<div
						className="prose prose-editorial max-w-none"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: rendered HTML
						dangerouslySetInnerHTML={{ __html: blog.body }}
					/>

					<div className="mt-8 pt-5 border-t border-line flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<Link
							href="/writing"
							className="text-sm font-medium text-ink-primary link-draw no-underline"
						>
							← 記事一覧へ
						</Link>
						<ShareLinks title={blog.title} url={shareUrl} />
					</div>
				</article>
			</section>
		</Layout>
	);
}

export const getStaticPaths = async () => {
	const paths = (await getBlogs()).map((post) => `/writing/${post.id}`);
	return { paths, fallback: false };
};

export const getStaticProps = async (context: { params: { id: string } }) => {
	const blog = await getBlog(context.params.id);
	if (!blog) {
		return { notFound: true as const };
	}
	return { props: { blog } };
};
