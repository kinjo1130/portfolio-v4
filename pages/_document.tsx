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
				{/* 検索結果の favicon は 48px の倍数が必要。ico に 16/32/48 を同梱し、大きい画面向けに PNG も出す */}
				<link rel="icon" href="/favicon.ico" sizes="48x48" />
				<link
					rel="icon"
					type="image/png"
					sizes="192x192"
					href="/icon-192.png"
				/>
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<link rel="manifest" href="/site.webmanifest" />
				{/* meta には CSS 変数が使えないので、--neutral-950 の値をそのまま書く */}
				<meta name="theme-color" content="#0b0b0b" />
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
