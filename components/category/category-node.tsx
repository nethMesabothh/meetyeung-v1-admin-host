"use client";

import React, { useState, useCallback, memo } from "react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight, Folder, FolderOpen } from "lucide-react";
import { CategoryNode as CategoryNodeType } from "@/lib/types/category";
import { CategoryTreeItem } from "./category-tree-item";
import { cn } from "@/lib/utils";

interface CategoryNodeProps {
	node: CategoryNodeType;
	level?: number;
	onEdit: (category: CategoryNodeType) => void;
	onDelete: (id: string) => void;
	onAddSubCategory: (parentId: string) => void;
	className?: string;
}

export const CategoryNode = memo<CategoryNodeProps>(
	({ node, level = 0, onEdit, onDelete, onAddSubCategory, className }) => {
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
						className="group relative flex items-center hover:bg-muted/50 transition-all duration-200 rounded-md"
						style={indentationStyle}
					>
						{/* Collapsible Trigger */}
						<CollapsibleTrigger asChild>
							<button
								className={cn(
									"flex items-center justify-center w-6 h-6 rounded-sm transition-all duration-200",
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

						{/* Folder Icon */}
						<div className="flex items-center justify-center w-6 h-6 ml-1 mr-2">
							{hasChildren ? (
								isOpen ? (
									<FolderOpen className="h-4 w-4 text-blue-500" />
								) : (
									<Folder className="h-4 w-4 text-blue-600" />
								)
							) : (
								<div className="h-4 w-4 rounded-sm bg-muted-foreground/20" />
							)}
						</div>

						{/* Category Content */}
						<div className="flex-1 min-w-0 py-2">
							<CategoryTreeItem
								category={node}
								onEdit={handleEdit}
								onDelete={handleDelete}
								onAddSubCategory={handleAddSubCategory}
							/>
						</div>
					</div>

					{/* Collapsible Content */}
					{hasChildren && (
						<CollapsibleContent className="relative">
							{/* Connection Line */}
							<div
								className="absolute left-3 top-0 bottom-0 w-px bg-border"
								style={{ left: `${level * 1.5 + 0.75}rem` }}
							/>

							<div className="space-y-1 pt-1">
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
