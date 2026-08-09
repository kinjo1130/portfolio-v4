import {
	type CropArea,
	type OutputFormat,
	formatBytes,
	getCroppedBlob,
} from "@/libs/crop";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cropper from "react-easy-crop";

export type CropPreset = {
	id: string;
	label: string;
	ratio: number | null;
	fixedSize?: { width: number; height: number };
};

export const COVER_PRESETS: CropPreset[] = [
	{
		id: "ogp",
		label: "カバー 1200×630",
		ratio: 1200 / 630,
		fixedSize: { width: 1200, height: 630 },
	},
	{ id: "16x9", label: "16:9", ratio: 16 / 9 },
	{ id: "1x1", label: "1:1", ratio: 1 },
];

export const BODY_PRESETS: CropPreset[] = [
	{ id: "free", label: "そのまま", ratio: null },
	{ id: "16x9", label: "16:9", ratio: 16 / 9 },
	{ id: "4x3", label: "4:3", ratio: 4 / 3 },
	{ id: "1x1", label: "1:1", ratio: 1 },
];

const FORMATS: { id: OutputFormat; label: string }[] = [
	{ id: "webp", label: "WEBP" },
	{ id: "jpg", label: "JPG" },
	{ id: "png", label: "PNG" },
];

const MIME: Record<OutputFormat, string> = {
	webp: "image/webp",
	jpg: "image/jpeg",
	png: "image/png",
};

export type CroppedImage = {
	base64: string;
	mimeType: string;
	width: number;
	height: number;
	bytes: number;
};

type Props = {
	imageSrc: string;
	fileName: string;
	presets: CropPreset[];
	maxWidth: number;
	onCancel: () => void;
	onConfirm: (image: CroppedImage) => void;
	busy?: boolean;
};

const chip = (active: boolean) =>
	`text-xs font-medium border rounded-badge px-2.5 py-1 transition-colors ${
		active
			? "bg-ink-primary text-paper border-ink-primary"
			: "text-ink-secondary border-line hover:text-ink-primary hover:bg-surface-sunken"
	}`;

async function blobToBase64(blob: Blob): Promise<string> {
	const buffer = await blob.arrayBuffer();
	let binary = "";
	const bytes = new Uint8Array(buffer);
	for (let i = 0; i < bytes.length; i += 1)
		binary += String.fromCharCode(bytes[i]);
	return window.btoa(binary);
}

export function ImageCropDialog({
	imageSrc,
	fileName,
	presets,
	maxWidth,
	onCancel,
	onConfirm,
	busy = false,
}: Props) {
	const [presetId, setPresetId] = useState(presets[0].id);
	const [format, setFormat] = useState<OutputFormat>("webp");
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [area, setArea] = useState<CropArea | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [working, setWorking] = useState(false);
	const [naturalRatio, setNaturalRatio] = useState<number | null>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);

	const preset = useMemo(
		() => presets.find((p) => p.id === presetId) ?? presets[0],
		[presets, presetId],
	);

	// ネイティブの <dialog> をモーダルとして開く。フォーカスの閉じ込めと
	// Escape での閉じ方をブラウザに任せられる。
	useEffect(() => {
		dialogRef.current?.showModal();
	}, []);

	const onCropComplete = useCallback(
		(_: CropArea, pixels: CropArea) => setArea(pixels),
		[],
	);

	const confirm = async () => {
		if (!area) return;
		setWorking(true);
		setError(null);
		try {
			const blob = await getCroppedBlob({
				imageSrc,
				crop: area,
				format,
				maxWidth: preset.fixedSize ? null : maxWidth,
				fixedSize: preset.fixedSize ?? null,
			});
			const width = preset.fixedSize
				? preset.fixedSize.width
				: Math.min(Math.round(area.width), maxWidth);
			const scale = width / area.width;
			onConfirm({
				base64: await blobToBase64(blob),
				mimeType: MIME[format],
				width,
				height: preset.fixedSize
					? preset.fixedSize.height
					: Math.round(area.height * scale),
				bytes: blob.size,
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : "書き出しに失敗しました");
		} finally {
			setWorking(false);
		}
	};

	const pending = working || busy;

	return (
		<dialog
			ref={dialogRef}
			aria-label="画像のトリミング"
			onCancel={(event) => {
				event.preventDefault();
				onCancel();
			}}
			className="w-full max-w-3xl p-0 bg-surface-card text-ink-primary border border-line rounded-card shadow-lg overflow-hidden backdrop:bg-black/50"
		>
			<div className="px-6 py-4 border-b border-line flex items-baseline justify-between gap-4">
				<h2 className="jp-display text-lg font-medium">画像のトリミング</h2>
				<p className="text-xs text-ink-tertiary font-mono truncate">
					{fileName}
				</p>
			</div>

			<div className="relative h-[46vh] min-h-64 bg-surface-sunken">
				<Cropper
					image={imageSrc}
					crop={crop}
					zoom={zoom}
					aspect={preset.ratio ?? naturalRatio ?? undefined}
					onMediaLoaded={({ naturalWidth, naturalHeight }) =>
						setNaturalRatio(naturalWidth / naturalHeight)
					}
					onCropChange={setCrop}
					onZoomChange={setZoom}
					onCropComplete={onCropComplete}
					restrictPosition
				/>
			</div>

			<div className="px-6 py-4 space-y-4">
				<div className="flex flex-wrap items-center gap-2">
					{presets.map((p) => (
						<button
							type="button"
							key={p.id}
							onClick={() => setPresetId(p.id)}
							className={chip(p.id === presetId)}
						>
							{p.label}
						</button>
					))}
					<span className="w-px h-4 bg-line mx-1" aria-hidden="true" />
					{FORMATS.map((f) => (
						<button
							type="button"
							key={f.id}
							onClick={() => setFormat(f.id)}
							className={chip(f.id === format)}
						>
							{f.label}
						</button>
					))}
				</div>

				<div className="flex items-center gap-3">
					<label
						htmlFor="crop-zoom"
						className="text-sm font-medium text-ink-secondary shrink-0"
					>
						拡大
					</label>
					<input
						id="crop-zoom"
						type="range"
						min={1}
						max={4}
						step={0.01}
						value={zoom}
						onChange={(e) => setZoom(Number(e.target.value))}
						className="w-full accent-current"
					/>
					<span className="text-sm text-ink-secondary tnum shrink-0 w-12 text-right">
						{zoom.toFixed(2)}x
					</span>
				</div>

				{area && (
					<p className="text-xs text-ink-tertiary tnum">
						切り抜き {Math.round(area.width)}×{Math.round(area.height)} px
						{preset.fixedSize
							? ` → ${preset.fixedSize.width}×${preset.fixedSize.height} px に書き出し`
							: ` (長辺 ${maxWidth}px まで縮小)`}
					</p>
				)}

				{error && (
					<p className="text-sm text-signal-critical" role="alert">
						{error}
					</p>
				)}
			</div>

			<div className="px-6 py-4 border-t border-line flex items-center justify-end gap-3">
				<button
					type="button"
					onClick={onCancel}
					className="text-sm font-medium text-ink-secondary border border-line rounded-button px-4 py-2 hover:bg-surface-sunken transition-colors"
				>
					やめる
				</button>
				<button
					type="button"
					onClick={confirm}
					disabled={!area || pending}
					className="text-sm font-medium bg-ink-primary text-paper rounded-button px-4 py-2"
				>
					{pending ? "アップロード中" : "この範囲で使う"}
				</button>
			</div>
		</dialog>
	);
}

export { formatBytes };
