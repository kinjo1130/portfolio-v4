type Props = {
  children: React.ReactNode;
  className?: string;
  handleClick?: () => void;
};
export default function Button({ children, className, handleClick }:Props) {
  return (
    <button type="button" onClick={handleClick} className={`bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded ${className}`}>
      {children}
    </button>
  );
}
