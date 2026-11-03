import Image from "next/image";
import { useRef, useState } from "react";

const SIZES = "(min-width: 768px) 160px, 96px";

/**
 * 表に子どもの頃の写真 (favicon の元画像)、裏にいまの写真を置いたカード。
 * マウスではホバーでめくれる (styles/globals.css の .flip-card)。
 * タッチとキーボードにはホバーが無いので、タップや Enter でめくれた状態を切り替える。
 */
export function ProfileFlipCard() {
	const [flipped, setFlipped] = useState(false);
	const pointerType = useRef<string | null>(null);

	return (
		<button
			type="button"
			className="flip-card w-24 md:w-40"
			aria-pressed={flipped}
			aria-label={flipped ? "子どもの頃の写真に戻す" : "いまの写真を見る"}
			onPointerDown={(e) => {
				pointerType.current = e.pointerType;
			}}
			onClick={() => {
				// マウスはホバーでめくれるので、クリックで状態を残さない
				const byMouse = pointerType.current === "mouse";
				pointerType.current = null;
				if (!byMouse) setFlipped((f) => !f);
			}}
		>
			<span className="flip-card-inner">
				<span className="flip-card-face">
					<Image
						src="/images/profile/then.jpg"
						alt=""
						fill
						sizes={SIZES}
						priority
						className="object-cover"
					/>
				</span>
				<span className="flip-card-face flip-card-back">
					<Image
						src="/images/profile/now.jpg"
						alt=""
						fill
						sizes={SIZES}
						className="object-cover"
					/>
				</span>
			</span>
		</button>
	);
}
