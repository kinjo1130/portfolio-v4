import { IndexRow, IndexSection } from "@/components/IndexList";
import Image from "next/image";

const ICON_SIZE = 20;

const SpeakerDeckIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={ICON_SIZE}
		height={ICON_SIZE}
		viewBox="0 0 32 32"
		aria-hidden="true"
		fill="currentColor"
	>
		<path d="M 8 8 C 5.243 8 3 10.243 3 13 C 3 15.757 5.243 18 8 18 L 14 18 C 14.551 18 15 18.448 15 19 C 15 19.552 14.551 20 14 20 L 5 20 C 3.896 20 3 20.896 3 22 C 3 23.104 3.896 24 5 24 L 14 24 C 16.757 24 19 21.757 19 19 C 19 16.243 16.757 14 14 14 L 8 14 C 7.449 14 7 13.552 7 13 C 7 12.448 7.449 12 8 12 L 15 12 C 16.104 12 17 11.104 17 10 C 17 8.896 16.104 8 15 8 L 8 8 z M 18.445312 8 C 18.789313 8.59 19 9.268 19 10 C 19 10.734 18.783453 11.409 18.439453 12 L 24 12 C 24.552 12 25 12.448 25 13 L 25 19 C 25 19.552 24.552 20 24 20 L 20.919922 20 C 20.695922 21.556 19.963672 22.949 18.888672 24 L 25 24 C 27.209 24 29 22.209 29 20 L 29 12 C 29 9.791 27.209 8 25 8 L 18.445312 8 z" />
	</svg>
);

const LINKS: {
	name: string;
	handle: string;
	url: string;
	icon: string | null;
}[] = [
	{
		name: "X",
		handle: "@kinjyo1130",
		url: "https://twitter.com/kinjyo1130",
		icon: "/sns/x.svg",
	},
	{
		name: "GitHub",
		handle: "kinjo1130",
		url: "https://github.com/kinjo1130",
		icon: "/sns/github.png",
	},
	{
		name: "Instagram",
		handle: "kinjyo1130",
		url: "https://www.instagram.com/kinjyo1130/",
		icon: "/sns/instagram.svg",
	},
	{
		name: "Qiita",
		handle: "abcshotaro616",
		url: "https://qiita.com/abcshotaro616",
		icon: "/sns/qiita.png",
	},
	{
		name: "Zenn",
		handle: "kinjyo",
		url: "https://zenn.dev/kinjyo",
		icon: "/sns/zenn.svg",
	},
	{
		name: "Speaker Deck",
		handle: "kinjyo",
		url: "https://speakerdeck.com/kinjyo",
		icon: null,
	},
	{
		name: "Scrapbox",
		handle: "kinjo1130",
		url: "https://scrapbox.io/kinjo1130/",
		icon: "/sns/scrapbox.png",
	},
];

export default function SNS({
	number,
	total,
}: {
	number: number;
	total: number;
}) {
	return (
		<IndexSection number={number} total={total} label="SNS">
			{LINKS.map((link, i) => (
				<IndexRow
					key={link.name}
					href={link.url}
					external
					index={i + 1}
					title={link.name}
					meta={link.handle}
					icon={
						// ブランド色のロゴはモノクロームに揃える (DESIGN.md §2.5)
						<span className="w-[20px] h-[20px] shrink-0 grayscale text-ink-heading">
							{link.icon ? (
								<Image
									src={link.icon}
									alt=""
									unoptimized={link.icon.endsWith(".svg")}
									width={ICON_SIZE}
									height={ICON_SIZE}
								/>
							) : (
								<SpeakerDeckIcon />
							)}
						</span>
					}
				/>
			))}
		</IndexSection>
	);
}
