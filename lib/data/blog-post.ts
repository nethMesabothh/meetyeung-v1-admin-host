import { BlogPost } from "../types/blog";
import { mockMedia } from "./banner-data";
import { mockCategories } from "./category";

export const mockBlogPosts: BlogPost[] = [
	{
		id: "post_1",
		title: "Unlocking the Power of Serverless Functions",
		content: `<h2>What is Serverless?</h2><p>Serverless computing allows you to build and run applications and services without thinking about servers.</p>`,
		publishedAt: new Date("2025-07-28T10:00:00Z"),
		coverImage: mockMedia[2], // Directly nest the media object
		media: [mockMedia[3]], // Directly nest the media objects for the gallery
		readCounts: 12530,
		readTimes: 8,
		commentsCount: 42,
		isFeatured: true,
		category: mockCategories[0], // Directly nest the category object
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: "post_2",
		title: "A Guide to Minimalist & Modern Design",
		content: `<h2>Packing Light, Traveling Far</h2><p>This guide covers everything you need to know for a month-long trip through Southeast Asia.</p>`,
		publishedAt: new Date("2025-08-02T14:30:00Z"),
		coverImage: mockMedia[1],
		media: [mockMedia[0], mockMedia[3]],
		readCounts: 8900,
		readTimes: 6,
		commentsCount: 18,
		isFeatured: false,
		category: mockCategories[1],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: "post_3",
		title: "Draft: The Principles of Good Design",
		content: `<p>This post is currently a work in progress.</p>`,
		publishedAt: null, // Draft
		coverImage: null, // No cover image
		media: [],
		readCounts: 0,
		readTimes: 1,
		commentsCount: 0,
		isFeatured: false,
		category: mockCategories[1],
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];
