"use client";

import { useState, useEffect, useCallback } from "react";
import type { BlogPost, Author, Category } from "@/lib/types/blog";
import { BlogStorageService } from "@/components/services/blog-storage";

interface UseBlogDataReturn {
	// Data
	blogPosts: BlogPost[];
	authors: Author[];
	categories: Category[];

	// Loading states
	isLoading: boolean;

	// Actions
	createPost: (postData: BlogPost) => Promise<void>;
	updatePost: (postData: BlogPost) => Promise<void>;
	deletePost: (id: string) => Promise<void>;
	refreshData: () => Promise<void>;

	// Utility
	getPostById: (id: string) => BlogPost | undefined;
	getAuthorById: (id: string) => Author | undefined;
	getCategoryById: (id: string) => Category | undefined;

	// Statistics
	stats: {
		totalPosts: number;
		publishedPosts: number;
		draftPosts: number;
		scheduledPosts: number;
		archivedPosts: number;
		totalAuthors: number;
		totalCategories: number;
	};
}

export function useBlogData(): UseBlogDataReturn {
	const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
	const [authors, setAuthors] = useState<Author[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			// Initialize default data if needed
			BlogStorageService.initializeDefaultData();

			// Load all data
			const posts = BlogStorageService.getBlogPosts();
			const authorsData = BlogStorageService.getAuthors();
			const categoriesData = BlogStorageService.getCategories();

			setBlogPosts(posts);
			setAuthors(authorsData);
			setCategories(categoriesData);
		} catch (error) {
			console.error("Error loading blog data:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const createPost = useCallback(async (postData: BlogPost) => {
		try {
			BlogStorageService.saveBlogPost(postData);
			setBlogPosts((prev) => [...prev, postData]);
		} catch (error) {
			console.error("Error creating post:", error);
			throw error;
		}
	}, []);

	const updatePost = useCallback(async (postData: BlogPost) => {
		try {
			BlogStorageService.saveBlogPost(postData);
			setBlogPosts((prev) =>
				prev.map((post) => (post.id === postData.id ? postData : post))
			);
		} catch (error) {
			console.error("Error updating post:", error);
			throw error;
		}
	}, []);

	const deletePost = useCallback(async (id: string) => {
		try {
			BlogStorageService.deleteBlogPost(id);
			setBlogPosts((prev) => prev.filter((post) => post.id !== id));
		} catch (error) {
			console.error("Error deleting post:", error);
			throw error;
		}
	}, []);

	const refreshData = useCallback(async () => {
		await loadData();
	}, [loadData]);

	const getPostById = useCallback(
		(id: string) => {
			return blogPosts.find((post) => post.id === id);
		},
		[blogPosts]
	);

	const getAuthorById = useCallback(
		(id: string) => {
			return authors.find((author) => author.id === id);
		},
		[authors]
	);

	const getCategoryById = useCallback(
		(id: string) => {
			return categories.find((category) => category.id === id);
		},
		[categories]
	);

	const stats = useCallback(() => {
		const totalPosts = blogPosts.length;
		const publishedPosts = blogPosts.filter(
			(p) => p.status === "published"
		).length;
		const draftPosts = blogPosts.filter((p) => p.status === "draft").length;
		const scheduledPosts = blogPosts.filter(
			(p) => p.status === "scheduled"
		).length;
		const archivedPosts = blogPosts.filter(
			(p) => p.status === "archived"
		).length;
		const totalAuthors = authors.length;
		const totalCategories = categories.length;

		return {
			totalPosts,
			publishedPosts,
			draftPosts,
			scheduledPosts,
			archivedPosts,
			totalAuthors,
			totalCategories,
		};
	}, [blogPosts, authors, categories]);

	return {
		// Data
		blogPosts,
		authors,
		categories,

		// Loading states
		isLoading,

		// Actions
		createPost,
		updatePost,
		deletePost,
		refreshData,

		// Utility
		getPostById,
		getAuthorById,
		getCategoryById,

		// Statistics
		stats: stats(),
	};
}
