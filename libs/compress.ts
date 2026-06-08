export type CompressFormat = "webp" | "avif" | "jpg" | "png";

const MIME: Record<CompressFormat, string> = {
	webp: "image/webp",
	avif: "image/avif",
	png: "image/png",
	jpg: "image/jpeg",
};

async function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = (e) => reject(e);
		img.src = src;
	});
}

type CompressOptions = {
	imageSrc: string;
	format: CompressFormat;
	quality?: number;
	maxDimension?: number | null;
};

export async function compressImage({
	imageSrc,
	format,
	quality = 0.85,
	maxDimension = null,
}: CompressOptions): Promise<{ blob: Blob; width: number; height: number }> {
	const img = await loadImage(imageSrc);

	let outW = img.naturalWidth;
	let outH = img.naturalHeight;
	if (maxDimension && Math.max(outW, outH) > maxDimension) {
		const scale = maxDimension / Math.max(outW, outH);
		outW = Math.round(outW * scale);
		outH = Math.round(outH * scale);
	}

	const canvas = document.createElement("canvas");
	canvas.width = outW;
	canvas.height = outH;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas 2D context unavailable");

	// JPEG は透過を扱えないので白埋め
	if (format === "jpg") {
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, outW, outH);
	}

	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	ctx.drawImage(img, 0, 0, outW, outH);

	const mime = MIME[format];
	const blob: Blob = await new Promise((resolve, reject) => {
		canvas.toBlob(
			(b) => {
				if (b) resolve(b);
				else reject(new Error(`${format.toUpperCase()} はこのブラウザで非対応です`));
			},
			mime,
			format === "png" ? undefined : quality,
		);
	});

	return { blob, width: outW, height: outH };
}
