import { SITE_NAME, SITE_URL } from "@/libs/site";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
type MetaTypes = {
	title?: string;
	titleTemplate?: string;
	description?: string;
	ogType?: string;
	imgUrl?: string;
};
export const SeoHead = ({
	title,
	titleTemplate,
	description,
	ogType,
	imgUrl,
}: MetaTypes) => {
	const router = useRouter();
	const siteUrl = SITE_URL;
	// クエリやハッシュを canonical に含めない
	const Url = `${siteUrl}${router.asPath.split(/[?#]/)[0]}`;
	const siteTitle = titleTemplate ? `${title} - ${titleTemplate}` : title;
	// OGP 仕様上 og:image は絶対 URL が必須
	const ogImageUrl = imgUrl?.startsWith("/") ? `${siteUrl}${imgUrl}` : imgUrl;
	return (
		<Head>
			<meta name="viewport" content={"width=device-width, initial-scale=1"} />
			<title>{siteTitle}</title>
			<link href={Url} rel="canonical" />
			<meta name="twitter:card" content={"summary_large_image"} />
			<meta property="og:site_name" content={SITE_NAME} />
			<meta property="og:locale" content="ja_JP" />
			<meta property="og:image" content={ogImageUrl} />
			<meta name="twitter:image" content={ogImageUrl} />
			<meta property="og:title" content={siteTitle} />
			<meta property="og:url" content={Url} />
			<meta name="description" content={description} />
			<meta property="og:description" content={description} />
			<meta property="og:type" content={ogType ?? "website"} />
		</Head>
	);
};
