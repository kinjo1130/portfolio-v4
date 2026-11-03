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
		title: "画像を圧縮する",
		description:
			"画像をブラウザ内で圧縮・形式変換。WebP / AVIF / JPG / PNG。リアルタイムに削減率を確認。",
		tags: ["image", "compress", "convert"],
	},
	{
		slug: "crop",
		title: "画像を切り抜く",
		description:
			"OGP / SNS アイコン / 16:9 などのプリセットで素早くトリミング。ローカル完結。",
		tags: ["image", "crop", "ogp"],
	},
];

export default function ToolsIndex() {
	return (
		<Layout title="ツール">
			<SeoHead
				title="ツール"
				titleTemplate="金城翔太郎 / Shotaro Kinjo"
				description="ブラウザ内で完結する自作ユーティリティツール。"
				imgUrl="/ogp.png"
			/>

			<section className="grid gap-4 pt-6 md:pt-8 lg:pt-6">
				<header className="grid gap-2">
					<p className="tnum text-sm font-medium text-ink-secondary">
						{TOOLS.length}件
					</p>
					<p className="text-base text-ink-secondary leading-relaxed">
						ブラウザ内で完結する自作の小ユーティリティ。サーバー送信なし。
					</p>
				</header>

				<ul>
					{TOOLS.map((tool, i) => (
						<li
							key={tool.slug}
							className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-3 md:gap-x-6 border-b border-line py-6 lg:py-5"
						>
							<span className="tnum small-caps text-sm font-medium text-ink-secondary">
								{String(i + 1).padStart(2, "0")}
							</span>
							<div className="min-w-0">
								<Link
									href={`/tools/${tool.slug}`}
									className="link-draw jp-display text-xl md:text-2xl font-medium text-ink-primary no-underline"
								>
									{tool.title}
								</Link>
								<p className="text-base text-ink-secondary mt-2 leading-relaxed">
									{tool.description}
								</p>
								<p className="mt-3 flex flex-wrap gap-2">
									{tool.tags.map((tag) => (
										<span
											key={tag}
											className="inline-block text-xs font-medium text-ink-secondary border border-line rounded-badge px-2 py-0.5"
										>
											{tag}
										</span>
									))}
								</p>
							</div>
							<div className="md:text-right mt-2 md:mt-0">
								<Link
									href={`/tools/${tool.slug}`}
									className="text-sm font-medium text-ink-primary link-draw inline-block no-underline"
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
