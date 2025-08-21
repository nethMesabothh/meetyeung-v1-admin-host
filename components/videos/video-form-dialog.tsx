"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // Import Next.js Image component
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
import { Play } from "lucide-react"; // Import the Play icon

interface VideoFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (videoData: Partial<Video>) => void;
	initialData?: Video | null;
	availableCategories: Category[];
}

export function VideoFormDialog({
	open,
	onOpenChange,
	onSave,
	initialData,
	availableCategories,
}: VideoFormDialogProps) {
	const [title, setTitle] = useState<LocalizedField>({});
	const [description, setDescription] = useState<LocalizedField>({});
	const [videoId, setVideoId] = useState("");
	const [category, setCategory] = useState("");
	const [isPlaying, setIsPlaying] = useState(false);

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
		setIsPlaying(false);
	}, [open, initialData]);

	// 2. Reset the player if the video ID is changed by the user
	useEffect(() => {
		setIsPlaying(false);
	}, [videoId]);

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
								{isPlaying ? (
									<iframe
										src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
										width="100%"
										height="100%"
										allow="autoplay; fullscreen"
										title="YouTube Preview"
									/>
								) : (
									<button
										type="button"
										onClick={() => setIsPlaying(true)}
										className="relative w-full h-full group"
										aria-label="Play video preview"
									>
										<Image
											src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
											alt="Video thumbnail"
											layout="fill"
											objectFit="cover"
										/>
										<div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="bg-white/90 rounded-full flex items-center justify-center shadow-md w-14 h-14 group-hover:scale-110 transition-transform">
												<Play className="text-primary ml-1 w-6 h-6" />
											</div>
										</div>
									</button>
								)}
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
