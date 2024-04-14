import { BlogPost } from "@/types/blog";
import { QiitaPost } from "@/types/Qiita";

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