import { SeoHead } from "@/components/SeoHead";
import { type CompressFormat, compressImage } from "@/libs/compress";
import { downloadBlob, formatBytes } from "@/libs/crop";
import { useEffect, useRef, useState } from "react";
import Layout from "../layout";

const FORMATS: { id: CompressFormat; label: string }[] = [
	{ id: "webp", label: "WEBP" },
	{ id: "avif", label: "AVIF" },
	{ id: "jpg", label: "JPG" },
	{ id: "png", label: "PNG" },
];

export default function CompressPage() {
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [originalName, setOriginalName] = useState<string>("image");
	const [originalSize, setOriginalSize] = useState<number>(0);
	const [originalDim, setOriginalDim] = useState<{ w: number; h: number } | null>(null);
	const [format, setFormat] = useState<CompressFormat>("webp");
	const [quality, setQuality] = useState<number>(0.82);
	const [maxDimension, setMaxDimension] = useState<number | "">("");
	const [result, setResult] = useState<{
		blob: Blob;
		width: number;
		height: number;
	} | null>(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFile = (file: File) => {
		if (!file.type.startsWith("image/")) {
			setError("画像ファイルを選択してください");
			return;
		}
		setError(null);
		setResult(null);
		setOriginalName(file.name.replace(/\.[^.]+$/, ""));
		setOriginalSize(file.size);
		const reader = new FileReader();
		reader.onload = () => {
			const src = reader.result as string;
			setImageSrc(src);
			const img = new Image();
			img.onload = () => {
				setOriginalDim({ w: img.naturalWidth, h: img.naturalHeight });
			};
			img.src = src;
		};
		reader.readAsDataURL(file);
	};

	const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) handleFile(file);
	};

	const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const file = e.dataTransfer.files?.[0];
		if (file) handleFile(file);
	};

	const runCompress = async (silent = false) => {
		if (!imageSrc) return;
		if (!silent) setBusy(true);
		setError(null);
		try {
			const out = await compressImage({
				imageSrc,
				format,
				quality,
				maxDimension: typeof maxDimension === "number" ? maxDimension : null,
			});
			setResult(out);
		} catch (e) {
			setError(e instanceof Error ? e.message : "圧縮に失敗しました");
			setResult(null);
		} finally {
			if (!silent) setBusy(false);
		}
	};

	// 設定変更で自動再計算
	useEffect(() => {
		if (!imageSrc) return;
		const t = setTimeout(() => {
			runCompress(true);
		}, 150);
		return () => clearTimeout(t);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [imageSrc, format, quality, maxDimension]);

	const onDownload = () => {
		if (!result) return;
		const ext = format === "jpg" ? "jpg" : format;
		downloadBlob(result.blob, `${originalName}-${format}.${ext}`);
	};

	const onReset = () => {
		setImageSrc(null);
		setOriginalName("image");
		setOriginalSize(0);
		setOriginalDim(null);
		setResult(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const labelClass =
		"block text-xs font-semibold small-caps tracking-wider text-ink-secondary mb-2";
	const chipBase =
		"px-3 py-2 text-xs font-semibold small-caps tracking-wider border border-line transition-colors duration-fast";
	const chipActive = "bg-ink-primary text-paper border-ink-primary";
	const chipInactive =
		"bg-transparent text-ink-primary hover:border-ink-primary";

	const reduction =
		result && originalSize > 0
			? Math.round((1 - result.blob.size / originalSize) * 100)
			: null;

	return (
		<>
			<SeoHead
				title="Image Compress"
				titleTemplate="Image Compress"
				description="画像をブラウザ内で圧縮・形式変換 (WebP / AVIF / JPG / PNG)"
				imgUrl="/favicon.ico"
			/>
			<Layout title="Compress" eyebrow="§ — Tools" issueNumber="§ — 2026">
				<div className="mb-6">
					<p className="text-sm text-ink-secondary">
						画像はあなたのブラウザ内だけで処理されます。サーバーには送信されません。
					</p>
				</div>

				{!imageSrc ? (
					<div
						onDrop={onDrop}
						onDragOver={(e) => e.preventDefault()}
						className="border border-ink-primary p-8 text-center"
					>
						<p className="small-caps text-xs font-semibold tracking-wider text-ink-secondary mb-4">
							Drop image here
						</p>
						<p className="text-sm text-ink-secondary mb-4">— or —</p>
						<label className="inline-block">
							<span className="inline-block bg-ink-primary text-paper px-5 py-3 text-sm font-semibold cursor-pointer hover:bg-neutral-900 transition-colors duration-fast">
								Choose file
							</span>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								className="hidden"
								onChange={onPickFile}
							/>
						</label>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
						{/* Preview */}
						<div className="lg:col-span-8">
							{/* biome-ignore lint/a11y/useAltText: preview only */}
							<img
								src={imageSrc}
								alt="preview"
								className="w-full h-auto border border-line"
							/>

							{/* Stats */}
							<dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
								<div>
									<dt className="small-caps text-xs font-semibold text-ink-secondary tracking-wider">
										Source
									</dt>
									<dd className="font-semibold text-ink-primary mt-1">
										{formatBytes(originalSize)}
										{originalDim && (
											<span className="text-ink-tertiary ml-2 tnum">
												{originalDim.w}×{originalDim.h}
											</span>
										)}
									</dd>
								</div>
								<div>
									<dt className="small-caps text-xs font-semibold text-ink-secondary tracking-wider">
										Output
									</dt>
									<dd className="font-semibold text-ink-primary mt-1 tnum">
										{result ? (
											<>
												{formatBytes(result.blob.size)}
												<span className="text-ink-tertiary ml-2">
													{result.width}×{result.height}
												</span>
											</>
										) : (
											<span className="text-ink-tertiary">—</span>
										)}
									</dd>
								</div>
								{reduction !== null && (
									<div className="col-span-2">
										<dt className="small-caps text-xs font-semibold text-ink-secondary tracking-wider">
											Reduction
										</dt>
										<dd
											className={`font-bold text-lg mt-1 tnum ${
												reduction > 0
													? "text-signal-positive"
													: "text-signal-critical"
											}`}
										>
											{reduction > 0 ? "−" : "+"}
											{Math.abs(reduction)}%
										</dd>
									</div>
								)}
							</dl>
						</div>

						{/* Controls */}
						<div className="lg:col-span-4 space-y-6">
							<section>
								<span className={labelClass}>Format</span>
								<div className="flex flex-wrap gap-2">
									{FORMATS.map((f) => (
										<button
											key={f.id}
											type="button"
											className={`${chipBase} ${
												format === f.id ? chipActive : chipInactive
											}`}
											onClick={() => setFormat(f.id)}
										>
											{f.label}
										</button>
									))}
								</div>
							</section>

							{format !== "png" && (
								<section>
									<span className={labelClass}>
										Quality{" "}
										<span className="text-ink-tertiary tnum">
											{Math.round(quality * 100)}%
										</span>
									</span>
									<input
										type="range"
										min={0.1}
										max={1}
										step={0.01}
										value={quality}
										onChange={(e) => setQuality(Number(e.target.value))}
										className="w-full"
									/>
								</section>
							)}

							<section>
								<span className={labelClass}>
									Max dimension{" "}
									<span className="text-ink-tertiary">(longest side, px)</span>
								</span>
								<input
									type="number"
									min={100}
									step={1}
									placeholder="未指定なら原寸"
									value={maxDimension}
									onChange={(e) =>
										setMaxDimension(
											e.target.value === "" ? "" : Number(e.target.value),
										)
									}
									className="w-full border border-line bg-surface-card px-3 py-2 text-sm focus:outline-none focus:border-ink-primary"
								/>
							</section>

							<section>
								<span className={labelClass}>Source</span>
								<p className="text-xs text-ink-secondary font-mono break-all">
									{originalName}
								</p>
							</section>

							{error && (
								<p className="text-xs text-signal-critical font-mono">
									{error}
								</p>
							)}

							<div className="flex flex-col gap-2 pt-2">
								<button
									type="button"
									onClick={onDownload}
									disabled={busy || !result}
									className="bg-ink-primary text-paper px-5 py-3 text-sm font-semibold hover:bg-neutral-900 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{busy ? "Working…" : "Download"}
								</button>
								<button
									type="button"
									onClick={onReset}
									className="border border-ink-primary text-ink-primary px-5 py-3 text-sm font-semibold hover:bg-ink-primary hover:text-paper transition-colors duration-fast"
								>
									Reset
								</button>
							</div>
						</div>
					</div>
				)}
			</Layout>
		</>
	);
}
