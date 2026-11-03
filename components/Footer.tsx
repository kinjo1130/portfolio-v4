export const Footer: React.FC = () => {
	const year = new Date().getFullYear();
	return (
		<footer className="w-full border-t border-line">
			<div className="mx-auto max-w-screen-xl px-6 md:px-12 py-6">
				<p className="text-sm font-medium text-ink-secondary">
					&copy; {year} Shotaro Kinjo
				</p>
			</div>
		</footer>
	);
};
