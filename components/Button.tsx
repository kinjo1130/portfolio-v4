type Props = {
  children: React.ReactNode;
  className?: string;
};
export default function Button({ children, className }: { children: React.ReactNode, className?: string}) {
  return (
    <button className={`bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded ${className}`}>
      {children}
    </button>
  );
}
