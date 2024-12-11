type Props = {
	children: React.ReactNode;
	className?: string;
	handleClick?: () => void;
	type?: "button" | "submit" | "reset";
};
export const Button: React.FC<Props> = ({
	children,
	className,
	handleClick,
	type,
}) => {
	return (
		<button
			type={type}
			onClick={handleClick}
			className={`bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded ${className}`}
		>
			{children}
		</button>
	);
};
