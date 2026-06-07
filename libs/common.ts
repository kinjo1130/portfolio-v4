import type { BlogPost } from "@/types/blog";
import type { QiitaPost } from "@/types/Qiita";

export const getPublishedDate = (
  post: ZennPost | BlogPost | QiitaPost,
): Date => {
  if ("created_at" in post) {
    return new Date(post.created_at);
  }
  if ("createdAt" in post) {
    return new Date(post.createdAt);
  }
  return new Date(post.published_at);
};

export const isPostWithUrl = (
  post: BlogPost | QiitaPost | ZennPost,
): post is QiitaPost => {
  return "url" in post;
};

export const isPostWithPath = (
  post: BlogPost | QiitaPost | ZennPost,
): post is QiitaPost | ZennPost => {
  return "path" in post;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-");
};

export const isDev =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.kinjo.me";
