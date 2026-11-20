import Link from "next/link";
import { useEffect, useState } from "react";

// Header はページごとにマウントし直される。ページを移るたびにロゴの演出が流れないよう、自動で流すのはタブを開いて最初の 1 回だけにする
let logoFilled = false;

// ナビは置かない。各一覧へはトップのセクションから、戻るときはタイトル上の戻り先リンク (pages/layout.tsx) から移る
export const Header: React.FC = () => {
	// 初回だけ塗りの演出を流す。2 回目以降のマウントでは最初から塗られた状態で出す
	const [waving] = useState(() => !logoFilled);

	useEffect(() => {
		logoFilled = true;
	}, []);

	return (
		<header className="w-full border-b border-line">
			<div className="max-w-wide mx-auto px-6 md:px-12 py-4">
				<Link
					href="/"
					className="inline-block text-base font-semibold text-ink-primary no-underline"
				>
					<span className="logo-wave" data-animate={waving}>
						<span className="logo-wave-line">kinjo.me</span>
						<span aria-hidden className="logo-wave-fill">
							kinjo.me
						</span>
					</span>
				</Link>
			</div>
		</header>
	);
};
