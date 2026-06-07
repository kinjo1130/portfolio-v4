import fs from "node:fs";
import path from "node:path";
import type { BlogPost, BlogPosts } from "@/types/blog";
import type { Product, Products } from "@/types/product";
import type { Works } from "@/types/work";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJson<T>(file: string): T {
  const fullPath = path.join(CONTENT_DIR, file);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}

export function getBlogs(): BlogPosts {
  const posts = readJson<BlogPosts>("blogs.json");
  return [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt ?? b.createdAt).getTime() -
      new Date(a.publishedAt ?? a.createdAt).getTime(),
  );
}

export function getBlog(id: string): BlogPost | undefined {
  return getBlogs().find((post) => post.id === id);
}

export function getWorks(): Works {
  const works = readJson<Works>("works.json");
  return [...works].sort((a, b) => {
    const aTo = a.toAt ? new Date(a.toAt).getTime() : Number.POSITIVE_INFINITY;
    const bTo = b.toAt ? new Date(b.toAt).getTime() : Number.POSITIVE_INFINITY;
    return bTo - aTo;
  });
}

export function getCurrentWorks() {
  return getWorks()
    .filter((work) => work.toAt === null || work.toAt === undefined)
    .map((work) => ({ title: work.title, link: work.link }));
}

export function getProducts(): Products {
  const products = readJson<Products>("products.json");
  return [...products].sort(
    (a, b) =>
      new Date(b.publishedAt ?? b.createdAt).getTime() -
      new Date(a.publishedAt ?? a.createdAt).getTime(),
  );
}

export function getProduct(id: string): Product | undefined {
  return getProducts().find((product) => product.id === id);
}
