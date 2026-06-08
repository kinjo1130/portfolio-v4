export type Product = {
	slug: string;
	title: string;
	description?: string;
	image: {
		url: string;
		height: number;
		width: number;
	};
	url?: string;
	publishedAt: string;
	updatedAt: string;
	body: string;
};
export type Products = Product[];
