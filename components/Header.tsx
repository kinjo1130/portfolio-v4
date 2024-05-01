import Link from "next/link";
import Tooltip from "./Tooltip";
import { useRouter } from "next/router";

export const Header: React.FC = () => {
  const router = useRouter();
  const isActive = (href: string) => {
    return href === router.pathname ? "bg-slate-200 rounded-2xl py-2 px-4 no-underline" : "";
  };
  return (
    <header className="p-6 flex items-center gap-4">
      <Link
        href="/"
        className={`underline hover:no-underline ${isActive("/")}`}
      >
        <p>home</p>
      </Link>
      {/* <Tooltip text="blogページです">
        <Link href="/blog" className="underline">
          <p>blog</p>
        </Link>
      </Tooltip> */}
      <Link
        href="/blog"
        className={`underline hover:no-underline ${isActive("/blog")}`}
      >
        <p>blog</p>
      </Link>

      <Link
        href="/products"
        className={`underline hover:no-underline ${isActive("/products")}`}
      >
        <p>products</p>
      </Link>
      <Link
        href="/work"
        className={`underline hover:no-underline ${isActive("/work")}`}
      >
        <p>work</p>
      </Link>
      <Link
        href="/about"
        className={`underline hover:no-underline ${isActive("/about")}`}
      >
        <p>about</p>
      </Link>
    </header>
  );
};
