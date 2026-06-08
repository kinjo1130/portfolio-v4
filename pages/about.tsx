import { SeoHead } from "@/components/SeoHead";
import { type About, getAbout } from "@/libs/content";
import Layout from "./layout";

export default function AboutPage({ about }: { about: About }) {
	return (
		<Layout title="About">
			<SeoHead
				title="About"
				titleTemplate="About"
				description="About me"
				imgUrl="/favicon.ico"
			/>
			<p>名前: {about.name}</p>
			<p>生年月日: {about.birth}</p>
			<p>出身地: {about.origin}</p>
			<div
				className="prose min-w-full mt-6"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: rendered markdown
				dangerouslySetInnerHTML={{ __html: about.body }}
			/>
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
