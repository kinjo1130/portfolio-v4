import { ImageResponse } from "@vercel/og";

export const config = {
	runtime: "edge",
};

const SITE = "kinjo.me";
const AUTHOR = "金城翔太郎";

// DESIGN.md v2 のモノクロームランプから (edge 関数のため CSS トークンを参照できずここに転記)
const INK_900 = "#1b1a1a";
const INK_700 = "#4e4d4c";
const INK_500 = "#878684";
const LINE_200 = "#dfdedd";
const PAPER_50 = "#fafafa";

// Google Fonts から必要なグリフだけを subset 取得する (Satori は woff2 非対応のため旧 UA で ttf を得る)
async function loadNotoSansJP(
	weight: number,
	text: string,
): Promise<ArrayBuffer | null> {
	try {
		const css = await (
			await fetch(
				`https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@${weight}&text=${encodeURIComponent(text)}`,
				{
					headers: {
						"User-Agent":
							"Mozilla/5.0 (Windows NT 6.1; rv:22.0) Gecko/20130405 Firefox/22.0",
					},
				},
			)
		).text();
		const match = css.match(
			/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
		);
		if (!match) return null;
		const res = await fetch(match[1]);
		if (!res.ok) return null;
		return await res.arrayBuffer();
	} catch {
		return null;
	}
}

export default async function handler(req: Request) {
	const { searchParams } = new URL(req.url);
	const title = searchParams.get("title")?.slice(0, 80) || SITE;
	const date = searchParams.get("date")?.slice(0, 10).replaceAll("-", ".");
	const label = searchParams.get("label")?.slice(0, 20) || "Writing";

	const subsetText = `${title}${SITE}${AUTHOR}${label}0123456789.`;
	const [regular, bold] = await Promise.all([
		loadNotoSansJP(400, subsetText),
		loadNotoSansJP(700, subsetText),
	]);
	const fonts = [
		...(regular
			? [{ name: "Noto Sans JP", data: regular, weight: 400 as const }]
			: []),
		...(bold
			? [{ name: "Noto Sans JP", data: bold, weight: 700 as const }]
			: []),
	];

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				backgroundColor: PAPER_50,
				padding: "64px 80px",
				fontFamily: '"Noto Sans JP"',
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<span style={{ fontSize: 34, fontWeight: 700, color: INK_900 }}>
					{SITE}
				</span>
				<span
					style={{
						fontSize: 23,
						fontWeight: 400,
						color: INK_700,
						border: `2px solid ${LINE_200}`,
						borderRadius: 999,
						padding: "8px 26px",
					}}
				>
					{label}
				</span>
			</div>

			<div
				style={{
					height: 2,
					backgroundColor: LINE_200,
					margin: "30px 0",
				}}
			/>

			<div
				style={{
					flex: 1,
					display: "flex",
					alignItems: "center",
					minHeight: 0,
				}}
			>
				<div
					style={{
						fontSize: 62,
						fontWeight: 700,
						lineHeight: 1.4,
						color: INK_900,
						lineClamp: 3,
					}}
				>
					{title}
				</div>
			</div>

			<div
				style={{
					height: 2,
					backgroundColor: LINE_200,
					margin: "30px 0",
				}}
			/>

			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "baseline",
				}}
			>
				<span
					style={{
						fontSize: 26,
						fontWeight: 400,
						color: INK_500,
						fontVariantNumeric: "tabular-nums",
					}}
				>
					{date ?? ""}
				</span>
				<span style={{ fontSize: 26, fontWeight: 400, color: INK_700 }}>
					{AUTHOR}
				</span>
			</div>
		</div>,
		{
			width: 1200,
			height: 630,
			fonts: fonts.length > 0 ? fonts : undefined,
		},
	);
}
