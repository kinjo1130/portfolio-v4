import { Header } from "@/components/Header";
type Title = string | undefined;

// title を props として追加します
export default function Layout({ children, title }: { children: React.ReactNode; title?: Title}) {
  return (
    <div>
      <Header />
      <div className="mx-20 mt-10">
        {/* props から受け取った title を使用します */}
        {title && <h1 className="font-bold text-2xl">{title}</h1>}
        {children}
      </div>
    </div>
  );
}