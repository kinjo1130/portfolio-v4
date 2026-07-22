import React from "react";

interface TooltipProps {
	text: string;
	children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
	return (
		<div className="group relative flex items-center">
			{children}
			<div className="absolute top-full w-10 mt-2 hidden group-hover:block">
				<div className="bg-surface-inverse text-ink-on-inverse text-xs rounded-sm shadow-sm py-1 px-2 min-w-max left-0">
					{text}
				</div>
			</div>
		</div>
	);
};

export default Tooltip;
