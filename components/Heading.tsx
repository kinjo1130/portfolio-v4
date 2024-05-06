import React from 'react';

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const defaultClasses = "font-bold my-3";
const sizeClasses = {
  1: "text-2xl",
  2: "text-xl",
  3: "text-lg",
  4: "text-md",
  5: "text-sm",
  6: "text-xs",
};

export default function Heading({ children, level = 1, className = "" }: HeadingProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  const combinedClasses = `${defaultClasses} ${sizeClasses[level]} ${className}`;

  return (
    <HeadingTag className={combinedClasses}>{children}</HeadingTag>
  );
}