import { mockBlogPosts } from "@/lib/data/blog-post";
import type { BlogPost, Author, Category } from "@/lib/types/blog";
import { DEFAULT_LANGUAGE_CODE } from "@/lib/types/languages";

const STORAGE_KEYS = {
	BLOG_POSTS: "blog_posts",
	AUTHORS: "blog_authors",
	CATEGORIES: "blog_categories",
} as const;

export class BlogStorageService {
	// Blog Posts
	static getBlogPosts(): BlogPost[] {
		if (typeof window === "undefined") return [];
		try {
			const data = localStorage.getItem(STORAGE_KEYS.BLOG_POSTS);
			if (!data) return [];
			const posts = JSON.parse(data);
			return posts.map((post: any) => ({
				...post,
				createdAt: new Date(post.createdAt),
				updatedAt: new Date(post.updatedAt),
				publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
			}));
		} catch (error) {
			console.error("Error loading blog posts:", error);
			return [];
		}
	}

	static saveBlogPost(post: BlogPost): void {
		if (typeof window === "undefined") return;
		try {
			const posts = this.getBlogPosts();
			const existingIndex = posts.findIndex((p) => p.id === post.id);

			if (existingIndex >= 0) {
				posts[existingIndex] = { ...post, updatedAt: new Date() };
			} else {
				posts.push({ ...post, createdAt: new Date(), updatedAt: new Date() });
			}

			localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(posts));
		} catch (error) {
			console.error("Error saving blog post:", error);
			throw new Error("Failed to save blog post");
		}
	}

	static deleteBlogPost(id: string): void {
		if (typeof window === "undefined") return;
		try {
			const posts = this.getBlogPosts();
			const filteredPosts = posts.filter((p) => p.id !== id);
			localStorage.setItem(
				STORAGE_KEYS.BLOG_POSTS,
				JSON.stringify(filteredPosts)
			);
		} catch (error) {
			console.error("Error deleting blog post:", error);
			throw new Error("Failed to delete blog post");
		}
	}

	// Authors
	static getAuthors(): Author[] {
		if (typeof window === "undefined") return [];
		try {
			const data = localStorage.getItem(STORAGE_KEYS.AUTHORS);
			if (!data) return this.getDefaultAuthors();
			const authors = JSON.parse(data);
			return authors.map((author: any) => ({
				...author,
				createdAt: new Date(author.createdAt),
				updatedAt: new Date(author.updatedAt),
			}));
		} catch (error) {
			console.error("Error loading authors:", error);
			return this.getDefaultAuthors();
		}
	}

	static saveAuthor(author: Author): void {
		if (typeof window === "undefined") return;
		try {
			const authors = this.getAuthors();
			const existingIndex = authors.findIndex((a) => a.id === author.id);

			if (existingIndex >= 0) {
				authors[existingIndex] = { ...author };
			} else {
				authors.push({
					...author,
				});
			}

			localStorage.setItem(STORAGE_KEYS.AUTHORS, JSON.stringify(authors));
		} catch (error) {
			console.error("Error saving author:", error);
			throw new Error("Failed to save author");
		}
	}

	// Categories
	static getCategories(): Category[] {
		if (typeof window === "undefined") return [];
		try {
			const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
			if (!data) return this.getDefaultCategories();
			const categories = JSON.parse(data);
			return categories.map((category: any) => ({
				...category,
				createdAt: new Date(category.createdAt),
				updatedAt: new Date(category.updatedAt),
			}));
		} catch (error) {
			console.error("Error loading categories:", error);
			return this.getDefaultCategories();
		}
	}

	static saveCategory(category: Category): void {
		if (typeof window === "undefined") return;
		try {
			const categories = this.getCategories();
			const existingIndex = categories.findIndex((c) => c.id === category.id);

			if (existingIndex >= 0) {
				categories[existingIndex] = { ...category };
			} else {
				categories.push({
					...category,
				});
			}

			localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
		} catch (error) {
			console.error("Error saving category:", error);
			throw new Error("Failed to save category");
		}
	}

	// Initialize with default data
	static initializeDefaultData(): void {
		if (typeof window === "undefined") return;

		// Initialize authors if not exists
		if (!localStorage.getItem(STORAGE_KEYS.AUTHORS)) {
			localStorage.setItem(
				STORAGE_KEYS.AUTHORS,
				JSON.stringify(this.getDefaultAuthors())
			);
		}

		// Initialize categories if not exists
		if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
			localStorage.setItem(
				STORAGE_KEYS.CATEGORIES,
				JSON.stringify(this.getDefaultCategories())
			);
		}

		// Initialize blog posts if not exists
		if (!localStorage.getItem(STORAGE_KEYS.BLOG_POSTS)) {
			const authors = this.getAuthors();
			const categories = this.getCategories();
			const defaultPosts = this.getDefaultBlogPosts(authors, categories);
			localStorage.setItem(
				STORAGE_KEYS.BLOG_POSTS,
				JSON.stringify(defaultPosts)
			);
		}
	}

	// Default data generators
	private static getDefaultAuthors(): Author[] {
		return [
			{
				id: "1",
				name: "John Doe",
				email: "john@example.com",
				avatar: "/placeholder.svg?height=32&width=32",
			},
			{
				id: "2",
				name: "Jane Smith",
				email: "jane@example.com",
				avatar: "/placeholder.svg?height=32&width=32",
			},
		];
	}

	private static getDefaultCategories(): Category[] {
		return [
			{
				id: "1",
				name: {
					[DEFAULT_LANGUAGE_CODE]: "Technology",
					km: "បច្ចេកវិទ្យា",
					ko: "기술",
					th: "เทคโนโลยี",
				},
			},
			{
				id: "2",
				name: {
					[DEFAULT_LANGUAGE_CODE]: "Design",
					km: "ការរចនា",
					ko: "디자인",
					th: "การออกแบบ",
				},
			},
		];
	}

	private static getDefaultBlogPosts(
		authors: Author[],
		categories: Category[]
	): BlogPost[] {
		return mockBlogPosts;
	}

	// Utility methods
	static clearAllData(): void {
		if (typeof window === "undefined") return;
		localStorage.removeItem(STORAGE_KEYS.BLOG_POSTS);
		localStorage.removeItem(STORAGE_KEYS.AUTHORS);
		localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
	}

	static exportData(): string {
		return JSON.stringify(
			{
				posts: this.getBlogPosts(),
				authors: this.getAuthors(),
				categories: this.getCategories(),
			},
			null,
			2
		);
	}

	static importData(jsonData: string): void {
		try {
			const data = JSON.parse(jsonData);
			if (data.posts)
				localStorage.setItem(
					STORAGE_KEYS.BLOG_POSTS,
					JSON.stringify(data.posts)
				);
			if (data.authors)
				localStorage.setItem(
					STORAGE_KEYS.AUTHORS,
					JSON.stringify(data.authors)
				);
			if (data.categories)
				localStorage.setItem(
					STORAGE_KEYS.CATEGORIES,
					JSON.stringify(data.categories)
				);
		} catch (error) {
			throw new Error("Invalid JSON data");
		}
	}
}
