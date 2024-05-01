import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="p-6 flex items-center gap-4 mt-20">
      <p>&copy; kinjo shotaro  2024年</p>
      <a href="https://github.com/kinjo1130/portfolio-v4" target="_blank" rel="noopener noreferrer" className="underline">
        ソースコード
      </a>
    </footer>
  );
};
