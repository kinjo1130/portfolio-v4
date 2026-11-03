import { SeoHead } from "@/components/SeoHead";
import { type About, getAbout } from "@/libs/content";
import Layout from "./layout";

export default function AboutPage({ about }: { about: About }) {
	return (
		<Layout title="自己紹介">
			<SeoHead
				title="自己紹介"
				titleTemplate="金城翔太郎 / Shotaro Kinjo"
				description="About me"
				imgUrl="/ogp.png"
			/>

			<section className="grid gap-6 pt-6 md:pt-8 lg:pt-6">
				<header>
					<h2 className="sr-only">Profile</h2>
					<dl className="flex flex-wrap gap-x-7 gap-y-4 text-base">
						<div>
							<dt className="text-sm font-medium text-ink-secondary">名前</dt>
							<dd className="font-semibold text-ink-primary mt-1">
								{about.name}
							</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-ink-secondary">
								生年月日
							</dt>
							<dd className="font-semibold text-ink-primary mt-1 tnum">
								{about.birth}
							</dd>
						</div>
						<div>
							<dt className="text-sm font-medium text-ink-secondary">出身</dt>
							<dd className="font-semibold text-ink-primary mt-1">
								{about.origin}
							</dd>
						</div>
					</dl>
				</header>

				<article
					className="prose prose-editorial max-w-prose"
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
