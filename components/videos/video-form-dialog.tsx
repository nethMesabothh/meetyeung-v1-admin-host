"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Video } from "@/lib/types/video";
import { Category, LocalizedField } from "@/lib/types/category";
import { MultilingualInput } from "@/components/common/multilingual-input";
import { DEFAULT_LANGUAGE_CODE } from "@/lib/types/languages";

interface VideoFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (videoData: Partial<Video>) => void;
	initialData?: Video | null;
	// 1. Add prop to accept the list of available categories
	availableCategories: Category[];
}

export function VideoFormDialog({
	open,
	onOpenChange,
	onSave,
	initialData,
	availableCategories, // 2. Destructure the new prop
}: VideoFormDialogProps) {
	const [title, setTitle] = useState<LocalizedField>({});
	const [description, setDescription] = useState<LocalizedField>({});
	const [videoId, setVideoId] = useState("");
	const [category, setCategory] = useState("");

	useEffect(() => {
		if (open) {
			if (initialData) {
				setTitle(initialData.title || {});
				setDescription(initialData.description || {});
				setVideoId(initialData.videoId || "");
				setCategory(initialData.category || "");
			} else {
				setTitle({});
				setDescription({});
				setVideoId("");
				setCategory("");
			}
		}
	}, [open, initialData]);

	const handleSave = () => {
		if (!title[DEFAULT_LANGUAGE_CODE] || !videoId) return;
		onSave({ id: initialData?.id, title, description, videoId, category });
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-3xl">
				<DialogHeader>
					<DialogTitle>
						{initialData ? "Edit Video" : "Add New Video"}
					</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="video-id">YouTube Video ID *</Label>
							<Input
								id="video-id"
								value={videoId}
								onChange={(e) => setVideoId(e.target.value)}
								placeholder="e.g., dQw4w9WgXcQ"
							/>
						</div>
						<div className="space-y-2">
							<Label>Category</Label>
							<Select value={category} onValueChange={setCategory}>
								<SelectTrigger>
									<SelectValue placeholder="Select a category" />
								</SelectTrigger>
								<SelectContent>
									{/* 3. Map over the availableCategories prop */}
									{availableCategories.map((cat) => (
										<SelectItem key={cat.id} value={cat.id}>
											{cat.name[DEFAULT_LANGUAGE_CODE]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						{videoId && (
							<div className="aspect-video bg-muted rounded-lg overflow-hidden">
								<iframe
									src={`https://www.youtube.com/embed/${videoId}`}
									width="100%"
									height="100%"
									allowFullScreen
									title="YouTube Preview"
								/>
							</div>
						)}
					</div>
					<div className="space-y-4">
						<MultilingualInput
							label="Video Title *"
							value={title}
							onChange={setTitle}
						/>
						<MultilingualInput
							label="Video Description"
							value={description}
							onChange={setDescription}
							as="textarea"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSave}>Save Video</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
