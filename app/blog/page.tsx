import { ClientPage } from "@/components/blog/client-page";
import { mockCategories } from "@/lib/data/category";
import { mockBlogPosts } from "@/lib/data/blog-post";

export default async function BlogManagementPage() {
	const posts = mockBlogPosts;
	const categories = mockCategories;

	return <ClientPage />;
}
