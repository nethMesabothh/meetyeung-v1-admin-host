"use client";

import { useState, useMemo } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus, FolderOpen, ChevronRight, Search } from "lucide-react";
import { Category, CategoryNode } from "@/lib/types/category";
import { mockCategories } from "@/lib/data/category";
import { CategoryFormDialog } from "./category-form-dialog";
import { CategoryTreeItem } from "./category-tree-item";

export function CategoryManagement() {
	const [categories, setCategories] = useState<Category[]>(mockCategories);
	const [searchTerm, setSearchTerm] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [explicitParentId, setExplicitParentId] = useState<string | null>(null);

	const categoryTree = useMemo((): CategoryNode[] => {
		let filteredCategories = categories;

		// --- Advanced Filtering Logic ---
		if (searchTerm.trim() !== "") {
			const lowercasedFilter = searchTerm.toLowerCase();
			const visibleIds = new Set<string>();

			// First, find all direct matches
			const directMatches = categories.filter((cat) =>
				cat.name.toLowerCase().includes(lowercasedFilter)
			);
			directMatches.forEach((cat) => visibleIds.add(cat.id));

			// Then, for each match, ensure its parents are also visible
			const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));
			directMatches.forEach((cat) => {
				let current = cat;
				while (current.parentId) {
					const parent = categoryMap.get(current.parentId);
					if (parent) {
						visibleIds.add(parent.id);
						current = parent;
					} else {
						break;
					}
				}
			});
			filteredCategories = categories.filter((cat) => visibleIds.has(cat.id));
		}

		// --- Tree Building Logic (from filtered list) ---
		const categoryMap: Record<string, CategoryNode> = {};
		const roots: CategoryNode[] = [];
		filteredCategories.forEach((cat) => {
			categoryMap[cat.id] = { ...cat, subCategories: [] };
		});
		filteredCategories.forEach((cat) => {
			if (cat.parentId && categoryMap[cat.parentId]) {
				categoryMap[cat.parentId].subCategories.push(categoryMap[cat.id]);
			} else {
				roots.push(categoryMap[cat.id]);
			}
		});
		return roots;
	}, [categories, searchTerm]);

	const handleOpenDialog = (
		category?: Category | null,
		parentId?: string | null
	) => {
		setEditingCategory(category || null);
		setExplicitParentId(parentId || null);
		setIsDialogOpen(true);
	};

	const handleSave = (data: Partial<Category>) => {
		if (data.id) {
			// Editing
			setCategories((cats) =>
				cats.map((c) =>
					c.id === data.id ? { ...c, ...data, updatedAt: new Date() } : c
				)
			);
		} else {
			const newCategory: Category = {
				id: `cat_${Date.now()}`,
				createdAt: new Date(),
				name: data.name || "",
				description: data.description,
				parentId: data.parentId,
			};
			setCategories((cats) => [...cats, newCategory]);
		}
	};

	const handleDelete = (id: string) => {
		const idsToDelete = new Set<string>([id]);
		const findChildren = (parentId: string) => {
			categories.forEach((cat) => {
				if (cat.parentId === parentId) {
					idsToDelete.add(cat.id);
					findChildren(cat.id);
				}
			});
		};
		findChildren(id);
		setCategories((cats) => cats.filter((c) => !idsToDelete.has(c.id)));
	};

	const parentCategories = categories.filter((c) => !c.parentId);

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">
						Category Management
					</h2>
					<p className="text-muted-foreground">
						A complete overview of your content structure.
					</p>
				</div>
				<Button onClick={() => handleOpenDialog(null, null)}>
					<Plus className="mr-2 h-4 w-4" />
					Add Category
				</Button>
			</div>

			<Card className="rounded-xl shadow-sm border">
				<CardHeader className="flex-col sm:flex-row justify-between gap-2">
					<div>
						<CardTitle>All Categories</CardTitle>
						<CardDescription>
							{searchTerm
								? `Found ${categoryTree.length} matching categories.`
								: `Total of ${categories.length} categories.`}
						</CardDescription>
					</div>
					<div className="relative w-full sm:w-64">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search categories..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-8"
						/>
					</div>
				</CardHeader>
				<CardContent>
					{categoryTree.length > 0 ? (
						<div className="border-t">
							{categoryTree.map((node) => (
								<Collapsible key={node.id} defaultOpen className="border-b">
									<div className="flex items-center hover:bg-muted/50 transition-colors">
										<CollapsibleTrigger
											asChild
											disabled={node.subCategories.length === 0}
										>
											<div className="flex items-center p-2 cursor-pointer">
												<ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-90" />
											</div>
										</CollapsibleTrigger>
										<div className="flex-1 p-2">
											<CategoryTreeItem
												category={node}
												onEdit={handleOpenDialog}
												onDelete={handleDelete}
												onAddSubCategory={(parentId) =>
													handleOpenDialog(null, parentId)
												}
											/>
										</div>
									</div>
									<CollapsibleContent className="pl-4 relative">
										{/* Vertical Tree Line */}
										<div className="absolute left-[17px] top-0 h-full w-px bg-muted-foreground/20"></div>
										{node.subCategories.length > 0 ? (
											<div className="py-2 space-y-2">
												{node.subCategories.map((subNode, index) => (
													<div
														key={subNode.id}
														className="flex items-start relative pl-8"
													>
														{/* Horizontal Tree Line */}
														<div className="absolute left-[17px] top-5 h-px w-4 bg-muted-foreground/20"></div>
														{/* The actual item */}
														<div className="flex-1 rounded-md p-2 hover:bg-muted/50 transition-colors">
															<CategoryTreeItem
																category={subNode}
																onEdit={handleOpenDialog}
																onDelete={handleDelete}
															/>
														</div>
													</div>
												))}
											</div>
										) : (
											<p className="py-4 pl-8 text-sm text-muted-foreground">
												No sub-categories yet.
											</p>
										)}
									</CollapsibleContent>
								</Collapsible>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-20 text-center">
							<FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-medium mb-2">No Categories Found</h3>
							<p className="text-muted-foreground">
								{searchTerm
									? "Try adjusting your search term."
									: "Click 'Add Category' to get started."}
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			<CategoryFormDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				onSave={handleSave}
				initialData={editingCategory}
				parentId={explicitParentId}
				availableParents={parentCategories}
			/>
		</div>
	);
}
