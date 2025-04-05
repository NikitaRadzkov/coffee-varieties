export interface CoffeeData {
	id: number;
	uid: string;
	blend_name: string;
	origin: string;
	variety: string;
	notes: string;
	intensifier: string;
	image: string;
}

export interface ProcessedCoffeeData {
	blend_name: string;
	origin: string;
	variety: string;
	notes: string[];
	intensifier: string;
	imageUrl: string;
}
