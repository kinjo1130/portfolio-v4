import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import Tooltip from "@/components/Tooltip";
import { Info, Rss } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import useEmblaCarousel from 'embla-carousel-react';
import { Tabs } from "@/libs/const";
import React from "react";

type Props = {
  children: React.ReactNode;
  title?: string;
  tooltipText?: string;
  className?: string;
};

export default function Layout({
  children,
  title,
  tooltipText,
  className,
}: Props) {
  const [pageClass, setPageClass] = useState("");
  const router = useRouter();
  const [contentEmblaRef, contentEmblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const routeFeed = () => {
    router.push("/api/feed");
  };

  const isBlogPath = router.pathname === "/blog";

  useEffect(() => {
    setPageClass("page-enter");
  }, []);

  const onTabChange = useCallback((index: number) => {
    if (contentEmblaApi) {
      contentEmblaApi.scrollTo(index);
    }
    const currentPath = Tabs[index].href;
    if (router.pathname !== currentPath) {
      router.push(currentPath);
    }
  }, [contentEmblaApi, router]);

  const onContentSelect = useCallback(() => {
    if (!contentEmblaApi) return;
    const index = contentEmblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    const currentPath = Tabs[index].href;
    if (router.pathname !== currentPath) {
      router.push(currentPath);
    }
  }, [contentEmblaApi, router]);

  useEffect(() => {
    if (contentEmblaApi) {
      contentEmblaApi.on('select', onContentSelect);
      return () => {
        contentEmblaApi.off('select', onContentSelect);
      };
    }
  }, [contentEmblaApi, onContentSelect]);

  useEffect(() => {
    const currentIndex = Tabs.findIndex(tab => tab.href === router.pathname);
    if (currentIndex !== -1 && contentEmblaApi) {
      contentEmblaApi.scrollTo(currentIndex);
    }
  }, [router.pathname, contentEmblaApi]);

  return (
    <div className={`bg-gray-50 ${className}`}>
      <div className="flex justify-center">
        <Header onTabChange={onTabChange} />
      </div>
      <div className={`mx-10 lg:mx-auto mt-10 max-w-screen-md ${pageClass}`}>
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

        <div className="overflow-hidden" ref={contentEmblaRef}>
          <div className="flex">
            {React.Children.map(children, (child, index) => (
              <div className="flex-[0_0_100%] min-w-0" key={index}>
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <Footer />
      </div>
    </div>
  );
}