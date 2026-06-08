import { SeoHead } from "@/components/SeoHead";
import { type About, getAbout } from "@/libs/content";
import Layout from "./layout";

export default function AboutPage({ about }: { about: About }) {
	return (
		<Layout title="About" eyebrow="§ 02 — About" issueNumber="§ 02 — 2026">
			<SeoHead
				title="About"
				titleTemplate="About"
				description="About me"
				imgUrl="/favicon.ico"
			/>

			<section className="grid grid-cols-12 gap-6 lg:gap-8 pt-8">
				<header className="col-span-12 md:col-span-3">
					<p className="small-caps text-sm font-semibold text-ink-primary mb-6 tracking-wider">
						Profile
					</p>
					<dl className="space-y-4 text-sm">
						<div>
							<dt className="small-caps text-xs font-semibold text-ink-secondary tracking-wider">
								Name
							</dt>
							<dd className="font-semibold text-ink-primary mt-1">
								{about.name}
							</dd>
						</div>
						<div>
							<dt className="small-caps text-xs font-semibold text-ink-secondary tracking-wider">
								Birth
							</dt>
							<dd className="font-semibold text-ink-primary mt-1 tnum">
								{about.birth}
							</dd>
						</div>
						<div>
							<dt className="small-caps text-xs font-semibold text-ink-secondary tracking-wider">
								Origin
							</dt>
							<dd className="font-semibold text-ink-primary mt-1">
								{about.origin}
							</dd>
						</div>
					</dl>
				</header>

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
