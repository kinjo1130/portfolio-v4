/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// 管理画面のローカル保存はパスを動的に組み立てるため、Next がプロジェクト全体を
	// 関数バンドルに含めようとする。静的配信される画像まで抱き込まないよう除外する。
	outputFileTracingExcludes: {
		"/api/admin/**": ["./public/**", "./.next/cache/**"],
	},
	async redirects() {
		// 旧 /blog パスからの恒久リダイレクト (外部からのリンク・検索インデックス対策)
		return [
			{
				source: "/blog",
				destination: "/writing",
				permanent: true,
			},
			{
				source: "/blog/:id",
				destination: "/writing/:id",
				permanent: true,
			},
			// 職歴のスラッグをプロダクト名 (OWNED) から社名 (ONDO) に変更した
			{
				source: "/work/owned",
				destination: "/work/ondo",
				permanent: true,
			},
		];
	},
	async headers() {
		return [
			// 管理画面はログインしないと開けないが、URL 自体も検索に載せない
			{
				source: "/admin",
				headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
			},
			{
				source: "/admin/:path*",
				headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
			},
			{
				source: "/api/:path*",
				headers: [
					{
						key: "Access-Control-Allow-Origin",
						value: "*", // または、必要なオリジンを設定
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET,POST,PUT,DELETE,OPTIONS",
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "X-Requested-With, Content-Type, Accept",
					},
				],
			},
		];
	},
};

export default nextConfig;
