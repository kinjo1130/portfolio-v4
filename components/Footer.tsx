const SNS_LINKS = [
	{ label: "X (Twitter)", href: "https://twitter.com/kinjyo1130" },
	{ label: "Instagram", href: "https://www.instagram.com/kinjyo1130/" },
	{ label: "GitHub", href: "https://github.com/kinjo1130" },
] as const;

export const Footer: React.FC = () => {
	const year = new Date().getFullYear();
	return (
		<footer className="w-full border-t border-line">
			<div className="mx-auto max-w-screen-xl px-6 md:px-12 lg:px-20 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-sm font-medium text-ink-secondary">
					&copy; {year} Shotaro Kinjo
				</p>
				<ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
					{SNS_LINKS.map((link) => (
						<li key={link.href}>
							<a
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm font-medium text-ink-secondary link-draw"
							>
								{link.label}
							</a>
						</li>
					))}
				</ul>
			</div>
		</footer>
	);
};
