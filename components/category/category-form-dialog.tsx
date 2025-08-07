"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Category } from "@/lib/types/category";

interface CategoryFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (categoryData: Partial<Category>) => void;
	initialData?: Category | null;
	parentId?: string | null; // For explicitly creating a sub-category
	availableParents: Category[];
}

export function CategoryFormDialog({
	open,
	onOpenChange,
	onSave,
	initialData,
	parentId,
	availableParents,
}: CategoryFormDialogProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

	useEffect(() => {
		if (open) {
			if (initialData) {
				// Editing mode
				setName(initialData.name);
				setDescription(initialData.description || "");
				setSelectedParentId(initialData.parentId || null);
			} else {
				// Adding mode
				setName("");
				setDescription("");
				setSelectedParentId(parentId || null); // Pre-select parent if provided
			}
		}
	}, [open, initialData, parentId]);

	const handleSave = () => {
		if (!name.trim()) return;
		onSave({
			id: initialData?.id,
			name,
			description,
			parentId: selectedParentId,
		});
		onOpenChange(false);
	};

	const getDialogTitle = () => {
		if (initialData) return "Edit Category";
		if (parentId) return "Add New Sub-category";
		return "Add New Category";
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="rounded-xl">
				<DialogHeader>
					<DialogTitle>{getDialogTitle()}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-2">
					<div className="space-y-2">
						<Label htmlFor="category-name">Category Name *</Label>
						<Input
							id="category-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g., Software Development"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="category-description">Description</Label>
						<Textarea
							id="category-description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="A short summary of this category"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="parent-category">Parent Category</Label>
						<Select
							value={selectedParentId || "none"}
							onValueChange={(value) =>
								setSelectedParentId(value === "none" ? null : value)
							}
							disabled={
								!!initialData?.id &&
								availableParents.some((p) => p.id === initialData.id)
							} // Disable if editing a parent category
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a parent category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="none">None (Top-level category)</SelectItem>
								{availableParents
									.filter((p) => p.id !== initialData?.id)
									.map((parent) => (
										<SelectItem key={parent.id} value={parent.id}>
											{parent.name}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="flex justify-end space-x-2">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={!name.trim()}>
						{initialData ? "Update" : "Create"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
