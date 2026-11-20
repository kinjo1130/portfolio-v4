import { getBlogs, getProducts, getWorks } from "@/libs/content";
import { SITE_URL } from "@/libs/site";
import type { GetServerSideProps } from "next";

type Entry = { path: string; lastmod?: string };

const STATIC_PATHS = [
	"/",
	"/about",
	"/work",
	"/products",
	"/writing",
	"/talks",
	"/uses",
];

const toDate = (iso: string) => new Date(iso).toISOString().slice(0, 10);

const render = (entries: Entry[]) =>
	`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(e) =>
			`  <url><loc>${SITE_URL}${e.path}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}</url>`,
	)
	.join("\n")}
</urlset>
`;

// ページとしては描画しない。getServerSideProps で XML を書き込んで応答を終える
export default function Sitemap() {
	return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const [blogs, works, products] = await Promise.all([
		getBlogs(),
		getWorks(),
		getProducts(),
	]);
	const entries: Entry[] = [
		...STATIC_PATHS.map((path) => ({ path })),
		...works.map((w) => ({ path: `/work/${w.slug}` })),
		...products.map((p) => ({
			path: `/products/${p.slug}`,
			lastmod: toDate(p.updatedAt),
		})),
		...blogs.map((b) => ({
			path: `/writing/${b.id}`,
			lastmod: toDate(b.updatedAt),
		})),
	];
	res.setHeader("Content-Type", "application/xml; charset=utf-8");
	res.setHeader("Cache-Control", "public, s-maxage=86400");
	res.write(render(entries));
	res.end();
	return { props: {} };
};
