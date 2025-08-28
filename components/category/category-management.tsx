"use client";

import { useState, useMemo, useCallback } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
	Plus,
	FolderOpen,
	Search,
	SortAsc,
	SortDesc,
	RefreshCw,
	CheckCircle2,
	Loader2,
	X,
	Folder,
	Languages,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
	Category,
	CategoryNode as CategoryNodeType,
	LocalizedField,
} from "@/lib/types/category";
import { DEFAULT_LANGUAGE_CODE, LanguageCode } from "@/lib/types/languages";
import { mockCategories } from "@/lib/data/category";
import { CategoryFormDialog } from "./category-form-dialog";
import { CategoryNode } from "./category-node";

const SUPPORTED_LANGUAGES = [
	{ code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
	{ code: "km", name: "Khmer", nativeName: "ខ្មែរ", flag: "🇰🇭" },
	{ code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
	{ code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
	{ code: "th", name: "Thai", nativeName: "ภาษาไทย", flag: "🇹🇭" },
];

type SortOption = "name" | "created" | "updated" | "subcategories";
type SortDirection = "asc" | "desc";

interface DialogState {
	open: boolean;
	category?: Category | null;
	parentId?: string | null;
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

	const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(
		DEFAULT_LANGUAGE_CODE
	);

	const { toast } = useToast();

	const getLocalizedText = useCallback(
		(field: LocalizedField | undefined, fallback = ""): string => {
			if (!field) return fallback;
			return field[currentLanguage] || field[DEFAULT_LANGUAGE_CODE] || fallback;
		},
		[currentLanguage]
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
					const nameA = getLocalizedText(a.name, "");
					const nameB = getLocalizedText(b.name, "");
					comparison = nameA.localeCompare(nameB);
					break;
				case "created":
					comparison =
						new Date(a.createdAt || 0).getTime() -
						new Date(b.createdAt || 0).getTime();
					break;
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
	}, [categories, searchTerm, sortBy, sortDirection, getLocalizedText]);

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
					toast({
						title: "Success",
						description: "Category updated successfully!",
					});
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
					toast({
						title: "Success",
						description: "Category created successfully!",
					});
				}

				setLastUpdated(new Date());
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to save category. Please try again.",
					variant: "destructive",
				});
				throw error; // Re-throw to let dialog handle it
			} finally {
				setIsLoading(false);
			}
		},
		[toast]
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

				toast({
					title: "Success",
					description: `Successfully deleted ${deletedCount} categor${
						deletedCount === 1 ? "y" : "ies"
					}`,
				});
				setLastUpdated(new Date());
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to delete category. Please try again.",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		},
		[categories, toast]
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
			toast({
				title: "Success",
				description: "Categories refreshed successfully!",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to refresh categories.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}, [toast]);

	const parentCategories = categories.filter((c) => !c.parentId);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">
						Category Management
					</h1>
					<p className="text-lg text-muted-foreground">
						Organize and manage your content structure with multilingual support
					</p>
				</div>
				<div className="flex items-center gap-3">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="gap-2 bg-transparent"
							>
								<Languages className="h-4 w-4" />
								<span className="hidden sm:inline">
									{
										SUPPORTED_LANGUAGES.find(
											(lang) => lang.code === currentLanguage
										)?.flag
									}{" "}
									{
										SUPPORTED_LANGUAGES.find(
											(lang) => lang.code === currentLanguage
										)?.nativeName
									}
								</span>
								<span className="sm:hidden">
									{
										SUPPORTED_LANGUAGES.find(
											(lang) => lang.code === currentLanguage
										)?.flag
									}
								</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuLabel>Display Language</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{SUPPORTED_LANGUAGES.map((language) => (
								<DropdownMenuItem
									key={language.code}
									onClick={() =>
										setCurrentLanguage(language.code as LanguageCode)
									}
									className="gap-3"
								>
									<span className="text-lg">{language.flag}</span>
									<div className="flex flex-col">
										<span className="font-medium">{language.nativeName}</span>
										<span className="text-xs text-muted-foreground">
											{language.name}
										</span>
									</div>
									{currentLanguage === language.code && (
										<CheckCircle2 className="h-4 w-4 ml-auto text-primary" />
									)}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					<Button
						variant="outline"
						size="sm"
						onClick={handleRefresh}
						disabled={isLoading}
						className="gap-2 bg-transparent"
					>
						<RefreshCw
							className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
						/>
						<span className="hidden sm:inline">Refresh</span>
					</Button>
					<Button
						onClick={() => handleOpenDialog(null, null)}
						disabled={isLoading}
						className="gap-2"
					>
						<Plus className="h-4 w-4" />
						Add Category
					</Button>
				</div>
			</div>

			{/* Statistics */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
									{stats.total}
								</div>
								<p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
									Total Categories
								</p>
							</div>
							<div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
								<Folder className="h-6 w-6 text-blue-600 dark:text-blue-400" />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<div className="text-2xl font-bold text-green-700 dark:text-green-300">
									{stats.topLevel}
								</div>
								<p className="text-sm text-green-600 dark:text-green-400 font-medium">
									Top Level
								</p>
							</div>
							<div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
								<FolderOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
									{stats.withSubcategories}
								</div>
								<p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
									With Subcategories
								</p>
							</div>
							<div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
								<Folder className="h-6 w-6 text-purple-600 dark:text-purple-400" />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/30">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
									{stats.active}
								</div>
								<p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
									Active
								</p>
							</div>
							<div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
								<CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content */}
			<Card className="rounded-xl shadow-sm border-0 bg-card">
				<CardHeader className="border-b border-border/50 bg-muted/30">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="space-y-1">
							<CardTitle className="flex items-center gap-3 text-xl">
								<div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
									<FolderOpen className="h-4 w-4 text-primary" />
								</div>
								All Categories
								{isLoading && (
									<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
								)}
							</CardTitle>
							<CardDescription className="text-base">
								{searchTerm
									? `Found ${categoryTree.length} matching categories`
									: `Last updated: ${lastUpdated.toLocaleTimeString()}`}
							</CardDescription>
						</div>

						{/* Controls */}
						<div className="flex flex-col sm:flex-row gap-3">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search categories..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10 w-full sm:w-64 h-10"
								/>
							</div>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="gap-2 h-10 bg-transparent"
									>
										{sortDirection === "asc" ? (
											<SortAsc className="h-4 w-4" />
										) : (
											<SortDesc className="h-4 w-4" />
										)}
										<span className="hidden sm:inline">Sort</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48">
									<DropdownMenuLabel>Sort by</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => handleSort("name")}
										className="gap-2"
									>
										<span>Name</span>
										{sortBy === "name" && (
											<span className="ml-auto">
												{sortDirection === "asc" ? "↑" : "↓"}
											</span>
										)}
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleSort("created")}
										className="gap-2"
									>
										<span>Created</span>
										{sortBy === "created" && (
											<span className="ml-auto">
												{sortDirection === "asc" ? "↑" : "↓"}
											</span>
										)}
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleSort("subcategories")}
										className="gap-2"
									>
										<span>Subcategories</span>
										{sortBy === "subcategories" && (
											<span className="ml-auto">
												{sortDirection === "asc" ? "↑" : "↓"}
											</span>
										)}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</CardHeader>

				<CardContent className="p-0">
					{categoryTree.length > 0 ? (
						<div className="divide-y divide-border/50">
							{categoryTree.map((node, index) => (
								<div
									key={node.id}
									className={cn(
										"hover:bg-muted/30 transition-colors",
										index === 0 && "border-t-0"
									)}
								>
									<CategoryNode
										node={node}
										onEdit={(category) => handleOpenDialog(category)}
										onDelete={handleDelete}
										onAddSubCategory={(parentId) =>
											handleOpenDialog(null, parentId)
										}
										currentLanguage={currentLanguage}
									/>
								</div>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-20 text-center">
							<div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
								<FolderOpen className="h-10 w-10 text-muted-foreground" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								{searchTerm ? "No Categories Found" : "No Categories Yet"}
							</h3>
							<p className="text-muted-foreground mb-6 max-w-md">
								{searchTerm
									? "Try adjusting your search term or clear the filter to see all categories."
									: "Get started by creating your first category to organize your content structure."}
							</p>
							{searchTerm ? (
								<Button
									variant="outline"
									onClick={() => setSearchTerm("")}
									className="gap-2"
								>
									<X className="h-4 w-4" />
									Clear Search
								</Button>
							) : (
								<Button
									onClick={() => handleOpenDialog(null, null)}
									className="gap-2"
								>
									<Plus className="h-4 w-4" />
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
