import { mockCategories } from "@/lib/data/category";
import { mockBlogPosts } from "@/lib/data/blog-post";
import { BlogPostDetailSheet } from "@/components/blog/blog-post-detail-sheet";
import BlogPostManagment from "@/components/blog/blog-post-management";

export default async function BlogManagementPage() {
	const posts = mockBlogPosts;
	const categories = mockCategories;

	return <BlogPostManagment />;
}
