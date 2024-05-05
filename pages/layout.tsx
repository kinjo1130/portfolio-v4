import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import Tooltip from "@/components/Tooltip";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
type Props = {
  children: React.ReactNode;
  title?: string;
  tooltipText?: string;
  className?: string;
};

// title を props として追加します
export default function Layout({ children, title, tooltipText, className }: Props) {
  const [pageClass, setPageClass] = useState("");
  useEffect(() => {
    setPageClass("page-enter");
    // return () => {
    //   setPageClass("");
    // }
  },[]);
  return (
    <div className={`bg-gray-50 ${className}`}>
      <div className="flex justify-center">
        <Header />
      </div>
      <div className={`mx-10 mt-10 ${pageClass}`}>
        {/* props から受け取った title を使用します */}
        {title && (
          <div className="flex items-center mb-5 gap-2">
            <h1 className="font-bold text-2xl">{title}</h1>
            {tooltipText && (
              <Tooltip text={tooltipText}>
                <Info size={20} />
              </Tooltip>
            )}
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
