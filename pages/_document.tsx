import { SITE_NAME, SITE_URL } from "@/libs/site";
import { Head, Html, Main, NextScript } from "next/document";

// 検索結果のサイト名は WebSite の構造化データから決まる。https://developers.google.com/search/docs/appearance/site-names
const websiteJsonLd = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: SITE_NAME,
	alternateName: ["kinjo.me", "金城翔太郎", "Shotaro Kinjo"],
	url: `${SITE_URL}/`,
};

export default function Document() {
	return (
		<Html lang="ja">
			<Head>
				<link rel="icon" href="/favicon.ico" />
				{/* meta には CSS 変数が使えないので、ページ背景 (--neutral-50) の値をそのまま書く */}
				<meta name="theme-color" content="#fafafa" />
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: 自前の定数を JSON にしたものだけを埋め込む
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
