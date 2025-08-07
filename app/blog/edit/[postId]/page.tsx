import { BlogPostEditor } from "@/components/blog/blog-post-editor";
import { mockBlogPosts } from "@/lib/data/blog-post";
import { mockCategories } from "@/lib/data/category";

interface PageProps {
	params: Promise<{
		postId: string;
	}>;
}

export default async function EditBlogPostPage({ params }: PageProps) {
	const { postId } = await params;

	const postData =
		postId === "new"
			? null
			: mockBlogPosts.find((p) => p.id === postId) || null;

	const categories = mockCategories;

	return <BlogPostEditor initialData={postData} categories={categories} />;
}
