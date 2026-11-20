// canonical・OGP・sitemap が指す本番の URL。プレビュー環境では NEXT_PUBLIC_DEFAULT_SITE_URL で上書きする
export const SITE_URL =
	process.env.NEXT_PUBLIC_DEFAULT_SITE_URL || "https://www.kinjo.me";

// 検索結果のサイト名と og:site_name に使う
export const SITE_NAME = "金城翔太郎 / Shotaro Kinjo";
