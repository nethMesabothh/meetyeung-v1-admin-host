"use client";

import React, { useState, useCallback, memo } from "react";
import { Category, CategoryNode } from "@/lib/types/category";
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
} from "@/components/ui/alert-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Edit,
	Trash2,
	PlusCircle,
	MoreHorizontal,
	Copy,
	Eye,
	EyeOff,
} from "lucide-react";
import { DEFAULT_LANGUAGE_CODE } from "@/lib/types/languages";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CategoryTreeItemProps {
	category: CategoryNode;
	onEdit: (category: CategoryNode) => void;
	onDelete: (id: string) => void;
	onAddSubCategory?: (parentId: string) => void;
	onToggleVisibility?: (id: string) => void;
	onDuplicate?: (category: CategoryNode) => void;
}

export const CategoryTreeItem = memo<CategoryTreeItemProps>(
	({
		category,
		onEdit,
		onDelete,
		onAddSubCategory,
		onToggleVisibility,
		onDuplicate,
	}) => {
		const [showDeleteDialog, setShowDeleteDialog] = useState(false);
		const [isLoading, setIsLoading] = useState(false);

		const displayName =
			category.name[DEFAULT_LANGUAGE_CODE] || `Category #${category.id}`;
		const displayDescription =
			category.description?.[DEFAULT_LANGUAGE_CODE] || "";

		// Count subcategories recursively
		const subcategoryCount = category.subCategories?.length || 0;
		const totalDescendants =
			category.subCategories?.reduce(
				(count, sub) => count + 1 + (sub.subCategories?.length || 0),
				0
			) || 0;

		// Memoized handlers
		const handleEdit = useCallback(() => {
			onEdit(category);
		}, [onEdit, category]);

		const handleDelete = useCallback(async () => {
			setIsLoading(true);
			try {
				await onDelete(category.id);
			} finally {
				setIsLoading(false);
				setShowDeleteDialog(false);
			}
		}, [onDelete, category.id]);

		const handleAddSubCategory = useCallback(() => {
			onAddSubCategory?.(category.id);
		}, [onAddSubCategory, category.id]);

		const handleToggleVisibility = useCallback(() => {
			onToggleVisibility?.(category.id);
		}, [onToggleVisibility, category.id]);

		const handleDuplicate = useCallback(() => {
			onDuplicate?.(category);
		}, [onDuplicate, category]);

		return (
			<>
				<div className="group flex w-full items-center gap-3 min-h-[2.5rem]">
					{/* Main Content */}
					<div className="flex-1 min-w-0 space-y-1">
						<div className="flex items-center gap-2">
							<h4 className="font-medium text-sm truncate leading-tight">
								{displayName}
							</h4>

							{/* Status Badges */}
							<div className="flex items-center gap-1">
								{subcategoryCount > 0 && (
									<Badge variant="secondary" className="text-xs px-1.5 py-0.5">
										{subcategoryCount} sub
									</Badge>
								)}
								{category.isActive === false && (
									<Badge
										variant="outline"
										className="text-xs px-1.5 py-0.5 text-muted-foreground"
									>
										Hidden
									</Badge>
								)}
							</div>
						</div>

						{displayDescription && (
							<p className="text-xs text-muted-foreground truncate leading-tight">
								{displayDescription}
							</p>
						)}
					</div>

					{/* Action Buttons */}
					<div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						{/* Quick Actions */}
						<div className="flex items-center mr-1">
							<Button
								variant="ghost"
								size="sm"
								className="h-7 w-7 p-0"
								title="Add subcategory"
								onClick={handleAddSubCategory}
							>
								<PlusCircle className="h-3.5 w-3.5 text-muted-foreground" />
							</Button>

							<Button
								variant="ghost"
								size="sm"
								className="h-7 w-7 p-0"
								title="Edit category"
								onClick={handleEdit}
							>
								<Edit className="h-3.5 w-3.5 text-muted-foreground" />
							</Button>
						</div>

						{/* More Actions Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-7 w-7 p-0"
									title="More actions"
								>
									<MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem onClick={handleEdit}>
									<Edit className="h-4 w-4 mr-2" />
									Edit Category
								</DropdownMenuItem>

								<DropdownMenuItem onClick={handleAddSubCategory}>
									<PlusCircle className="h-4 w-4 mr-2" />
									Add Subcategory
								</DropdownMenuItem>

								{onDuplicate && (
									<DropdownMenuItem onClick={handleDuplicate}>
										<Copy className="h-4 w-4 mr-2" />
										Duplicate
									</DropdownMenuItem>
								)}

								{onToggleVisibility && (
									<DropdownMenuItem onClick={handleToggleVisibility}>
										{category.isActive === false ? (
											<>
												<Eye className="h-4 w-4 mr-2" />
												Show Category
											</>
										) : (
											<>
												<EyeOff className="h-4 w-4 mr-2" />
												Hide Category
											</>
										)}
									</DropdownMenuItem>
								)}

								<DropdownMenuSeparator />

								<DropdownMenuItem
									onClick={() => setShowDeleteDialog(true)}
									className="text-destructive focus:text-destructive"
								>
									<Trash2 className="h-4 w-4 mr-2" />
									Delete Category
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Delete Confirmation Dialog */}
				<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
					<AlertDialogContent className="rounded-xl max-w-md">
						<AlertDialogHeader>
							<AlertDialogTitle className="flex items-center gap-2">
								<Trash2 className="h-5 w-5 text-destructive" />
								Delete "{displayName}"?
							</AlertDialogTitle>
							<AlertDialogDescription className="space-y-2">
								<p>
									This action cannot be undone. This will permanently delete:
								</p>
								<ul className="list-disc list-inside space-y-1 text-sm">
									<li>The category "{displayName}"</li>
									{subcategoryCount > 0 && (
										<li>{subcategoryCount} direct subcategories</li>
									)}
									{totalDescendants > subcategoryCount && (
										<li>
											{totalDescendants - subcategoryCount} nested subcategories
										</li>
									)}
								</ul>
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDelete}
								disabled={isLoading}
								className="bg-destructive hover:bg-destructive/90"
							>
								{isLoading ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
										Deleting...
									</>
								) : (
									"Delete Permanently"
								)}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</>
		);
	}
);

CategoryTreeItem.displayName = "CategoryTreeItem";
