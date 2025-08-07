import { Media } from "./banner";
import { Category } from "./category";

export interface BlogPost {
	id: string;
	title: string;
	content: string;
	publishedAt: Date | null;
	readCounts: number;
	readTimes: number;
	commentsCount: number;
	isFeatured: boolean;
	category: Category;
	coverImage: Media | null;
	media: Media[];
	createdAt: Date;
	updatedAt: Date;
}
