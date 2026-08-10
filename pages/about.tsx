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

			<section className="grid grid-cols-12 gap-6 lg:gap-8 pt-8">
				<header className="col-span-12 md:col-span-3">
					<p className="text-sm font-medium text-ink-secondary mb-6">Profile</p>
					<dl className="space-y-4 text-base">
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
