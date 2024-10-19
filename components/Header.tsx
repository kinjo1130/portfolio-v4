import Link from "next/link";
import Tooltip from "./Tooltip";
import { useRouter } from "next/router";
import useEmblaCarousel from "embla-carousel-react";
import { Tabs } from "@/libs/const";
import { useEffect, useCallback } from "react";

type HeaderProps = {
  onTabChange: (index: number) => void;
};

export const Header: React.FC<HeaderProps> = ({ onTabChange }) => {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: 'start',
    dragFree: true,
  });

  const isActive = (href: string) => {
    if (href === "/") {
      return router.pathname === "/" ? "bg-slate-200" : "";
    }
    return router.pathname.startsWith(href + '/') || router.pathname === href
      ? "bg-slate-200"
      : "";
  };

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    onTabChange(emblaApi.selectedScrollSnap());
  }, [emblaApi, onTabChange]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', onSelect);
      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const currentIndex = Tabs.findIndex(tab => tab.href === router.pathname);
    if (currentIndex !== -1 && emblaApi) {
      emblaApi.scrollTo(currentIndex);
    }
  }, [router.pathname, emblaApi]);

  const handleTabClick = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };

  return (
    <header className="p-6 overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {Tabs.map((tab, index) => (
          <Link
            href={tab.href}
            key={tab.name}
            className={`flex-[0_0_auto] px-4 py-2 rounded-2xl mr-2 no-underline
              ${isActive(tab.href)}
              hover:bg-slate-100 transition-colors duration-200
            `}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick(index);
            }}
          >
            <p>{tab.name}</p>
          </Link>
        ))}
      </div>
    </header>
  );
};