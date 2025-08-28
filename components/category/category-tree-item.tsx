"use client";

import { useState, useCallback, memo } from "react";
import type { CategoryNode } from "@/lib/types/category";
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
import { DEFAULT_LANGUAGE_CODE, LanguageCode } from "@/lib/types/languages";
import { Badge } from "@/components/ui/badge";

interface CategoryTreeItemProps {
	category: CategoryNode;
	onEdit: (category: CategoryNode) => void;
	onDelete: (id: string) => void;
	onAddSubCategory?: (parentId: string) => void;
	onToggleVisibility?: (id: string) => void;
	onDuplicate?: (category: CategoryNode) => void;
	level?: number;
	currentLanguage: LanguageCode;
}

export const CategoryTreeItem = memo<CategoryTreeItemProps>(
	({
		category,
		onEdit,
		onDelete,
		onAddSubCategory,
		onToggleVisibility,
		onDuplicate,
		level = 0,
		currentLanguage,
	}) => {
		const [showDeleteDialog, setShowDeleteDialog] = useState(false);
		const [isLoading, setIsLoading] = useState(false);

		const displayName =
			category.name[currentLanguage] ||
			category.name[DEFAULT_LANGUAGE_CODE] ||
			`Category #${category.id}`;
		const displayDescription =
			category.description?.[currentLanguage] ||
			category.description?.[DEFAULT_LANGUAGE_CODE] ||
			"";

		// Count subcategories recursively
		const subcategoryCount = category.subCategories?.length || 0;
		const totalDescendants =
			category.subCategories?.reduce(
				(count, sub) => count + 1 + (sub.subCategories?.length || 0),
				0
			) || 0;

		const canAddSubCategory = level < 1; // Only allow subcategories for top-level categories

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
			if (canAddSubCategory) {
				onAddSubCategory?.(category.id);
			}
		}, [onAddSubCategory, category.id, canAddSubCategory]);

		const handleToggleVisibility = useCallback(() => {
			onToggleVisibility?.(category.id);
		}, [onToggleVisibility, category.id]);

		const handleDuplicate = useCallback(() => {
			onDuplicate?.(category);
		}, [onDuplicate, category]);

		return (
			<>
				<div className="group flex w-full items-center gap-4 min-h-[3rem]">
					<div className="flex-1 min-w-0 space-y-1">
						<div className="flex items-center gap-3">
							<h4 className="font-semibold text-base truncate leading-tight text-foreground">
								{displayName}
							</h4>

							<div className="flex items-center gap-2">
								{subcategoryCount > 0 && (
									<Badge
										variant="secondary"
										className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
									>
										{subcategoryCount} sub
									</Badge>
								)}
								{category.isActive === false && (
									<Badge
										variant="outline"
										className="text-xs px-2 py-1 text-muted-foreground border-muted-foreground/30"
									>
										Hidden
									</Badge>
								)}
								{level > 0 && (
									<Badge
										variant="outline"
										className="text-xs px-2 py-1 text-muted-foreground"
									>
										Level {level + 1}
									</Badge>
								)}
							</div>
						</div>

						{displayDescription && (
							<p className="text-sm text-muted-foreground truncate leading-tight max-w-md">
								{displayDescription}
							</p>
						)}
					</div>

					<div className="flex items-center opacity-0 group-hover:opacity-100 transition-all duration-200">
						<div className="flex items-center gap-1 mr-2">
							{canAddSubCategory && (
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
									title="Add subcategory"
									onClick={handleAddSubCategory}
								>
									<PlusCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
								</Button>
							)}

							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/30"
								title="Edit category"
								onClick={handleEdit}
							>
								<Edit className="h-4 w-4 text-green-600 dark:text-green-400" />
							</Button>
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0 hover:bg-muted"
									title="More actions"
								>
									<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-52">
								<DropdownMenuItem onClick={handleEdit} className="gap-3">
									<Edit className="h-4 w-4" />
									Edit Category
								</DropdownMenuItem>

								{canAddSubCategory && (
									<DropdownMenuItem
										onClick={handleAddSubCategory}
										className="gap-3"
									>
										<PlusCircle className="h-4 w-4" />
										Add Subcategory
									</DropdownMenuItem>
								)}

								{!canAddSubCategory && (
									<DropdownMenuItem disabled className="gap-3 opacity-50">
										<PlusCircle className="h-4 w-4" />
										<div className="flex flex-col">
											<span>Add Subcategory</span>
											<span className="text-xs text-muted-foreground">
												Max depth reached
											</span>
										</div>
									</DropdownMenuItem>
								)}

								{onDuplicate && (
									<DropdownMenuItem onClick={handleDuplicate} className="gap-3">
										<Copy className="h-4 w-4" />
										Duplicate
									</DropdownMenuItem>
								)}

								{onToggleVisibility && (
									<DropdownMenuItem
										onClick={handleToggleVisibility}
										className="gap-3"
									>
										{category.isActive === false ? (
											<>
												<Eye className="h-4 w-4" />
												Show Category
											</>
										) : (
											<>
												<EyeOff className="h-4 w-4" />
												Hide Category
											</>
										)}
									</DropdownMenuItem>
								)}

								<DropdownMenuSeparator />

								<DropdownMenuItem
									onClick={() => setShowDeleteDialog(true)}
									className="text-destructive focus:text-destructive gap-3"
								>
									<Trash2 className="h-4 w-4" />
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
