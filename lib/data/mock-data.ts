import { BlogPost, BlogComment, BlogMedia } from "../types/types";
import { mockCategories } from "./category";

export const mockBlogPosts: BlogPost[] = [
	{
		id: "1",
		title: "The Future of Web Development",
		content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
		categoryId: "1",
		category: mockCategories[0],
		coverImageUrl:
			"https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800",
		publishedDate: new Date("2024-01-15"),
		readCount: 1250,
		createdAt: new Date("2024-01-15"),
		updatedAt: new Date("2024-01-15"),
	},
	{
		id: "2",
		title: "Modern Design Principles",
		content:
			"Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
		categoryId: "2",
		category: mockCategories[1],
		coverImageUrl:
			"https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
		publishedDate: new Date("2024-01-20"),
		readCount: 890,
		createdAt: new Date("2024-01-20"),
		updatedAt: new Date("2024-01-20"),
	},
];

export const mockComments: BlogComment[] = [
	{
		id: "1",
		blogPostId: "1",
		blogPost: mockBlogPosts[0],
		authorName: "John Doe",
		authorEmail: "john@example.com",
		content: "Great article! Very insightful.",
		isApproved: true,
		createdAt: new Date("2024-01-16"),
	},
	{
		id: "2",
		blogPostId: "1",
		blogPost: mockBlogPosts[0],
		authorName: "Jane Smith",
		authorEmail: "jane@example.com",
		content: "I disagree with some points, but overall good read.",
		isApproved: false,
		createdAt: new Date("2024-01-17"),
	},
];

export const mockMedia: BlogMedia[] = [
	{
		id: "1",
		blogPostId: "1",
		fileName: "hero-image.jpg",
		fileUrl:
			"https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg",
		mimeType: "image/jpeg",
		fileSize: 245760,
		createdAt: new Date("2024-01-15"),
	},
	{
		id: "2",
		fileName: "diagram.png",
		fileUrl: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
		mimeType: "image/png",
		fileSize: 156432,
		createdAt: new Date("2024-01-20"),
	},
];
