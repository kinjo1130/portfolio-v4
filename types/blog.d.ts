export interface BlogPost {
  id: string;
  /** local は content/blogs の Markdown、cosense は公開 Cosense から同期したページ */
  source: "local" | "cosense";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  revisedAt?: string;
  title: string;
  body: string;
  description: string;
  heroImage?: {
    url: string;
    height: number;
    width: number;
  };
  draft?: boolean;
}

export type BlogPosts = BlogPost[];
