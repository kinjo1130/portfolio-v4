import { Check, Link2 } from "lucide-react";
import { useState } from "react";

type Props = {
	title: string;
	url: string;
	className?: string;
};

const ITEM_CLASS =
	"text-sm font-medium text-ink-primary no-underline border border-line rounded-button px-3 py-1.5 flex items-center gap-2 hover:bg-surface-sunken active:bg-surface-raised transition-colors duration-fast";

export const ShareLinks = ({ title, url, className }: Props) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// クリップボードが使えない環境ではリンクの手動コピーに任せる
		}
	};

	const shareTargets = [
		{
			label: "X でシェア",
			href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
				title,
			)}&url=${encodeURIComponent(url)}`,
		},
		{
			label: "はてなブックマーク",
			href: `https://b.hatena.ne.jp/entry/panel/?url=${encodeURIComponent(
				url,
			)}&title=${encodeURIComponent(title)}`,
		},
	];

	return (
		<div className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}>
			{shareTargets.map((target) => (
				<a
					key={target.label}
					href={target.href}
					target="_blank"
					rel="noopener noreferrer"
					className={ITEM_CLASS}
				>
					{target.label}
				</a>
			))}
			<button type="button" onClick={handleCopy} className={ITEM_CLASS}>
				{copied ? (
					<Check size={14} strokeWidth={1.5} aria-hidden />
				) : (
					<Link2 size={14} strokeWidth={1.5} aria-hidden />
				)}
				<span aria-live="polite">
					{copied ? "コピーしました" : "リンクをコピー"}
				</span>
			</button>
		</div>
	);
};
