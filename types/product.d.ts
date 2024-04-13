export type Product = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  description: string;
  image: {
    url: string;
    height: number;
    width: number;
  };
  URL: string;
};
export type Products = Product[];