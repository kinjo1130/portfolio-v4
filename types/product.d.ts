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
	draft?: boolean;
};
export type Products = Product[];
