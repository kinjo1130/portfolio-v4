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
        <div className="bg-black text-white text-xs rounded py-1 px-2 min-w-max left-0 transform translate">
          {text}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
