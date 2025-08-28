"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown } from "lucide-react";
import type { BlogPost, BlogPostStatus } from "@/lib/types/blog";
import { DEFAULT_LANGUAGE_CODE } from "@/lib/types/languages";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const getStatusBadge = (status: BlogPostStatus) => {
	const variants: Record<BlogPostStatus, { className: string }> = {
		published: { className: "bg-green-100 text-green-800 border-green-200" },
		draft: { className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
		archived: { className: "bg-gray-100 text-gray-700 border-gray-200" },
		scheduled: { className: "bg-blue-100 text-blue-800 border-blue-200" },
	};
	const config = variants[status] || variants.draft;
	return (
		<Badge variant="outline" className={cn("capitalize", config.className)}>
			{status}
		</Badge>
	);
};

export function createEnhancedColumns(
	onView: (post: BlogPost) => void,
	onEdit: (post: BlogPost) => void,
	onDelete: (id: string) => void
): ColumnDef<BlogPost>[] {
	return [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "title",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Post <ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => {
				const post = row.original;
				return (
					<div className="flex items-center gap-3">
						<img
							src={post.coverImageUrl || "/placeholder.png"}
							alt=""
							className="w-16 h-12 object-cover rounded-md bg-muted"
						/>
						<div>
							<p className="font-semibold text-sm truncate max-w-xs">
								{post.title[DEFAULT_LANGUAGE_CODE] || "Untitled"}
							</p>
							<p className="text-xs text-muted-foreground">
								{post.category?.name[DEFAULT_LANGUAGE_CODE] || "N/A"}
							</p>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => getStatusBadge(row.original.status),
		},
		{
			accessorKey: "author",
			header: "Author",
			cell: ({ row }) => {
				const author = row.original.author;
				return author ? (
					<div className="flex items-center gap-2">
						<Avatar className="h-6 w-6">
							<AvatarImage src={author.avatar || "/placeholder.svg"} />
							<AvatarFallback>{author.name[0]}</AvatarFallback>
						</Avatar>
						<span className="text-sm truncate">{author.name}</span>
					</div>
				) : (
					<span className="text-muted-foreground text-sm">Unknown</span>
				);
			},
		},
		{
			accessorKey: "updatedAt",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Last Updated <ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => (
				<span className="text-sm text-muted-foreground">
					{formatDistanceToNow(row.original.updatedAt, { addSuffix: true })}
				</span>
			),
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const post = row.original;
				return (
					<div className="text-right">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => onEdit(post)}>
									<Eye className="mr-2 h-4 w-4" /> View Details
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => onEdit(post)}>
									<Edit className="mr-2 h-4 w-4" /> Edit Post
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive"
									onClick={() => onDelete(post.id)}
								>
									<Trash2 className="mr-2 h-4 w-4" /> Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				);
			},
		},
	];
}
