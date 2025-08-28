import { BlogPost, Author, Category } from "@/lib/types/blog";
import { DEFAULT_LANGUAGE_CODE } from "@/lib/types/languages";

// Mock related data
export const mockAuthors: Author[] = [
	{ id: "author-1", name: "John Doe", avatar: "https://github.com/shadcn.png" },
	{
		id: "author-2",
		name: "Jane Smith",
		avatar: "https://github.com/shadcn.png",
	},
];

export const mockCategories: Category[] = [
	{ id: "cat-1", name: { en: "Technology", km: "បច្ចេកវិទ្យា" } },
	{ id: "cat-2", name: { en: "Design", km: "ការរចនា" } },
];

// Mock blog posts with the correct, consistent structure
export const mockBlogPosts: BlogPost[] = [
	{
		id: "post-1",
		title: {
			en: "Unlocking the Power of Serverless Functions",
			km: "ដោះសោថាមពលនៃមុខងារគ្មានម៉ាស៊ីនមេ",
		},
		content: {
			en: "Serverless computing allows you to build and run applications without thinking about servers.",
			km: "...",
		},
		excerpt: {
			en: "A deep dive into serverless architecture and its benefits for modern applications.",
			km: "...",
		},
		status: "published",
		publishedAt: new Date("2025-07-28T10:00:00Z"),
		coverImageUrl:
			"https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg",
		readCounts: 12530,
		readTimes: 8,
		commentsCount: 42,
		isFeatured: true,
		authorId: "author-1",
		categoryId: "cat-1",
		tags: ["serverless", "nextjs", "cloud"],
		createdAt: new Date("2025-07-27T10:00:00Z"),
		updatedAt: new Date("2025-07-28T11:00:00Z"),
		author: mockAuthors[0],
		category: mockCategories[0],
	},
	{
		id: "post-2",
		title: {
			en: "A Guide to Modern UI/UX Design",
			km: "មគ្គុទ្ទេសក៍អំពីការរចនា UI/UX ទំនើប",
		},
		content: { en: "The principles of good design are timeless.", km: "..." },
		excerpt: {
			en: "Explore the core principles of creating intuitive and beautiful user interfaces.",
			km: "...",
		},
		status: "draft",
		publishedAt: undefined,
		coverImageUrl:
			"https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg",
		readCounts: 0,
		readTimes: 5,
		commentsCount: 0,
		isFeatured: false,
		authorId: "author-2",
		categoryId: "cat-2",
		tags: ["ui", "ux", "design-systems"],
		createdAt: new Date("2025-08-01T15:00:00Z"),
		updatedAt: new Date("2025-08-02T16:00:00Z"),
		author: mockAuthors[1],
		category: mockCategories[1],
	},
];
