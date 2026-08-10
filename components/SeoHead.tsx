import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
type MetaTypes = {
	title?: string;
	titleTemplate?: string;
	description?: string;
	ogType?: string;
	imgUrl?: string;
	favicon?: string;
};
export const SeoHead = ({
	title,
	titleTemplate,
	description,
	ogType,
	imgUrl,
	favicon,
}: MetaTypes) => {
	const router = useRouter();
	const siteUrl =
		process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || "https://www.kinjo.me";
	const Url = `${siteUrl}${router.asPath}`;
	const siteTitle = titleTemplate ? `${title} - ${titleTemplate}` : title;
	// OGP 仕様上 og:image は絶対 URL が必須
	const ogImageUrl = imgUrl?.startsWith("/") ? `${siteUrl}${imgUrl}` : imgUrl;
	const faviconUrl = favicon ? favicon : "/favicon.ico";
	return (
		<Head>
			<meta name="viewport" content={"width=device-width, initial-scale=1"} />
			<title>{siteTitle}</title>
			<link href={Url} rel="canonical" />
			<meta name="twitter:card" content={"summary_large_image"} />
			<meta property="og:image" content={ogImageUrl} />
			<meta property="og:title" content={siteTitle} />
			<meta property="og:url" content={Url} />
			<meta name="description" content={description} />
			<meta property="og:description" content={description} />
			<meta property="og:type" content={ogType} />
			<link rel="icon" type="image/svg+xml" href={faviconUrl} />
		</Head>
	);
};
