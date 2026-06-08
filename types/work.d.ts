export type Work = {
	slug: string;
	title: string;
	fromAt: string;
	toAt: string | null;
	description: string;
	position: string[];
	link: string;
	body: string;
};

export type Works = Work[];
