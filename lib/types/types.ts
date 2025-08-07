import { Category } from "./category";

export interface BlogPost {
	id: string;
	title: string;
	content: string;
	categoryId: string;
	category?: Category;
	coverImageUrl?: string;
	publishedDate: Date;
	readCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface BlogComment {
	id: string;
	blogPostId: string;
	blogPost?: BlogPost;
	authorName: string;
	authorEmail: string;
	content: string;
	isApproved: boolean;
	createdAt: Date;
}

export interface BlogMedia {
	id: string;
	blogPostId?: string;
	fileName: string;
	fileUrl: string;
	mimeType: string;
	fileSize: number;
	createdAt: Date;
}
