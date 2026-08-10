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

			<section className="grid grid-cols-12 gap-y-6 md:gap-6 lg:gap-8 pt-8">
				<header className="col-span-12 md:col-span-3">
					<p className="text-sm font-medium text-ink-secondary">一覧</p>
					<p className="tnum text-sm font-medium text-ink-secondary mt-2">
						{TOOLS.length}件
					</p>
					<p className="text-base text-ink-secondary mt-4 leading-relaxed">
						ブラウザ内で完結する自作の小ユーティリティ。サーバー送信なし。
					</p>
				</header>

				<ul className="col-span-12 md:col-span-9">
					{TOOLS.map((tool, i) => (
						<li
							key={tool.slug}
							className="grid grid-cols-12 items-baseline gap-3 md:gap-4 border-b border-line py-6"
						>
							<span className="col-span-12 md:col-span-1 tnum small-caps text-sm font-medium text-ink-secondary">
								{String(i + 1).padStart(2, "0")}
							</span>
							<div className="col-span-12 md:col-span-8">
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
							<div className="col-span-12 md:col-span-3 md:text-right mt-2 md:mt-0">
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
