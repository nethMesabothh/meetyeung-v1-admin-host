"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { BlogPostFormDialog } from "@/components/blog/blog-post-form-dialog";
import { createEnhancedColumns } from "./enhance-column";
import { DataTable } from "./data-table";
import type { BlogPost } from "@/lib/types/blog";
import { BlogStorageService } from "../services/blog-storage";
import {
	Plus,
	FileText,
	Users,
	Folder,
	RefreshCw,
	Download,
	Upload,
	Trash2,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBlogData } from "@/hooks/use-blog-data";
import { useToast } from "@/hooks/use-toast";

export default function BlogPostManagment() {
	const {
		blogPosts,
		authors,
		categories,
		isLoading,
		createPost,
		updatePost,
		deletePost,
		refreshData,
		stats,
	} = useBlogData();

	const { toast } = useToast();

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
	const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

	const handleCreatePost = () => {
		setEditingPost(null);
		setDialogMode("create");
		setIsDialogOpen(true);
	};

	const handleEditPost = (post: BlogPost) => {
		setEditingPost(post);
		setDialogMode("edit");
		setIsDialogOpen(true);
	};

	const handleViewPost = (post: BlogPost) => {
		// Navigate to edit form as requested
		handleEditPost(post);
	};

	const handleDeletePost = async (id: string) => {
		try {
			await deletePost(id);
			toast({
				title: "Success",
				description: "Blog post deleted successfully",
			});
		} catch (error) {
			console.error("Error deleting post:", error);
			toast({
				title: "Error",
				description: "Failed to delete blog post",
				variant: "destructive",
			});
		}
	};

	const handleSavePost = async (postData: BlogPost) => {
		try {
			if (dialogMode === "create") {
				await createPost(postData);
				toast({
					title: "Success",
					description: "Blog post created successfully",
				});
			} else {
				await updatePost(postData);
				toast({
					title: "Success",
					description: "Blog post updated successfully",
				});
			}
		} catch (error) {
			console.error("Error saving post:", error);
			toast({
				title: "Error",
				description: "Failed to save blog post",
				variant: "destructive",
			});
		}
	};

	const handleRefreshData = async () => {
		try {
			await refreshData();
			toast({
				title: "Success",
				description: "Data refreshed successfully",
			});
		} catch (error) {
			console.error("Error refreshing data:", error);
			toast({
				title: "Error",
				description: "Failed to refresh data",
				variant: "destructive",
			});
		}
	};

	const handleExportData = () => {
		try {
			const data = BlogStorageService.exportData();
			const blob = new Blob([data], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `blog-data-${new Date().toISOString().split("T")[0]}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			toast({
				title: "Success",
				description: "Data exported successfully",
			});
		} catch (error) {
			console.error("Error exporting data:", error);
			toast({
				title: "Error",
				description: "Failed to export data",
				variant: "destructive",
			});
		}
	};

	const handleImportData = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json";
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = async (e) => {
					try {
						const jsonData = e.target?.result as string;
						BlogStorageService.importData(jsonData);
						await refreshData();
						toast({
							title: "Success",
							description: "Data imported successfully",
						});
					} catch (error) {
						console.error("Error importing data:", error);
						toast({
							title: "Error",
							description:
								"Failed to import data. Please check the file format.",
							variant: "destructive",
						});
					}
				};
				reader.readAsText(file);
			}
		};
		input.click();
	};

	const handleClearAllData = async () => {
		if (
			confirm(
				"Are you sure you want to clear all data? This action cannot be undone."
			)
		) {
			try {
				BlogStorageService.clearAllData();
				BlogStorageService.initializeDefaultData();
				await refreshData();
				toast({
					title: "Success",
					description: "All data cleared and reset to defaults",
				});
			} catch (error) {
				console.error("Error clearing data:", error);
				toast({
					title: "Error",
					description: "Failed to clear data",
					variant: "destructive",
				});
			}
		}
	};

	const columns = createEnhancedColumns(
		handleViewPost,
		handleEditPost,
		handleDeletePost
	);

	if (isLoading) {
		return (
			<div className="container mx-auto py-8 flex items-center justify-center">
				<div className="flex items-center gap-2">
					<RefreshCw className="h-4 w-4 animate-spin" />
					<span>Loading blog data...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8 space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
					<p className="text-muted-foreground">
						Manage your blog posts with multilingual support and localStorage
						persistence
					</p>
				</div>
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								<RefreshCw className="h-4 w-4 mr-2" />
								Data
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={handleRefreshData}>
								<RefreshCw className="h-4 w-4 mr-2" />
								Refresh Data
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleExportData}>
								<Download className="h-4 w-4 mr-2" />
								Export Data
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleImportData}>
								<Upload className="h-4 w-4 mr-2" />
								Import Data
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleClearAllData}
								className="text-destructive"
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Clear All Data
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button onClick={handleCreatePost} className="gap-2">
						<Plus className="h-4 w-4" />
						Create Post
					</Button>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Posts</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalPosts}</div>
						<p className="text-xs text-muted-foreground">
							{stats.publishedPosts} published, {stats.draftPosts} drafts
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Authors</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalAuthors}</div>
						<p className="text-xs text-muted-foreground">Active writers</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Categories</CardTitle>
						<Folder className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalCategories}</div>
						<p className="text-xs text-muted-foreground">Content categories</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Blog Posts</CardTitle>
					<CardDescription>
						Manage and organize your blog content. All data is stored locally in
						your browser.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<DataTable columns={columns} data={blogPosts} />
				</CardContent>
			</Card>

			<BlogPostFormDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onSave={handleSavePost}
				initialData={editingPost}
				mode={dialogMode}
				availableAuthors={authors}
				availableCategories={categories}
			/>
		</div>
	);
}
