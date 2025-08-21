"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Plus,
	FolderOpen,
	Search,
	Filter,
	SortAsc,
	SortDesc,
	RefreshCw,
	AlertCircle,
	CheckCircle2,
	Loader2,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Category,
	CategoryNode as CategoryNodeType,
	LocalizedField,
} from "@/lib/types/category";
import { DEFAULT_LANGUAGE_CODE } from "@/lib/types/languages";
import { mockCategories } from "@/lib/data/category";
import { CategoryFormDialog } from "./category-form-dialog";
import { CategoryNode } from "./category-node";
import { Toast } from "@radix-ui/react-toast";

type SortOption = "name" | "created" | "updated" | "subcategories";
type SortDirection = "asc" | "desc";

interface DialogState {
	open: boolean;
	category?: Category | null;
	parentId?: string | null;
}

interface NotificationState {
	show: boolean;
	type: "success" | "error";
	message: string;
}

export function CategoryManagement() {
	// Data state
	const [categories, setCategories] = useState<Category[]>(mockCategories);
	const [isLoading, setIsLoading] = useState(false);
	const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

	// UI state
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState<SortOption>("name");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const [dialogState, setDialogState] = useState<DialogState>({ open: false });
	const [notification, setNotification] = useState<NotificationState>({
		show: false,
		type: "success",
		message: "",
	});

	// Auto-hide notifications
	useEffect(() => {
		if (notification.show) {
			const timer = setTimeout(() => {
				setNotification((prev) => ({ ...prev, show: false }));
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [notification.show]);

	// Show notification helper
	const showNotification = useCallback(
		(type: "success" | "error", message: string) => {
			setNotification({ show: true, type, message });
		},
		[]
	);

	// Memoized category tree with filtering and sorting
	const categoryTree = useMemo((): CategoryNodeType[] => {
		let filteredCategories = categories;

		// Apply search filter
		if (searchTerm.trim() !== "") {
			const lowercasedFilter = searchTerm.toLowerCase();
			const visibleIds = new Set<string>();

			// Find direct matches
			const directMatches = categories.filter(
				(cat) =>
					Object.values(cat.name).some((name) =>
						name?.toLowerCase().includes(lowercasedFilter)
					) ||
					Object.values(cat.description || {}).some((desc) =>
						desc?.toLowerCase().includes(lowercasedFilter)
					)
			);

			// Add direct matches
			directMatches.forEach((cat) => visibleIds.add(cat.id));

			// Add parent chain for each match
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

		const sortedCategories = [...filteredCategories].sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case "name":
					const nameA = a.name[DEFAULT_LANGUAGE_CODE] || "";
					const nameB = b.name[DEFAULT_LANGUAGE_CODE] || "";
					comparison = nameA.localeCompare(nameB);
					break;
				case "created":
					comparison =
						new Date(a.createdAt || 0).getTime() -
						new Date(b.createdAt || 0).getTime();
					break;
				// case "updated":
				// 	comparison =
				// 		new Date(a. || a.createdAt || 0).getTime() -
				// 		new Date(b.updatedAt || b.createdAt || 0).getTime();
				// 	break;
				case "subcategories":
					const countA = categories.filter((c) => c.parentId === a.id).length;
					const countB = categories.filter((c) => c.parentId === b.id).length;
					comparison = countA - countB;
					break;
			}

			return sortDirection === "desc" ? -comparison : comparison;
		});

		// Build tree structure
		const categoryMap: Record<string, CategoryNodeType> = {};
		const roots: CategoryNodeType[] = [];

		// Create nodes
		sortedCategories.forEach((cat) => {
			categoryMap[cat.id] = { ...cat, subCategories: [] };
		});

		// Build hierarchy
		sortedCategories.forEach((cat) => {
			if (cat.parentId && categoryMap[cat.parentId]) {
				categoryMap[cat.parentId].subCategories!.push(categoryMap[cat.id]);
			} else {
				roots.push(categoryMap[cat.id]);
			}
		});

		return roots;
	}, [categories, searchTerm, sortBy, sortDirection]);

	// Statistics
	const stats = useMemo(() => {
		const total = categories.length;
		const topLevel = categories.filter((c) => !c.parentId).length;
		const withSubcategories = categories.filter((c) =>
			categories.some((sub) => sub.parentId === c.id)
		).length;
		const active = categories.filter((c) => c.isActive !== false).length;

		return { total, topLevel, withSubcategories, active };
	}, [categories]);

	// Dialog handlers
	const handleOpenDialog = useCallback(
		(category?: Category | null, parentId?: string | null) => {
			setDialogState({ open: true, category, parentId });
		},
		[]
	);

	const handleCloseDialog = useCallback(() => {
		setDialogState({ open: false });
	}, []);

	// CRUD operations
	const handleSave = useCallback(
		async (data: Partial<Category> & { name: LocalizedField }) => {
			setIsLoading(true);

			try {
				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 1000));

				if (data.id) {
					// Update existing category
					setCategories((cats) =>
						cats.map((c) =>
							c.id === data.id ? { ...c, ...data, updatedAt: new Date() } : c
						)
					);
					showNotification("success", "Category updated successfully!");
				} else {
					// Create new category
					const newCategory: Category = {
						id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
						createdAt: new Date(),
						name: data.name,
						description: data.description,
						parentId: data.parentId,
						isActive: true,
					};
					setCategories((cats) => [...cats, newCategory]);
					showNotification("success", "Category created successfully!");
				}

				setLastUpdated(new Date());
			} catch (error) {
				showNotification("error", "Failed to save category. Please try again.");
				throw error; // Re-throw to let dialog handle it
			} finally {
				setIsLoading(false);
			}
		},
		[showNotification]
	);

	const handleDelete = useCallback(
		async (id: string) => {
			setIsLoading(true);

			try {
				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 500));

				// Find all categories to delete (including subcategories)
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

				const deletedCount = idsToDelete.size;
				setCategories((cats) => cats.filter((c) => !idsToDelete.has(c.id)));

				showNotification(
					"success",
					`Successfully deleted ${deletedCount} categor${
						deletedCount === 1 ? "y" : "ies"
					}`
				);
				setLastUpdated(new Date());
			} catch (error) {
				showNotification(
					"error",
					"Failed to delete category. Please try again."
				);
			} finally {
				setIsLoading(false);
			}
		},
		[categories, showNotification]
	);

	// Sorting handler
	const handleSort = useCallback(
		(option: SortOption) => {
			if (sortBy === option) {
				setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
			} else {
				setSortBy(option);
				setSortDirection("asc");
			}
		},
		[sortBy]
	);

	const handleRefresh = useCallback(async () => {
		setIsLoading(true);
		try {
			// Simulate API refresh
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setLastUpdated(new Date());
			showNotification("success", "Categories refreshed successfully!");
		} catch (error) {
			showNotification("error", "Failed to refresh categories.");
		} finally {
			setIsLoading(false);
		}
	}, [showNotification]);

	const parentCategories = categories.filter((c) => !c.parentId);

	return (
		<div className="space-y-6">
			{/* Notification */}
			{notification.show && (
				<Alert
					variant={notification.type === "error" ? "destructive" : "default"}
				>
					{notification.type === "success" ? (
						<CheckCircle2 className="h-4 w-4" />
					) : (
						<AlertCircle className="h-4 w-4" />
					)}
					<AlertDescription>{notification.message}</AlertDescription>
				</Alert>
			)}

			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">
						Category Management
					</h2>
					<p className="text-muted-foreground">
						Organize and manage your content structure
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handleRefresh}
						disabled={isLoading}
					>
						<RefreshCw
							className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
						/>
						Refresh
					</Button>
					<Button
						onClick={() => handleOpenDialog(null, null)}
						disabled={isLoading}
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Category
					</Button>
				</div>
			</div>

			{/* Statistics */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="text-2xl font-bold">{stats.total}</div>
						<p className="text-xs text-muted-foreground">Total Categories</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-2xl font-bold">{stats.topLevel}</div>
						<p className="text-xs text-muted-foreground">Top Level</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-2xl font-bold">{stats.withSubcategories}</div>
						<p className="text-xs text-muted-foreground">With Subcategories</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="text-2xl font-bold">{stats.active}</div>
						<p className="text-xs text-muted-foreground">Active</p>
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<Card className="rounded-xl shadow-sm border">
				<CardHeader className="flex-col sm:flex-row justify-between gap-4">
					<div className="space-y-1">
						<CardTitle className="flex items-center gap-2">
							All Categories
							{isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
						</CardTitle>
						<CardDescription>
							{searchTerm
								? `Found ${categoryTree.length} matching categories`
								: `Last updated: ${lastUpdated.toLocaleTimeString()}`}
						</CardDescription>
					</div>

					{/* Controls */}
					<div className="flex flex-col sm:flex-row gap-2">
						{/* Search */}
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search categories..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-8 w-full sm:w-64"
							/>
						</div>

						{/* Sort Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm">
									{sortDirection === "asc" ? (
										<SortAsc className="mr-2 h-4 w-4" />
									) : (
										<SortDesc className="mr-2 h-4 w-4" />
									)}
									Sort
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Sort by</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => handleSort("name")}>
									Name{" "}
									{sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleSort("created")}>
									Created{" "}
									{sortBy === "created" &&
										(sortDirection === "asc" ? "↑" : "↓")}
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleSort("updated")}>
									Updated{" "}
									{sortBy === "updated" &&
										(sortDirection === "asc" ? "↑" : "↓")}
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => handleSort("subcategories")}>
									Subcategories{" "}
									{sortBy === "subcategories" &&
										(sortDirection === "asc" ? "↑" : "↓")}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</CardHeader>

				<CardContent className="p-0">
					{categoryTree.length > 0 ? (
						<div className="border-t">
							{categoryTree.map((node) => (
								<CategoryNode
									key={node.id}
									node={node}
									onEdit={(category) => handleOpenDialog(category)}
									onDelete={handleDelete}
									onAddSubCategory={(parentId) =>
										handleOpenDialog(null, parentId)
									}
								/>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-20 text-center">
							<FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-medium mb-2">
								{searchTerm ? "No Categories Found" : "No Categories Yet"}
							</h3>
							<p className="text-muted-foreground mb-4">
								{searchTerm
									? "Try adjusting your search term or clear the filter."
									: "Get started by creating your first category to organize your content."}
							</p>
							{searchTerm ? (
								<Button variant="outline" onClick={() => setSearchTerm("")}>
									Clear Search
								</Button>
							) : (
								<Button onClick={() => handleOpenDialog(null, null)}>
									<Plus className="mr-2 h-4 w-4" />
									Create First Category
								</Button>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Form Dialog */}
			<CategoryFormDialog
				open={dialogState.open}
				onOpenChange={(open) => !open && handleCloseDialog()}
				onSave={handleSave}
				initialData={dialogState.category}
				parentId={dialogState.parentId}
				availableParents={parentCategories}
				isLoading={isLoading}
			/>
		</div>
	);
}
