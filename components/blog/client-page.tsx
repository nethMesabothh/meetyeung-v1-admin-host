"use client";

import { useState, useMemo } from "react";
import {
	SortingState,
	ColumnFiltersState,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Eye } from "lucide-react";
import Link from "next/link";
import { DataTable } from "./data-table";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BlogPost } from "@/lib/types/blog";
import { mockBlogPosts } from "@/lib/data/blog-post";
import { createColumns } from "./columns";
import { Button } from "../ui/button";
import { BlogPostDetailSheet } from "./blog-post-detail-sheet";

export function ClientPage() {
	const [allPosts, setAllPosts] = useState<BlogPost[]>(mockBlogPosts);

	const [viewingPost, setViewingPost] = useState<BlogPost | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const postToDelete = deletingId
		? allPosts.find((p) => p.id === deletingId)
		: null;

	const columns = useMemo(
		() =>
			createColumns(
				(post) => setViewingPost(post),
				(id) => setDeletingId(id)
			),
		[]
	);

	const table = useReactTable({
		data: allPosts,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: { sorting, columnFilters },
	});

	const totalReads = useMemo(
		() => allPosts.reduce((acc, post) => acc + post.readCounts, 0),
		[allPosts]
	);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Blog Management</h2>
					<p className="text-muted-foreground">
						The central hub for all your content.
					</p>
				</div>
				<Button asChild>
					<Link href="/dashboard/blog/edit/new">
						<Plus className="mr-2 h-4 w-4" />
						New Post
					</Link>
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Posts</CardTitle>
						<BookOpen className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{allPosts.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Views</CardTitle>
						<Eye className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{totalReads.toLocaleString()}
						</div>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="all">
				<TabsList>
					<TabsTrigger value="all">All Posts</TabsTrigger>
					<TabsTrigger value="published">Published</TabsTrigger>
					<TabsTrigger value="drafts">Drafts</TabsTrigger>
				</TabsList>
				<TabsContent value="all">
					<Card className="rounded-xl shadow-sm border">
						<CardHeader>
							<CardTitle>All Content</CardTitle>
							<CardDescription>A complete list of every post.</CardDescription>
						</CardHeader>
						<CardContent>
							<DataTableToolbar table={table} />
							<DataTable data={allPosts} columns={columns} table={table} />
							<DataTablePagination table={table} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<BlogPostDetailSheet
				post={viewingPost}
				open={!!viewingPost}
				onOpenChange={() => setViewingPost(null)}
			/>

			<AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action will permanently delete the post titled
							<span className="font-bold"> "{postToDelete?.title}"</span>.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() =>
								setAllPosts(allPosts.filter((p) => p.id !== deletingId!))
							}
							className="bg-destructive hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
