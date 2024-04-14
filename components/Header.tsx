import Link from "next/link";

export const Header: React.FC = () => {
  return (
    <header className="p-6 flex items-center gap-4">
      <Link href="/">
        <p>home</p>
      </Link>
      <Link href="/blog">
        <p>blog</p>
      </Link>
      <Link href="/product">
        <p>product</p>
      </Link>
      <Link href="/work">
        <p>work</p>
      </Link>
      <Link href="/about">
        <p>about</p>
      </Link>
    </header>
  );
};
