import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
type Title = string | undefined;

// title を props として追加します
export default function Layout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: Title;
}) {
  return (
    <div>
      <div className="flex justify-center">
        <Header />
      </div>
      <div className="mx-20 mt-10">
        {/* props から受け取った title を使用します */}
        {title && <h1 className="font-bold text-2xl mb-5">{title}</h1>}
        {children}
      </div>
      <div className="flex justify-center">
        <Footer />
      </div>
    </div>
  );
}
