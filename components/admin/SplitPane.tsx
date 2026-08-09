import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
	left: React.ReactNode;
	right: React.ReactNode;
	/** 分割位置を覚えておく localStorage のキー */
	storageKey: string;
	label?: string;
};

const MIN_PERCENT = 20;
const MAX_PERCENT = 80;
const DEFAULT_PERCENT = 50;
const KEYBOARD_STEP = 2;

const clamp = (value: number) =>
	Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, value));

/**
 * 左右に並べたペインを、間の仕切りをつかんで比率変更できるようにする。
 * 画面が狭いときは縦積みにして、仕切りは出さない。
 */
export function SplitPane({ left, right, storageKey, label }: Props) {
	const [percent, setPercent] = useState(DEFAULT_PERCENT);
	const [sideBySide, setSideBySide] = useState(false);
	const [dragging, setDragging] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const percentRef = useRef(percent);

	useEffect(() => {
		const query = window.matchMedia("(min-width: 1024px)");
		const sync = () => setSideBySide(query.matches);
		sync();
		query.addEventListener("change", sync);

		const saved = Number(window.localStorage.getItem(storageKey));
		if (Number.isFinite(saved) && saved > 0) {
			const restored = clamp(saved);
			percentRef.current = restored;
			setPercent(restored);
		}
		return () => query.removeEventListener("change", sync);
	}, [storageKey]);

	const move = useCallback((next: number) => {
		const value = clamp(next);
		percentRef.current = value;
		setPercent(value);
	}, []);

	const persist = useCallback(() => {
		window.localStorage.setItem(
			storageKey,
			String(Math.round(percentRef.current)),
		);
	}, [storageKey]);

	const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		if (!dragging) return;
		const rect = containerRef.current?.getBoundingClientRect();
		if (!rect) return;
		move(((event.clientX - rect.left) / rect.width) * 100);
	};

	const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "ArrowLeft") move(percentRef.current - KEYBOARD_STEP);
		else if (event.key === "ArrowRight")
			move(percentRef.current + KEYBOARD_STEP);
		else if (event.key === "Home") move(DEFAULT_PERCENT);
		else return;
		event.preventDefault();
		persist();
	};

	return (
		<div
			ref={containerRef}
			className={`flex flex-col lg:flex-row items-stretch gap-8 lg:gap-0 ${
				dragging ? "select-none" : ""
			}`}
		>
			<div
				className="min-w-0"
				style={sideBySide ? { width: `${percent}%` } : undefined}
			>
				{left}
			</div>

			{/* biome-ignore lint/a11y/useSemanticElements: 操作できる仕切りなので <hr> にはできない。フォーカスと値を持つ WAI-ARIA の window splitter パターン */}
			<div
				role="separator"
				aria-orientation="vertical"
				aria-label={label ?? "表示領域の分割位置"}
				aria-valuenow={Math.round(percent)}
				aria-valuemin={MIN_PERCENT}
				aria-valuemax={MAX_PERCENT}
				tabIndex={0}
				onKeyDown={onKeyDown}
				onPointerDown={(event) => {
					event.currentTarget.setPointerCapture(event.pointerId);
					setDragging(true);
				}}
				onPointerMove={onPointerMove}
				onPointerUp={(event) => {
					event.currentTarget.releasePointerCapture(event.pointerId);
					setDragging(false);
					persist();
				}}
				onDoubleClick={() => {
					move(DEFAULT_PERCENT);
					persist();
				}}
				title="ドラッグで幅を変える (ダブルクリックで半分に戻す)"
				className="hidden lg:flex shrink-0 w-8 cursor-col-resize items-center justify-center group"
			>
				<span
					className={`w-px h-full transition-colors ${
						dragging ? "bg-ink-primary" : "bg-line group-hover:bg-ink-tertiary"
					}`}
				/>
			</div>

			<div className="min-w-0 flex-1">{right}</div>
		</div>
	);
}
