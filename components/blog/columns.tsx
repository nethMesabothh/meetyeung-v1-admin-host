"use client";

import { ColumnDef, CellContext } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	MoreHorizontal,
	ArrowUpDown,
	FileText,
	CheckCircle2,
	XCircle,
	Star,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { BlogPost } from "@/lib/types/blog";

const stripHtml = (html: string) => {
	if (typeof window === "undefined") return html.replace(/<[^>]*>?/gm, "");
	return (
		new DOMParser().parseFromString(html, "text/html").body.textContent || ""
	);
};

export const createColumns = (
	onView: (post: BlogPost) => void,
	onDelete: (id: string) => void
): ColumnDef<BlogPost>[] => [
	{
		accessorKey: "title",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Title
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }: CellContext<BlogPost, unknown>) => {
			const post = row.original;
			return (
				<div className="flex items-center space-x-4">
					{post.coverImage?.url ? (
						<img
							src={post.coverImage.url}
							alt={post.title}
							className="w-16 h-10 rounded-md object-cover bg-muted"
						/>
					) : (
						<div className="w-16 h-10 rounded-md bg-muted flex-shrink-0 flex items-center justify-center text-muted-foreground">
							<FileText className="h-5 w-5" />
						</div>
					)}
					<div className="min-w-0">
						<div className="font-bold truncate">{post.title}</div>
						<div className="text-sm text-muted-foreground truncate">
							{stripHtml(post.content).substring(0, 40)}...
						</div>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }: CellContext<BlogPost, unknown>) => {
			const { isFeatured, publishedAt } = row.original;
			const isPublished = !!publishedAt;
			return (
				<div className="flex flex-col gap-1.5 items-start">
					<Badge
						variant={isPublished ? "default" : "secondary"}
						className="rounded-md capitalize"
					>
						{isPublished ? (
							<CheckCircle2 className="mr-1.5 h-3 w-3" />
						) : (
							<XCircle className="mr-1.5 h-3 w-3" />
						)}
						{isPublished ? "Published" : "Draft"}
					</Badge>
					{isFeatured && (
						<Badge
							variant="outline"
							className="rounded-md border-amber-500 text-amber-600"
						>
							<Star className="mr-1.5 h-3 w-3" />
							Featured
						</Badge>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "category",
		header: "Category",
		cell: ({ row }: CellContext<BlogPost, unknown>) => (
			<Badge variant="outline" className="rounded-md">
				{row.original.category?.name || "Uncategorized"}
			</Badge>
		),
	},
	{
		accessorKey: "publishedAt",
		header: "Published On",
		cell: ({ row }: CellContext<BlogPost, unknown>) =>
			row.original.publishedAt ? (
				format(new Date(row.original.publishedAt), "MMM d, yyyy")
			) : (
				<span className="text-muted-foreground">—</span>
			),
	},
	{
		id: "actions",
		cell: ({ row }: CellContext<BlogPost, unknown>) => {
			const post = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => onView(post)}>
							View Details
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href={`/dashboard/blog/edit/${post.id}`}>Edit Post</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive focus:text-destructive focus:bg-destructive/10"
							onClick={() => onDelete(post.id)}
						>
							Delete Post
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
