"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Media, ViewMode } from "@/lib/types/banner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Make sure you have this utility from shadcn

const formatBytes = (bytes: number | null | undefined, decimals = 2) => {
	if (!bytes) return "N/A";
	if (!+bytes) return "0 Bytes";
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

interface MediaItemCardProps {
	media: Media;
	viewMode: ViewMode;
	onDelete: (id: string) => void;
}

export function MediaItemCard({
	media,
	viewMode,
	onDelete,
}: MediaItemCardProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: media.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 100 : "auto",
	};

	const commonCardClasses =
		"group relative overflow-hidden rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-md";

	if (viewMode === "grid") {
		return (
			<Card
				ref={setNodeRef}
				style={style}
				className={cn(
					commonCardClasses,
					isDragging && "shadow-2xl ring-2 ring-primary"
				)}
			>
				<div className="aspect-square relative">
					<img
						src={media.url}
						alt={media.altText || ""}
						className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
					<div
						{...attributes}
						{...listeners}
						className="absolute top-2 right-2 p-1.5 cursor-grab bg-black/30 rounded-full text-white/70 active:cursor-grabbing transition-opacity opacity-0 group-hover:opacity-100"
					>
						<GripVertical className="h-5 w-5" />
					</div>
					<Button
						onClick={() => onDelete(media.id)}
						size="icon"
						variant="destructive"
						className="absolute top-2 left-2 h-8 w-8 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
					{/* Info Overlay */}
					<div className="absolute bottom-0 left-0 p-3 text-white">
						<p className="font-bold text-sm truncate">{media.fileName}</p>
						<p className="text-xs text-white/80">
							{formatBytes(media.fileSize)}
						</p>
					</div>
				</div>
			</Card>
		);
	}

	return (
		<Card
			ref={setNodeRef}
			style={style}
			className={cn(
				"w-full mb-2",
				isDragging && "shadow-2xl ring-2 ring-primary"
			)}
		>
			<div className="flex items-center p-2 space-x-4">
				<div
					{...attributes}
					{...listeners}
					className="p-2 cursor-grab text-muted-foreground active:cursor-grabbing"
				>
					<GripVertical className="h-5 w-5" />
				</div>
				<img
					src={media.url}
					alt={media.altText || ""}
					className="h-12 w-12 rounded-md object-cover"
				/>
				<div className="flex-1 min-w-0">
					<p className="font-medium truncate">{media.fileName}</p>
					<p className="text-sm text-muted-foreground truncate">
						{media.altText || "No alt text"}
					</p>
				</div>
				<div className="hidden md:block text-sm text-muted-foreground">
					{formatBytes(media.fileSize)}
				</div>
				<div className="hidden lg:block text-sm text-muted-foreground">
					{media.mimeType}
				</div>
				<Button
					onClick={() => onDelete(media.id)}
					size="icon"
					variant="ghost"
					className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
		</Card>
	);
}
