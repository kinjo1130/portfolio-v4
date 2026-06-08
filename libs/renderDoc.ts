import * as cheerio from "cheerio";

export type TocItem = {
  text: string;
  id: string;
  level: number;
};

export const renderToc = (body: string): TocItem[] => {
  const $ = cheerio.load(body);
  const headings = $("h1, h2, h3").toArray();
  return headings
    .map((node) => {
      const el = node as cheerio.Element;
      const tag = el.tagName ?? el.name ?? "h2";
      const level = Number(tag.replace(/[^0-9]/g, "")) || 2;
      const id = el.attribs?.id ?? "";
      const text = $(el).text().trim();
      return { text, id, level };
    })
    .filter((item) => item.id && item.text);
};
