import { SeoHead } from "@/components/SeoHead";
import { formatDate } from "@/libs/common";
import { getWork, getWorks } from "@/libs/content";
import type { Work } from "@/types/work";
import Link from "next/link";
import Layout from "../layout";

export default function WorkDetail({ work }: { work: Work }) {
	return (
		<Layout title={work.title} eyebrow="Work">
			<SeoHead
				title="Work"
				titleTemplate={work.title}
				description={work.description}
				imgUrl="/favicon.ico"
			/>

			<section className="grid grid-cols-12 gap-6 lg:gap-8 pt-8">
				<aside className="col-span-12 md:col-span-3">
					<dl className="space-y-4 text-base">
						<div>
							<dt className="text-sm font-medium text-ink-secondary">
								Duration
							</dt>
							<dd className="font-semibold text-ink-primary mt-1 tnum">
								{formatDate(work.fromAt)} —{" "}
								{work.toAt ? formatDate(work.toAt) : "現在"}
							</dd>
						</div>
						{work.position.length > 0 && (
							<div>
								<dt className="text-sm font-medium text-ink-secondary">Role</dt>
								<dd className="font-semibold text-ink-primary mt-1">
									{work.position.join(" / ")}
								</dd>
							</div>
						)}
						<div>
							<dt className="text-sm font-medium text-ink-secondary">Status</dt>
							<dd className="mt-1">
								<span className="inline-block text-xs font-medium text-ink-secondary border border-line rounded-badge px-2 py-0.5">
									{work.toAt ? "closed" : "ongoing"}
								</span>
							</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-ink-secondary">
								Company
							</dt>
							<dd className="mt-1">
								<a
									href={work.link}
									target="_blank"
									rel="noopener noreferrer"
									className="link-draw text-sm font-medium text-ink-primary no-underline"
								>
									Visit site →
								</a>
							</dd>
						</div>
					</dl>
				</aside>

				<article className="col-span-12 md:col-span-9">
					<p className="text-lg md:text-xl font-medium leading-relaxed mb-10">
						{work.description}
					</p>
					<div
						className="prose prose-editorial max-w-none"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: rendered markdown
						dangerouslySetInnerHTML={{ __html: work.body }}
					/>
					<div className="mt-16 pt-6 border-t border-line">
						<Link
							href="/work"
							className="text-sm font-medium text-ink-primary link-draw no-underline"
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
	const works = await getWorks();
	const paths = works.map((w) => `/work/${w.slug}`);
	return { paths, fallback: false };
};

export const getStaticProps = async (context: {
	params: { slug: string };
}) => {
	const work = await getWork(context.params.slug);
	if (!work) {
		return { notFound: true as const };
	}
	return { props: { work } };
};
