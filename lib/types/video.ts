import { LocalizedField } from "./category";

export interface Video {
	id: string;
	videoId: string;
	title: LocalizedField;
	description: LocalizedField;
	date: Date;
	category: string;
	order: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt?: Date;
}
