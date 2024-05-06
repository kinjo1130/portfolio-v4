import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import Tooltip from "@/components/Tooltip";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Rss } from "lucide-react";
import { useRouter } from "next/router";
type Props = {
  children: React.ReactNode;
  title?: string;
  tooltipText?: string;
  className?: string;
};

// title を props として追加します
export default function Layout({
  children,
  title,
  tooltipText,
  className,
}: Props) {
  const [pageClass, setPageClass] = useState("");
  const router = useRouter();
  const routeFeed = () => {
    router.push("/api/feed");
  };
  const isBlogPath = router.pathname === "/blog";
  useEffect(() => {
    setPageClass("page-enter");
    // return () => {
    //   setPageClass("");
    // }
  }, []);
  return (
    <div className={`bg-gray-50 ${className}`}>
      <div className="flex justify-center">
        <Header />
      </div>
      <div className={`mx-10 lg:mx-auto mt-10 max-w-screen-md ${pageClass} `}>
        {/* tooltip */}
        {title && (
          <div className="flex items-center mb-5 justify-between gap-2">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-2xl">{title}</h1>
              {tooltipText && (
                <Tooltip text={tooltipText}>
                  <Info size={20} />
                </Tooltip>
              )}
            </div>
            {/* RSS */}
            {isBlogPath && (
              <div className="flex justify-center">
                <button
                  type="button"
                  className="hover:bg-slate-200 px-3 py-2 rounded-2xl flex items-center gap-2"
                  onClick={() => routeFeed()}
                >
                  <Rss size={20} />
                  RSS
                </button>
              </div>
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
