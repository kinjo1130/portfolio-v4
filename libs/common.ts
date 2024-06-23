import { BlogPost } from "@/types/blog";
import { QiitaPost } from "@/types/Qiita";
import { client } from "@/libs/client";
import { WorkApiResponse, Work, Works } from "@/types/work";
import { title } from "process";
import { link } from "fs";

export const getPublishedDate = (post: ZennPost | BlogPost | QiitaPost): Date => {
  if ('created_at' in post) {
    return new Date(post.created_at);
  } else if ('createdAt' in post) {
    return new Date(post.createdAt);
  } else {
    return new Date(post.published_at);
  }
}

export const isPostWithUrl = (post: BlogPost | QiitaPost | ZennPost): post is QiitaPost => {
  return 'url' in post;
}

export const isPostWithPath = (post: BlogPost | QiitaPost | ZennPost): post is QiitaPost | ZennPost => {
  return 'path' in post;
}

export const formatDate = (dateString: string) => {

  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-');
}
// 現在勤務しているかどうかを判定する関数
export const currentWorkList = async () => {
  const workList: WorkApiResponse = await client.get({ endpoint: "work" });
  const currentWork: Works = workList.contents.filter((work) => {
    return work.toAt === null;
  });

  return currentWork.map((work) => {
    return {
      title: work.title,
      link: work.link,
    }
  });
}
export const isDev =
process.env.NODE_ENV === "development"
  ? "http://localhost:3000"
  : "https://kinjo.me";