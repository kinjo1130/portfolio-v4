import fs from "node:fs";
import path from "node:path";
import { SeoHead } from "@/components/SeoHead";
import Image from "next/image";
import Layout from "../layout";

type TalkLink = {
	label: string;
	url: string;
};

type Talk = {
	title: string;
	event: string;
	date: string;
	image: {
		url: string;
		width: number;
		height: number;
	};
	links: TalkLink[];
};

const year = (iso: string) => new Date(iso).getFullYear();

export default function Talks({ talks }: { talks: Talk[] }) {
	return (
		<Layout title="登壇">
			<SeoHead
				title="登壇"
				titleTemplate="金城翔太郎 / Shotaro Kinjo"
				description="イベントでの登壇と発表の一覧です。"
				imgUrl="/ogp.png"
			/>

			<section className="grid grid-cols-12 gap-y-4 md:gap-6 lg:gap-8 pt-6 md:pt-8">
				<header className="col-span-12 md:col-span-3 flex items-baseline gap-3 md:block">
					<p className="text-sm font-medium text-ink-secondary">一覧</p>
					<p className="tnum text-sm font-medium text-ink-secondary md:mt-2">
						{talks.length}件
					</p>
				</header>

				<ul className="col-span-12 md:col-span-9">
					{talks.map((talk, i) => {
						const primary = talk.links[0];
						return (
							<li
								key={`${talk.date}-${talk.title}`}
								className="grid grid-cols-12 gap-4 md:gap-6 border-b border-line py-6"
							>
								<span className="col-span-12 md:col-span-1 tnum small-caps text-sm font-medium text-ink-secondary md:pt-1">
									{String(i + 1).padStart(2, "0")}
								</span>
								<a
									href={primary.url}
									target="_blank"
									rel="noopener noreferrer"
									className="col-span-12 md:col-span-4 block border border-line rounded-card bg-surface-sunken overflow-hidden aspect-video"
								>
									<Image
										src={talk.image.url}
										alt={talk.title}
										width={talk.image.width}
										height={talk.image.height}
										className="w-full h-full object-contain"
									/>
								</a>
								<div className="col-span-12 md:col-span-7">
									<div className="flex items-baseline justify-between gap-4">
										<a
											href={primary.url}
											target="_blank"
											rel="noopener noreferrer"
											className="link-draw jp-display text-lg md:text-xl font-medium text-ink-primary no-underline"
										>
											{talk.title}
										</a>
										<span className="text-sm font-medium text-ink-secondary tnum shrink-0">
											{year(talk.date)}
										</span>
									</div>
									<p className="text-sm font-medium text-ink-secondary mt-1">
										{talk.event}
									</p>
									<p className="mt-3 flex flex-wrap gap-2">
										{talk.links.map((link) => (
											<a
												key={link.url}
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-block text-xs font-medium text-ink-secondary border border-line rounded-badge px-2 py-0.5 no-underline hover:text-ink-primary"
											>
												{link.label}
											</a>
										))}
									</p>
								</div>
							</li>
						);
					})}
				</ul>
				<p className="col-span-12 md:col-start-4 md:col-span-9 text-sm font-medium mt-2">
					<a
						href="https://speakerdeck.com/kinjyo"
						target="_blank"
						rel="noopener noreferrer"
						className="link-draw text-ink-primary"
					>
						Speaker Deck で他のスライドを見る →
					</a>
				</p>
			</section>
		</Layout>
	);
}

export const getStaticProps = async () => {
	const raw = fs.readFileSync(
		path.join(process.cwd(), "content", "talks.json"),
		"utf-8",
	);
	const talks = (JSON.parse(raw) as Talk[]).sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);
	return {
		props: { talks },
	};
};
