export type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type OutputFormat = "webp" | "png" | "jpg";

const MIME: Record<OutputFormat, string> = {
  webp: "image/webp",
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

type CropOptions = {
  imageSrc: string;
  crop: CropArea;
  format: OutputFormat;
  quality?: number;
  maxWidth?: number | null;
  fixedSize?: { width: number; height: number } | null;
};

export async function getCroppedBlob({
  imageSrc,
  crop,
  format,
  quality = 0.92,
  maxWidth = null,
  fixedSize = null,
}: CropOptions): Promise<Blob> {
  const img = await loadImage(imageSrc);

  let outW = crop.width;
  let outH = crop.height;

  if (fixedSize) {
    outW = fixedSize.width;
    outH = fixedSize.height;
  } else if (maxWidth && crop.width > maxWidth) {
    const scale = maxWidth / crop.width;
    outW = Math.round(crop.width * scale);
    outH = Math.round(crop.height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  if (format === "jpg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outW, outH);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outW,
    outH,
  );

  const mime = MIME[format];
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("toBlob returned null"));
      },
      mime,
      format === "png" ? undefined : quality,
    );
  });

  return blob;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
