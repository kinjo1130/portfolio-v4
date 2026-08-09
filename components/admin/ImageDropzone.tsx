import { useId, useRef, useState } from "react";

type Props = {
	onFile: (file: File) => void;
	/** すでに設定済みの画像。あればプレビューを出す */
	previewUrl?: string | null;
	onClear?: () => void;
	disabled?: boolean;
	hint?: string;
};

export function ImageDropzone({
	onFile,
	previewUrl,
	onClear,
	disabled = false,
	hint = "画像をドラッグ＆ドロップ、またはクリックして選択",
}: Props) {
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const [over, setOver] = useState(false);

	const accept = (file: File | undefined) => {
		if (file?.type.startsWith("image/")) onFile(file);
	};

	return (
		<div>
			<label
				htmlFor={inputId}
				onDragOver={(e) => {
					e.preventDefault();
					if (!disabled) setOver(true);
				}}
				onDragLeave={() => setOver(false)}
				onDrop={(e) => {
					e.preventDefault();
					setOver(false);
					if (!disabled) accept(e.dataTransfer.files?.[0]);
				}}
				className={`block border border-dashed rounded-card text-center cursor-pointer transition-colors ${
					over
						? "border-ink-primary bg-surface-sunken"
						: "border-line hover:bg-surface-sunken"
				} ${disabled ? "pointer-events-none opacity-40" : ""} ${
					previewUrl ? "p-3" : "px-4 py-8"
				}`}
			>
				{previewUrl ? (
					<img
						src={previewUrl}
						alt="カバー画像のプレビュー"
						className="w-full h-auto rounded-sm"
					/>
				) : (
					<span className="text-sm text-ink-secondary">{hint}</span>
				)}
				<input
					id={inputId}
					ref={inputRef}
					type="file"
					accept="image/*"
					className="sr-only"
					onChange={(e) => {
						accept(e.target.files?.[0]);
						e.target.value = "";
					}}
				/>
			</label>

			{previewUrl && onClear && (
				<button
					type="button"
					onClick={onClear}
					className="text-xs font-medium text-ink-secondary border border-line rounded-button px-2.5 py-1 mt-2 hover:text-ink-primary hover:bg-surface-sunken transition-colors"
				>
					カバー画像を外す
				</button>
			)}
		</div>
	);
}
