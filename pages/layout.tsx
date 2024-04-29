import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import Tooltip from "@/components/Tooltip";
import { Info } from "lucide-react";
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
    <div className="bg-gray-50">
      <div className="flex justify-center">
        <Header />
      </div>
      <div className="mx-20 mt-10">
        {/* props から受け取った title を使用します */}
        {title && (
          <div className="flex items-center mb-5 gap-2">
            <h1 className="font-bold text-2xl">{title}</h1>
            <Tooltip text="ブログページ一覧です">
              <Info size={20} />
            </Tooltip>
          </div>
        )}
        {children}
      </div>
      <div className="flex justify-center">
        <Footer />
      </div>
    </div>
  );
}
