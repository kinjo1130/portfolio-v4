import { SeoHead } from "@/components/SeoHead";
import { TableOfContents } from "@/components/TableOfContents";
import { type About, getAbout } from "@/libs/content";
import { renderToc } from "@/libs/renderDoc";
import Layout from "./layout";

// 記事ページ (pages/writing/[id].tsx) と同じ組み方にする: 左にプロフィールと目次、右に本文
export default function AboutPage({ about }: { about: About }) {
	const toc = renderToc(about.body);
	const profile = [
		{ label: "名前", value: about.name },
		{ label: "生年月日", value: about.birth, tnum: true },
		{ label: "出身", value: about.origin },
	];

	return (
		<Layout title="自己紹介">
			<SeoHead
				title="自己紹介"
				titleTemplate="金城翔太郎 / Shotaro Kinjo"
				description="About me"
				imgUrl="/ogp.png"
			/>

			<section className="grid grid-cols-12 gap-y-6 md:gap-6 pt-6 md:pt-8 lg:pt-6">
				<aside className="col-span-12 md:col-span-3">
					<div className="md:sticky md:top-10 space-y-6">
						<dl className="space-y-4 text-sm">
							{profile.map((item) => (
								<div key={item.label}>
									<dt className="text-sm font-medium text-ink-secondary">
										{item.label}
									</dt>
									<dd
										className={`font-semibold text-ink-primary mt-1 ${item.tnum ? "tnum" : ""}`}
									>
										{item.value}
									</dd>
								</div>
							))}
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

				<article
					className="col-span-12 md:col-span-9 prose prose-editorial max-w-none"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: rendered markdown
					dangerouslySetInnerHTML={{ __html: about.body }}
				/>
			</section>
		</Layout>
	);
}

export const getStaticProps = async () => {
	return {
		props: {
			about: await getAbout(),
		},
	};
};
