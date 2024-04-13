export interface BlogPost {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  body: string;
  description: string;
  heroImage: {
    url: string;
    height: number;
    width: number;
  };
}

export type BlogPosts = BlogPost[];