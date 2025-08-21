"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Info } from "lucide-react";
import { Category, LocalizedField } from "@/lib/types/category";
import { DEFAULT_LANGUAGE_CODE } from "@/lib/types/languages";
import { MultilingualInput } from "@/components/common/multilingual-input";

interface CategoryFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (
		categoryData: Partial<Category> & { name: LocalizedField }
	) => Promise<void> | void;
	initialData?: Category | null;
	parentId?: string | null;
	availableParents: Category[];
	isLoading?: boolean;
}

export function CategoryFormDialog({
	open,
	onOpenChange,
	onSave,
	initialData,
	parentId,
	availableParents,
	isLoading = false,
}: CategoryFormDialogProps) {
	// Form state
	const [name, setName] = useState<LocalizedField>({});
	const [description, setDescription] = useState<LocalizedField>({});
	const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

	// UI state
	const [isSaving, setIsSaving] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	// Memoized values
	const isEditMode = Boolean(initialData);
	const dialogTitle = isEditMode ? "Edit Category" : "Add New Category";
	const saveButtonText = isEditMode ? "Update Category" : "Create Category";

	// Validation
	const validationErrors = useMemo(() => {
		const errors: Record<string, string> = {};

		if (!name[DEFAULT_LANGUAGE_CODE]?.trim()) {
			errors.name = "Category name is required";
		}

		if (name[DEFAULT_LANGUAGE_CODE]?.trim().length > 100) {
			errors.name = "Category name must be less than 100 characters";
		}

		// Check for duplicate names (excluding current category)
		const existingNames = availableParents
			.filter((cat) => cat.id !== initialData?.id)
			.map((cat) => cat.name[DEFAULT_LANGUAGE_CODE]?.toLowerCase().trim())
			.filter(Boolean);

		if (
			name[DEFAULT_LANGUAGE_CODE] &&
			existingNames.includes(name[DEFAULT_LANGUAGE_CODE].toLowerCase().trim())
		) {
			errors.name = "A category with this name already exists";
		}

		return errors;
	}, [name, availableParents, initialData?.id]);

	const isSaveDisabled =
		Object.keys(validationErrors).length > 0 || isSaving || isLoading;

	// Reset form when dialog opens/closes
	useEffect(() => {
		if (open) {
			if (initialData) {
				setName(initialData.name || {});
				setDescription(initialData.description || {});
				setSelectedParentId(initialData.parentId || null);
			} else {
				setName({});
				setDescription({});
				setSelectedParentId(parentId || null);
			}
			setErrors({});
			setHasUnsavedChanges(false);
		}
	}, [open, initialData, parentId]);

	// Track unsaved changes
	useEffect(() => {
		if (!open) return;

		const hasChanges = isEditMode
			? JSON.stringify(name) !== JSON.stringify(initialData?.name || {}) ||
			  JSON.stringify(description) !==
					JSON.stringify(initialData?.description || {}) ||
			  selectedParentId !== (initialData?.parentId || null)
			: Object.keys(name).length > 0 ||
			  Object.keys(description).length > 0 ||
			  selectedParentId !== null;

		setHasUnsavedChanges(hasChanges);
	}, [name, description, selectedParentId, initialData, isEditMode, open]);

	// Handle form submission
	const handleSave = useCallback(async () => {
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setIsSaving(true);
		setErrors({});

		console.log("Initial the data " + initialData);
		try {
			await onSave({
				id: initialData?.id,
				name,
				description,
				parentId: selectedParentId,
			});
			onOpenChange(false);
		} catch (error) {
			setErrors({
				submit:
					error instanceof Error ? error.message : "Failed to save category",
			});
		} finally {
			setIsSaving(false);
		}
	}, [
		validationErrors,
		onSave,
		initialData?.id,
		name,
		description,
		selectedParentId,
		onOpenChange,
	]);

	const handleClose = useCallback(() => {
		if (
			hasUnsavedChanges &&
			!window.confirm(
				"You have unsaved changes. Are you sure you want to close?"
			)
		) {
			return;
		}
		onOpenChange(false);
	}, [hasUnsavedChanges, onOpenChange]);

	// Filter available parents (exclude self and descendants)
	const filteredParents = useMemo(() => {
		if (!isEditMode) return availableParents;

		// Exclude self and any descendants
		const excludeIds = new Set([initialData!.id]);

		// Find all descendants recursively
		const findDescendants = (parentId: string) => {
			availableParents.forEach((cat) => {
				if (cat.parentId === parentId && !excludeIds.has(cat.id)) {
					excludeIds.add(cat.id);
					findDescendants(cat.id);
				}
			});
		};

		findDescendants(initialData!.id);

		return availableParents.filter((cat) => !excludeIds.has(cat.id));
	}, [availableParents, isEditMode, initialData]);

	// Get parent category info
	const selectedParent = selectedParentId
		? availableParents.find((p) => p.id === selectedParentId)
		: null;

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="rounded-xl sm:max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{dialogTitle}
						{isEditMode && (
							<Badge variant="outline" className="text-xs">
								ID: {initialData?.id}
							</Badge>
						)}
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Error Alert */}
					{errors.submit && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{errors.submit}</AlertDescription>
						</Alert>
					)}

					{/* Category Name */}
					<div className="space-y-2">
						<MultilingualInput
							label="Category Name *"
							value={name}
							onChange={setName}
							placeholder="e.g., Software Development"
							// error={errors.name}
							// required
						/>
					</div>

					{/* Category Description */}
					<div className="space-y-2">
						<MultilingualInput
							label="Description"
							value={description}
							onChange={setDescription}
							placeholder="A short summary of this category"
							as="textarea"
							// rows={3}
						/>
					</div>

					{/* Parent Category Selector */}
					<div className="space-y-2">
						<Label htmlFor="parent-select">Parent Category</Label>
						<Select
							value={selectedParentId || "none"}
							onValueChange={(value) =>
								setSelectedParentId(value === "none" ? null : value)
							}
						>
							<SelectTrigger id="parent-select">
								<SelectValue placeholder="Select a parent category..." />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">
									<div className="flex items-center gap-2">
										<span>None (Top-level category)</span>
									</div>
								</SelectItem>
								{filteredParents.map((parent) => (
									<SelectItem key={parent.id} value={parent.id}>
										<div className="flex items-center gap-2">
											<span>
												{parent.name[DEFAULT_LANGUAGE_CODE] ||
													`Category #${parent.id}`}
											</span>
											{parent.parentId && (
												<Badge variant="secondary" className="text-xs">
													Sub
												</Badge>
											)}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Parent Info */}
						{selectedParent && (
							<Alert>
								<Info className="h-4 w-4" />
								<AlertDescription>
									This category will be created under "
									{selectedParent.name[DEFAULT_LANGUAGE_CODE]}"
								</AlertDescription>
							</Alert>
						)}
					</div>

					{/* Category Hierarchy Preview */}
					{(selectedParent || isEditMode) && (
						<div className="p-4 bg-muted/50 rounded-lg">
							<Label className="text-sm font-medium mb-2 block">
								Category Path
							</Label>
							<div className="text-sm text-muted-foreground">
								{selectedParent && (
									<>
										{selectedParent.name[DEFAULT_LANGUAGE_CODE]}
										<span className="mx-2">→</span>
									</>
								)}
								<span className="font-medium text-foreground">
									{name[DEFAULT_LANGUAGE_CODE] || "New Category"}
								</span>
							</div>
						</div>
					)}
				</div>

				<DialogFooter className="flex-col sm:flex-row gap-2">
					<div className="flex-1 text-left">
						{hasUnsavedChanges && (
							<p className="text-xs text-muted-foreground">
								You have unsaved changes
							</p>
						)}
					</div>
					<div className="flex gap-2">
						<Button variant="outline" onClick={handleClose} disabled={isSaving}>
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							disabled={isSaveDisabled}
							className="min-w-[120px]"
						>
							{isSaving ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								saveButtonText
							)}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
