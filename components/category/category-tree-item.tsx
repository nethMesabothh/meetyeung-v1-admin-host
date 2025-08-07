"use client";

import { Category } from "@/lib/types/category";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, PlusCircle } from "lucide-react";

interface CategoryTreeItemProps {
	category: Category;
	onEdit: (category: Category) => void;
	onDelete: (id: string) => void;
	onAddSubCategory?: (parentId: string) => void;
}

export function CategoryTreeItem({
	category,
	onEdit,
	onDelete,
	onAddSubCategory,
}: CategoryTreeItemProps) {
	// Check if this item can be a parent (i.e., it doesn't have a parentId itself)
	const canBeParent = !category.parentId;

	return (
		<div className="group flex w-full items-center">
			{/* Main content */}
			<div className="flex-1 min-w-0">
				<p className="font-medium truncate">{category.name}</p>
				{category.description && (
					<p className="text-sm text-muted-foreground truncate">
						{category.description}
					</p>
				)}
			</div>
			{/* Hover actions */}
			<div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
				{canBeParent && (
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						title="Add sub-category"
						onClick={() => onAddSubCategory?.(category.id)}
					>
						<PlusCircle className="h-4 w-4 text-muted-foreground" />
					</Button>
				)}
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					title="Edit category"
					onClick={() => onEdit(category)}
				>
					<Edit className="h-4 w-4 text-muted-foreground" />
				</Button>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-destructive/80 hover:text-destructive"
							title="Delete category"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent className="rounded-xl">
						<AlertDialogHeader>
							<AlertDialogTitle>
								Delete Category: {category.name}
							</AlertDialogTitle>
							<AlertDialogDescription>
								This will also delete all its sub-categories. This action is
								permanent and cannot be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => onDelete(category.id)}
								className="bg-destructive hover:bg-destructive/90"
							>
								Delete Permanently
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
