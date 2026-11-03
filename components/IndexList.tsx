import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

export const pad = (n: number) => String(n).padStart(2, "0");

// 入場アニメーションの順番。.rise が --i × 45ms ずつ遅れて浮かぶ
export const order = (i: number) => ({ "--i": i }) as CSSProperties;

export const Badge = ({ children }: { children: ReactNode }) => (
	<span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-secondary border border-line rounded-badge px-2 py-0.5 whitespace-nowrap">
		{children}
	</span>
);

export const StatusBadge = ({ ongoing }: { ongoing: boolean }) => (
	<Badge>
		<span
			className={`w-1.5 h-1.5 rounded-full ${ongoing ? "bg-signal-positive" : "bg-neutral-400"}`}
		/>
		{ongoing ? "継続中" : "終了"}
	</Badge>
);

type RowLinkProps = {
	href: string;
	external?: boolean;
	className: string;
	children: ReactNode;
};

const RowLink = ({ href, external, className, children }: RowLinkProps) => (
	<li>
		{external ? (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className={className}
			>
				{children}
			</a>
		) : (
			<Link href={href} className={className}>
				{children}
			</Link>
		)}
	</li>
);

const Index = ({ n, className = "" }: { n: number; className?: string }) => (
	<span
		className={`tnum text-sm font-medium text-ink-tertiary transition-colors duration-fast ease-standard group-hover:text-ink-primary ${className}`}
	>
		{pad(n)}
	</span>
);

type RowProps = {
	href: string;
	external?: boolean;
	index: number;
	title: string;
	description?: string;
	meta: ReactNode;
};

/**
 * 画像のない行。行全体がリンクで、ホバーすると背景が一段沈み、矢印が 4px 進む。
 * 背景は ::before で左右に 12px はみ出させる。行をずらすと罫線の端がほかの行とずれるため。
 * md 以上は「番号 / タイトル / メタ / 矢印」の 4 列、SP ではメタをタイトルの下に回す。
 */
export const IndexRow = ({
	href,
	external = false,
	index,
	title,
	description,
	meta,
	icon,
}: RowProps & { icon?: ReactNode }) => {
	const Arrow = external ? ArrowUpRight : ArrowRight;
	return (
		<RowLink
			href={href}
			external={external}
			className="group grid grid-cols-[1.75rem_minmax(0,1fr)_1rem] md:grid-cols-[2.5rem_minmax(0,1fr)_auto_1rem] gap-x-4 gap-y-2 items-baseline py-4 border-b border-line no-underline text-ink-primary relative isolate before:absolute before:inset-y-0 before:-inset-x-3 before:-z-10 before:rounded-md before:bg-surface-raised before:opacity-0 before:transition-opacity before:duration-fast before:ease-standard hover:before:opacity-100"
		>
			<Index n={index} />
			<span className="min-w-0">
				<span className="flex items-center gap-3 text-lg md:text-xl font-medium text-ink-heading">
					{icon}
					{title}
				</span>
				{description && (
					<span className="block mt-1 text-sm text-ink-secondary">
						{description}
					</span>
				)}
			</span>
			<span className="col-start-2 row-start-2 md:col-start-3 md:row-start-1 flex flex-wrap items-center gap-3 tnum text-sm font-medium text-ink-secondary">
				{meta}
			</span>
			<Arrow
				aria-hidden
				size={16}
				strokeWidth={1.5}
				className="col-start-3 row-start-1 md:col-start-4 self-center text-ink-tertiary transition-[transform,color] duration-normal ease-standard group-hover:translate-x-1 group-hover:text-ink-primary"
			/>
		</RowLink>
	);
};

/**
 * サムネイルつきの行。ホバーでタイトルに下線が引かれ、画像がわずかに寄る。
 * md 以上は「番号 / 画像 / タイトル / メタ」の 4 列。
 * SP は 1 行目に番号とメタ、2 行目に「小さい画像 / タイトルと説明」の 2 列。画像を全幅にすると縦に長くなりすぎるため。
 */
export const ThumbRow = ({
	href,
	external = false,
	index,
	title,
	description,
	meta,
	thumb,
	aspect = "aspect-[1200/630]",
}: RowProps & { thumb: ReactNode; aspect?: string }) => (
	<RowLink
		href={href}
		external={external}
		className="row-link group grid grid-cols-[7rem_minmax(0,1fr)] md:grid-cols-[2.5rem_14rem_minmax(0,1fr)_auto] gap-x-4 gap-y-3 items-start py-5 md:py-4 border-b border-line no-underline text-ink-primary"
	>
		<span className="col-span-2 flex items-baseline justify-between gap-3 md:contents">
			<Index n={index} className="md:col-start-1 md:row-start-1" />
			<span className="flex flex-wrap items-center justify-end gap-3 tnum text-sm font-medium text-ink-secondary md:col-start-4 md:row-start-1">
				{meta}
			</span>
		</span>
		<span
			className={`block overflow-hidden border border-line rounded-md md:rounded-card bg-surface-sunken col-start-1 row-start-2 md:col-start-2 md:row-start-1 ${aspect}`}
		>
			{thumb}
		</span>
		<span className="min-w-0 col-start-2 row-start-2 md:col-start-3 md:row-start-1">
			<span className="link-draw text-base md:text-xl font-medium text-ink-heading">
				{title}
			</span>
			{description && (
				<span className="mt-1 text-sm text-ink-secondary line-clamp-3 md:line-clamp-none">
					{description}
				</span>
			)}
		</span>
	</RowLink>
);

// サムネイル画像に付ける共通クラス。ホバーで 1.03 倍に寄る
export const THUMB_IMG =
	"w-full h-full transition-transform duration-slow ease-standard group-hover:scale-[1.03]";
export const THUMB_SIZES = "(min-width: 768px) 224px, 100vw";

export const IndexSection = ({
	number,
	total,
	label,
	more,
	children,
}: {
	number: number;
	total: number;
	label: string;
	more?: { href: string; label: string };
	children: ReactNode;
}) => (
	<section
		className="rise grid grid-cols-[minmax(0,1fr)] md:grid-cols-[200px_minmax(0,1fr)] gap-3 md:gap-5 py-6 md:py-7 border-t border-line"
		style={order(number + 3)}
	>
		<header className="flex items-baseline justify-between md:block">
			<h2 className="text-sm font-medium text-ink-secondary">{label}</h2>
			<p className="tnum text-sm font-medium text-ink-secondary md:mt-1">
				{pad(number)} / {pad(total)}
			</p>
		</header>
		<div>
			<ul>{children}</ul>
			{more && (
				<Link
					href={more.href}
					className="link-draw mt-4 text-sm font-medium text-ink-primary no-underline"
				>
					{more.label}
					<ArrowRight
						aria-hidden
						size={14}
						strokeWidth={1.5}
						className="inline-block ml-1 align-[-2px]"
					/>
				</Link>
			)}
		</div>
	</section>
);
