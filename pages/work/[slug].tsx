import { SeoHead } from "@/components/SeoHead";
import { formatDate } from "@/libs/common";
import { getWork, getWorks } from "@/libs/content";
import type { Work } from "@/types/work";
import Link from "next/link";
import Layout from "../layout";

export default function WorkDetail({ work }: { work: Work }) {
	return (
		<>
			<SeoHead
				title="Work"
				titleTemplate={work.title}
				description={work.description}
				imgUrl="/favicon.ico"
			/>
			<Layout title={work.title} className="md:px-20">
				<div className="mb-6">
					<div className="flex gap-2 items-center text-slate-400 font-semibold text-sm">
						<p>{formatDate(work.fromAt)}</p>
						<p>-</p>
						<p>{work.toAt ? formatDate(work.toAt) : "現在"}</p>
					</div>
					{work.position.length > 0 && (
						<p className="text-sm text-slate-500 mt-1">
							{work.position.join(" / ")}
						</p>
					)}
					<a
						href={work.link}
						target="_blank"
						rel="noopener noreferrer"
						className="underline text-sm"
					>
						会社情報
					</a>
				</div>
				<div
					className="prose min-w-full"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: rendered markdown
					dangerouslySetInnerHTML={{ __html: work.body }}
				/>
				<div className="flex justify-center mt-20">
					<Link href="/work" className="underline">
						Work 一覧に戻る
					</Link>
				</div>
			</Layout>
		</>
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
