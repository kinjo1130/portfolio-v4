import "@/styles/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { AppProps } from "next/app";

// GA4 測定 ID (kinjyo.me / ストリーム 2657990993)。測定 ID は公開情報のため直書き。
const GA_ID = "G-1M4CM8007S";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Component {...pageProps} />
			<GoogleAnalytics gaId={GA_ID} />
		</>
	);
}
