import Link from "next/link";
import Tooltip from "./Tooltip";

export const Header: React.FC = () => {
  return (
    <header className="p-6 flex items-center gap-4">
      <Link href="/" className="underline">
        <p>home</p>
      </Link>
      {/* <Tooltip text="blogページです">
        <Link href="/blog" className="underline">
          <p>blog</p>
        </Link>
      </Tooltip> */}
      <Link href="/blog" className="underline">
        <p>blog</p>
      </Link>

      <Link href="/products" className="underline">
        <p>products</p>
      </Link>
      <Link href="/work" className="underline">
        <p>work</p>
      </Link>
      <Link href="/about" className="underline">
        <p>about</p>
      </Link>
    </header>
  );
};
