import { SeoHead } from "@/components/SeoHead";
import {
  downloadBlob,
  formatBytes,
  getCroppedBlob,
  type CropArea,
  type OutputFormat,
} from "@/libs/crop";
import { useCallback, useMemo, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import Layout from "../layout";

type Preset = {
  id: string;
  label: string;
  ratio: number | null;
  fixedSize?: { width: number; height: number };
};

const PRESETS: Preset[] = [
  { id: "ogp", label: "OGP 1200×630", ratio: 1200 / 630, fixedSize: { width: 1200, height: 630 } },
  { id: "16x9", label: "16:9", ratio: 16 / 9 },
  { id: "1x1", label: "1:1", ratio: 1 },
  { id: "free", label: "Free", ratio: null },
];

const FORMATS: { id: OutputFormat; label: string }[] = [
  { id: "webp", label: "WEBP" },
  { id: "png", label: "PNG" },
  { id: "jpg", label: "JPG" },
];

export default function CropPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string>("image");
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [presetId, setPresetId] = useState<string>("ogp");
  const [format, setFormat] = useState<OutputFormat>("webp");
  const [quality, setQuality] = useState<number>(0.92);
  const [maxWidth, setMaxWidth] = useState<number | "">("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<CropArea | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const preset = useMemo(
    () => PRESETS.find((p) => p.id === presetId) ?? PRESETS[0],
    [presetId],
  );

  const onCropComplete = useCallback((_: CropArea, area: CropArea) => {
    setCroppedArea(area);
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("画像ファイルを選択してください");
      return;
    }
    setError(null);
    setOriginalName(file.name.replace(/\.[^.]+$/, ""));
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
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

  const onDownload = async () => {
    if (!imageSrc || !croppedArea) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await getCroppedBlob({
        imageSrc,
        crop: croppedArea,
        format,
        quality,
        maxWidth: typeof maxWidth === "number" ? maxWidth : null,
        fixedSize: preset.fixedSize ?? null,
      });
      const ext = format === "jpg" ? "jpg" : format;
      downloadBlob(blob, `${originalName}-crop.${ext}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "書き出しに失敗しました");
    } finally {
      setBusy(false);
    }
  };

  const onReset = () => {
    setImageSrc(null);
    setOriginalName("image");
    setOriginalSize(0);
    setCroppedArea(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const labelClass = "block text-2xs font-mono uppercase tracking-wider text-ink-secondary mb-2";
  const chipBase =
    "px-3 py-2 text-xs font-mono uppercase tracking-wider border border-line transition-colors duration-fast";
  const chipActive = "bg-asphalt text-paper border-asphalt";
  const chipInactive = "bg-transparent text-ink-primary hover:border-line-strong";

  return (
    <>
      <SeoHead
        title="Image Crop"
        titleTemplate="Image Crop"
        description="サムネイル・OGP・SNSアイコン用の画像を素早くトリミング"
        imgUrl="/favicon.ico"
      />
      <Layout title="Image crop" tooltipText="ローカル完結のクライアントサイド画像クロップツール">
        <div className="mb-6">
          <p className="text-sm text-ink-secondary">
            画像はあなたのブラウザ内だけで処理されます。サーバーには送信されません。
          </p>
        </div>

        {!imageSrc ? (
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border border-line-strong p-8 text-center"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-ink-secondary mb-4">
              Drop image here
            </p>
            <p className="text-sm text-ink-secondary mb-4">— or —</p>
            <label className="inline-block">
              <span className="inline-block bg-asphalt text-paper px-5 py-3 text-sm font-medium cursor-pointer hover:bg-neutral-900 transition-colors duration-fast">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div
                className="relative w-full bg-asphalt"
                style={{ aspectRatio: preset.ratio ?? 16 / 9, minHeight: 320 }}
              >
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={preset.ratio ?? undefined}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  showGrid
                  restrictPosition={false}
                />
              </div>
              <div className="mt-4">
                <span className={labelClass}>Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <section>
                <span className={labelClass}>Preset</span>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={`${chipBase} ${presetId === p.id ? chipActive : chipInactive}`}
                      onClick={() => setPresetId(p.id)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <span className={labelClass}>Format</span>
                <div className="flex gap-2">
                  {FORMATS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`${chipBase} ${format === f.id ? chipActive : chipInactive}`}
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
                    <span className="text-ink-tertiary">{Math.round(quality * 100)}%</span>
                  </span>
                  <input
                    type="range"
                    min={0.5}
                    max={1}
                    step={0.01}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full"
                  />
                </section>
              )}

              {!preset.fixedSize && (
                <section>
                  <span className={labelClass}>Max width (px, optional)</span>
                  <input
                    type="number"
                    min={100}
                    step={1}
                    placeholder="未指定なら原寸"
                    value={maxWidth}
                    onChange={(e) =>
                      setMaxWidth(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="w-full border border-line bg-surface-card px-3 py-2 text-sm focus:outline-none focus:border-line-strong"
                  />
                </section>
              )}

              <section>
                <span className={labelClass}>Source</span>
                <p className="text-xs text-ink-secondary font-mono">
                  {originalName} · {formatBytes(originalSize)}
                </p>
              </section>

              {error && (
                <p className="text-xs text-signal-critical font-mono">{error}</p>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={onDownload}
                  disabled={busy || !croppedArea}
                  className="bg-asphalt text-paper px-5 py-3 text-sm font-medium hover:bg-neutral-900 transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busy ? "Working…" : "Download"}
                </button>
                <button
                  type="button"
                  onClick={onReset}
                  className="border border-asphalt text-ink-primary px-5 py-3 text-sm font-medium hover:bg-asphalt hover:text-paper transition-colors duration-fast"
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
