/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
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
		];
	},
	async headers() {
		return [
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
