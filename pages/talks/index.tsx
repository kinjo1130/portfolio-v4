import fs from "node:fs";
import path from "node:path";
import { SeoHead } from "@/components/SeoHead";
import Layout from "../layout";

type TalkLink = {
	label: string;
	url: string;
};

type Talk = {
	title: string;
	event: string;
	date: string;
	links: TalkLink[];
};

const year = (iso: string) => new Date(iso).getFullYear();

export default function Talks({ talks }: { talks: Talk[] }) {
	return (
		<Layout title="Talks">
			<SeoHead
				title="Talks"
				titleTemplate="Top"
				description="登壇・発表の一覧ページです"
				imgUrl="/favicon.ico"
			/>

			<section className="grid grid-cols-12 gap-6 lg:gap-8 pt-8">
				<header className="col-span-12 md:col-span-3">
					<p className="text-sm font-medium text-ink-secondary">Index</p>
					<p className="tnum text-sm font-medium text-ink-secondary mt-2">
						{String(talks.length).padStart(2, "0")} entries
					</p>
				</header>

				<ul className="col-span-12 md:col-span-9">
					{talks.map((talk, i) => (
						<li
							key={`${talk.date}-${talk.title}`}
							className="grid grid-cols-12 gap-3 border-b border-line py-5"
						>
							<span className="col-span-1 tnum small-caps text-sm font-medium text-ink-secondary">
								{String(i + 1).padStart(2, "0")}
							</span>
							<div className="col-span-9 md:col-span-9">
								<p className="jp-display text-lg md:text-xl font-medium text-ink-primary">
									{talk.title}
								</p>
								<p className="text-sm font-medium text-ink-secondary mt-1">
									{talk.event}
								</p>
								<p className="mt-2 flex flex-wrap gap-2">
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
							<span className="col-span-2 text-sm font-medium text-ink-secondary tnum text-right">
								{year(talk.date)}
							</span>
						</li>
					))}
				</ul>
				<p className="col-span-12 md:col-start-4 md:col-span-9 text-sm font-medium mt-2">
					<a
						href="https://speakerdeck.com/kinjyo"
						target="_blank"
						rel="noopener noreferrer"
						className="link-draw text-ink-primary"
					>
						see all slides on Speaker Deck →
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
