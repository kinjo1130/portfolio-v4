type Props = {
	children: React.ReactNode;
	className?: string;
	variant?: "primary" | "secondary";
	handleClick?: () => void;
};

const VARIANT_CLASS = {
	primary:
		"bg-[var(--action-primary-bg)] text-[var(--action-primary-fg)] hover:bg-[var(--action-primary-bg-hover)] active:bg-[var(--action-primary-bg-active)] shadow-sm",
	secondary:
		"bg-transparent text-ink-primary border border-line-strong hover:bg-surface-raised active:bg-surface-sunken",
} as const;

export default function Button({
	children,
	className,
	variant = "primary",
	handleClick,
}: Props) {
	return (
		<button
			type="button"
			onClick={handleClick}
			className={`rounded-button px-4 py-2 font-medium transition-colors duration-fast disabled:opacity-40 disabled:pointer-events-none ${VARIANT_CLASS[variant]} ${className ?? ""}`}
		>
			{children}
		</button>
	);
}
