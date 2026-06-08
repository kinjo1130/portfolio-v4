import { SeoHead } from "@/components/SeoHead";
import Link from "next/link";
import Layout from "../layout";

type Tool = {
	slug: string;
	title: string;
	description: string;
	tags: string[];
};

const TOOLS: Tool[] = [
	{
		slug: "compress",
		title: "Image Compress",
		description:
			"画像をブラウザ内で圧縮・形式変換。WebP / AVIF / JPG / PNG。リアルタイムに削減率を確認。",
		tags: ["image", "compress", "convert"],
	},
	{
		slug: "crop",
		title: "Image Crop",
		description:
			"OGP / SNS アイコン / 16:9 などのプリセットで素早くトリミング。ローカル完結。",
		tags: ["image", "crop", "ogp"],
	},
];

export default function ToolsIndex() {
	return (
		<Layout title="Tools" eyebrow="§ 06 — Tools" issueNumber="§ 06 — 2026">
			<SeoHead
				title="Tools"
				titleTemplate="Tools"
				description="ブラウザ内で完結する自作ユーティリティツール。"
				imgUrl="/favicon.ico"
			/>

			<section className="grid grid-cols-12 gap-6 lg:gap-8 pt-8">
				<header className="col-span-12 md:col-span-3">
					<p className="small-caps text-sm font-semibold text-ink-primary tracking-wider">
						Index
					</p>
					<p className="tnum text-sm font-medium text-ink-secondary mt-2">
						{String(TOOLS.length).padStart(2, "0")} tools
					</p>
					<p className="text-sm text-ink-secondary mt-4 leading-relaxed">
						ブラウザ内で完結する自作の小ユーティリティ。サーバー送信なし。
					</p>
				</header>

				<ul className="col-span-12 md:col-span-9">
					{TOOLS.map((tool, i) => (
						<li
							key={tool.slug}
							className="grid grid-cols-12 items-baseline gap-3 border-b border-line py-6"
						>
							<span className="col-span-1 tnum small-caps text-sm font-medium text-ink-secondary">
								{String(i + 1).padStart(2, "0")}
							</span>
							<div className="col-span-11 md:col-span-8">
								<Link
									href={`/tools/${tool.slug}`}
									className="link-draw jp-display text-xl md:text-2xl font-medium text-ink-primary no-underline"
								>
									{tool.title}
								</Link>
								<p className="text-sm text-ink-secondary mt-2 leading-relaxed">
									{tool.description}
								</p>
								<p className="small-caps text-xs font-semibold text-ink-secondary mt-2 tracking-wider">
									{tool.tags.join(" / ")}
								</p>
							</div>
							<div className="col-span-12 md:col-span-3 md:text-right mt-2 md:mt-0">
								<Link
									href={`/tools/${tool.slug}`}
									className="small-caps text-xs font-semibold text-ink-primary link-draw inline-block no-underline"
								>
									open →
								</Link>
							</div>
						</li>
					))}
				</ul>
			</section>
		</Layout>
	);
}
