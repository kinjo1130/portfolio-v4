import fs from "node:fs/promises";
import path from "node:path";

const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const API_KEY = process.env.MICROCMS_API_KEY;

if (!SERVICE_DOMAIN || !API_KEY) {
  console.error(
    "Set MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY (run with: node --env-file=.env scripts/migrate-microcms.mjs)",
  );
  process.exit(1);
}

const BASE = `https://${SERVICE_DOMAIN}.microcms.io/api/v1`;
const HEADERS = { "X-MICROCMS-API-KEY": API_KEY };
const ROOT = process.cwd();

async function fetchAll(endpoint) {
  const all = [];
  let offset = 0;
  const limit = 100;
  while (true) {
    const url = `${BASE}/${endpoint}?limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) {
      throw new Error(
        `${endpoint} fetch failed: ${res.status} ${await res.text()}`,
      );
    }
    const json = await res.json();
    all.push(...json.contents);
    if (all.length >= json.totalCount || json.contents.length === 0) break;
    offset += limit;
  }
  return all;
}

function extFromContentType(ct, urlPath) {
  if (ct.includes("webp")) return "webp";
  if (ct.includes("png")) return "png";
  if (ct.includes("jpeg") || ct.includes("jpg")) return "jpg";
  if (ct.includes("gif")) return "gif";
  if (ct.includes("svg")) return "svg";
  const e = path.extname(urlPath).slice(1).toLowerCase();
  return e || "bin";
}

async function downloadImage(url, destDir, basename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image ${url} ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = extFromContentType(
    res.headers.get("content-type") ?? "",
    new URL(url).pathname,
  );
  await fs.mkdir(destDir, { recursive: true });
  const filename = `${basename}.${ext}`;
  await fs.writeFile(path.join(destDir, filename), buf);
  return filename;
}

async function rewriteInlineImages(html, destDir, urlPrefix) {
  if (!html) return html;
  const regex = /https:\/\/images\.microcms-assets\.io\/[^\s"'<>)]+/g;
  const urls = [...new Set(html.match(regex) ?? [])];
  let next = html;
  let i = 0;
  for (const url of urls) {
    const basename = `inline-${String(i).padStart(2, "0")}`;
    const filename = await downloadImage(url, destDir, basename);
    const relPath = `${urlPrefix}/${filename}`;
    next = next.split(url).join(relPath);
    console.log(`    inline image: ${url} -> ${relPath}`);
    i += 1;
  }
  return next;
}

async function writeJson(relPath, data) {
  const full = path.join(ROOT, relPath);
  await fs.writeFile(full, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

async function migrateBlogs() {
  const items = await fetchAll("blogs");
  const result = [];
  for (const item of items) {
    const next = { ...item };
    const destDir = path.join(ROOT, "public", "images", "blogs", item.id);
    const urlPrefix = `/images/blogs/${item.id}`;
    if (item.heroImage?.url) {
      const filename = await downloadImage(item.heroImage.url, destDir, "cover");
      next.heroImage = {
        url: `${urlPrefix}/${filename}`,
        width: item.heroImage.width,
        height: item.heroImage.height,
      };
      console.log(`  blog image: ${item.id} -> ${filename}`);
    }
    if (item.body) {
      next.body = await rewriteInlineImages(item.body, destDir, urlPrefix);
    }
    result.push(next);
  }
  await writeJson("content/blogs.json", result);
  console.log(`blogs: ${result.length}`);
}

async function migrateProducts() {
  const items = await fetchAll("products");
  const result = [];
  for (const item of items) {
    const next = { ...item };
    const destDir = path.join(ROOT, "public", "images", "products", item.id);
    const urlPrefix = `/images/products/${item.id}`;
    if (item.image?.url) {
      const filename = await downloadImage(item.image.url, destDir, "cover");
      next.image = {
        url: `${urlPrefix}/${filename}`,
        width: item.image.width,
        height: item.image.height,
      };
      console.log(`  product image: ${item.id} -> ${filename}`);
    }
    if (item.content) {
      next.content = await rewriteInlineImages(item.content, destDir, urlPrefix);
    }
    result.push(next);
  }
  await writeJson("content/products.json", result);
  console.log(`products: ${result.length}`);
}

async function migrateWorks() {
  const items = await fetchAll("work");
  await writeJson("content/works.json", items);
  console.log(`works: ${items.length}`);
}

await migrateBlogs();
await migrateProducts();
await migrateWorks();
console.log("done.");
