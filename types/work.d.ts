export type Work = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  fromAt: string;
  toAt: string;
  description: string;
  position: string;
  link: string;
};

export type Works = Work[];

export type WorkApiResponse = {
  contents: Works;
  totalCount: number;
  offset: number;
  limit: number;
};