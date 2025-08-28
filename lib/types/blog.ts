import { LocalizedField } from "./category";

export type BlogPostStatus = "published" | "draft" | "scheduled" | "archived";

export interface Author {
	id: string;
	name: string;
	avatar?: string;
	email?: string;
}

export interface Category {
	id: string;
	name: LocalizedField;
}

// This is our definitive BlogPost type
export interface BlogPost {
	id: string;
	title: LocalizedField;
	content: LocalizedField;
	excerpt?: LocalizedField;
	seoTitle?: LocalizedField;
	seoDescription?: LocalizedField;
	coverImageUrl?: string;
	galleryImages?: string[];
	authorId: string;
	author?: Author;
	categoryId: string;
	category?: Category;
	status: BlogPostStatus;
	isFeatured: boolean;
	publishedAt?: Date;
	readTimes: number;
	readCounts: number;
	commentsCount: number;
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}
