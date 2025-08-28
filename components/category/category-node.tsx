"use client";

import { useState, useCallback, memo } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, Folder, FolderOpen } from "lucide-react";
import type { CategoryNode as CategoryNodeType } from "@/lib/types/category";
import { CategoryTreeItem } from "./category-tree-item";
import { cn } from "@/lib/utils";
import { Language, LanguageCode } from "@/lib/types/languages";

interface CategoryNodeProps {
	node: CategoryNodeType;
	level?: number;
	onEdit: (category: CategoryNodeType) => void;
	onDelete: (id: string) => void;
	onAddSubCategory: (parentId: string) => void;
	className?: string;
	currentLanguage: LanguageCode;
}

export const CategoryNode = memo<CategoryNodeProps>(
	({
		node,
		level = 0,
		onEdit,
		onDelete,
		onAddSubCategory,
		className,
		currentLanguage,
	}) => {
		const [isOpen, setIsOpen] = useState(false);
		const hasChildren = node.subCategories && node.subCategories.length > 0;

		// Memoized handlers to prevent unnecessary re-renders
		const handleToggle = useCallback(() => {
			if (hasChildren) {
				setIsOpen((prev) => !prev);
			}
		}, [hasChildren]);

		const handleEdit = useCallback(() => {
			onEdit(node);
		}, [onEdit, node]);

		const handleDelete = useCallback(() => {
			onDelete(node.id);
		}, [onDelete, node.id]);

		const handleAddSubCategory = useCallback(() => {
			onAddSubCategory(node.id);
		}, [onAddSubCategory, node.id]);

		// Calculate indentation based on nesting level
		const indentationStyle = {
			paddingLeft: `${level * 1.5}rem`,
		};

		return (
			<div className={cn("relative", className)}>
				<Collapsible open={isOpen} onOpenChange={setIsOpen}>
					<div
						className="group relative flex items-center hover:bg-muted/40 transition-all duration-200 rounded-lg mx-2 my-1"
						style={indentationStyle}
					>
						<CollapsibleTrigger asChild>
							<button
								className={cn(
									"flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200",
									"hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
									!hasChildren && "invisible"
								)}
								onClick={handleToggle}
								disabled={!hasChildren}
								aria-label={`${isOpen ? "Collapse" : "Expand"} ${node.name}`}
								aria-expanded={hasChildren ? isOpen : undefined}
							>
								<ChevronRight
									className={cn(
										"h-4 w-4 text-muted-foreground transition-transform duration-200",
										isOpen && "rotate-90"
									)}
								/>
							</button>
						</CollapsibleTrigger>

						<div className="flex items-center justify-center w-8 h-8 ml-1 mr-3">
							{hasChildren ? (
								isOpen ? (
									<div className="h-6 w-6 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
										<FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
									</div>
								) : (
									<div className="h-6 w-6 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
										<Folder className="h-4 w-4 text-blue-600 dark:text-blue-400" />
									</div>
								)
							) : (
								<div className="h-6 w-6 rounded-md bg-muted/50 flex items-center justify-center">
									<div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
								</div>
							)}
						</div>

						<div className="flex-1 min-w-0 py-3">
							<CategoryTreeItem
								category={node}
								onEdit={handleEdit}
								onDelete={handleDelete}
								onAddSubCategory={handleAddSubCategory}
								level={level}
								currentLanguage={currentLanguage}
							/>
						</div>
					</div>

					{hasChildren && (
						<CollapsibleContent className="relative">
							<div
								className="absolute top-0 bottom-0 w-px bg-border/60"
								style={{ left: `${level * 1.5 + 1}rem` }}
							/>

							<div className="space-y-0 pt-1">
								{node.subCategories?.map((subNode, index) => (
									<CategoryNode
										key={subNode.id}
										node={subNode}
										level={level + 1}
										onEdit={onEdit}
										onDelete={onDelete}
										onAddSubCategory={onAddSubCategory}
										className={cn(
											index === node.subCategories!.length - 1 && "pb-2"
										)}
										currentLanguage={currentLanguage}
									/>
								))}
							</div>
						</CollapsibleContent>
					)}
				</Collapsible>
			</div>
		);
	}
);

CategoryNode.displayName = "CategoryNode";
