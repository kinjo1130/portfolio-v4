import type { TocItem } from "@/libs/renderDoc";
import { useEffect, useRef, useState } from "react";

type Props = {
  toc: TocItem[];
  className?: string;
};

export const TableOfContents = ({ toc, className }: Props) => {
  const [activeId, setActiveId] = useState<string | null>(toc[0]?.id ?? null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (toc.length === 0) return;
    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );
    for (const item of toc) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [toc]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const id = e.currentTarget.getAttribute("href")?.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  if (toc.length === 0) return null;

  return (
    <nav className={className} aria-label="目次">
      <p className="font-mono text-2xs uppercase tracking-wider text-ink-secondary mb-3">
        目次
      </p>
      <ul className="border-l border-line">
        {toc.map((item) => {
          const isActive = activeId === item.id;
          const indent = Math.max(0, item.level - 2) * 12;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={handleClick}
                style={{ paddingLeft: `${12 + indent}px` }}
                className={`block -ml-px border-l-2 py-1 pr-2 text-sm no-underline transition-colors duration-fast ${
                  isActive
                    ? "border-asphalt text-ink-primary"
                    : "border-transparent text-ink-secondary hover:text-ink-primary"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
