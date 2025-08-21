"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GripVertical, ImageIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@radix-ui/react-switch";
import { Label } from "recharts";

interface SortableItemCardProps {
	id: string;
	order: number;
	viewMode: "grid" | "row";
	onDelete: (id: string) => void;

	// Generic data props
	imageUrl?: string | null;
	title: string;
	subtitle?: string;
	date?: Date;

	// active prop
	isActive: boolean;
	onToggleActive: (id: string) => void;
}

const FALLBACK_IMAGE_URL =
	"https://via.placeholder.com/800x450/4B5563/FFFFFF?text=No+Image";

export function SortableItemCard({
	id,
	order,
	viewMode,
	onDelete,
	imageUrl,
	title,
	subtitle,
	date,
	isActive,
	onToggleActive,
}: SortableItemCardProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 100 : "auto",
	};

	const finalImageUrl = imageUrl || FALLBACK_IMAGE_URL;

	const DeleteDialog = () => (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					size="icon"
					variant="destructive"
					className="absolute top-2 left-2 h-8 w-8 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="rounded-xl">
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the item.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => onDelete(id)}
						className="bg-red-600 hover:bg-red-700 rounded-xl"
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);

	const handleToggle = () => {
		onToggleActive(id);
	};

	if (viewMode === "grid") {
		return (
			<Card
				ref={setNodeRef}
				style={style}
				className={cn(
					"group relative touch-none overflow-hidden rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-md",
					isDragging && "shadow-2xl ring-2 ring-primary"
				)}
			>
				<div className="absolute top-2 left-2 z-10">
					<Switch
						id={`active-switch-${id}`}
						checked={isActive}
						onCheckedChange={handleToggle}
						className="data-[state=checked]:bg-green-500"
					/>
				</div>
				<div className="aspect-[16/9] relative bg-muted">
					<img
						src={finalImageUrl}
						alt={title}
						className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
						onError={(e) => {
							e.currentTarget.src = FALLBACK_IMAGE_URL;
						}}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
					<div
						{...attributes}
						{...listeners}
						className="absolute top-2 right-2 p-1.5 cursor-grab bg-black/40 rounded-full text-white/80 active:cursor-grabbing transition-opacity opacity-0 group-hover:opacity-100"
					>
						<GripVertical className="h-5 w-5" />
					</div>
					<DeleteDialog />
					<div className="absolute bottom-0 left-0 p-3 text-white">
						<p className="font-bold text-sm truncate">{title}</p>
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
				"w-full touch-none",
				isDragging && "shadow-lg ring-2 ring-primary"
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
				{imageUrl ? (
					<img
						src={imageUrl}
						onError={(e) => {
							e.currentTarget.src = FALLBACK_IMAGE_URL;
						}}
						alt={title}
						className="h-14 w-24 rounded-md object-cover"
					/>
				) : (
					<div className="h-14 w-24 rounded-md bg-muted flex items-center justify-center">
						<ImageIcon className="h-6 w-6 text-muted-foreground" />
					</div>
				)}
				<div className="flex-1 min-w-0">
					<p className="font-medium truncate">{title}</p>
					{subtitle && (
						<p className="text-sm text-muted-foreground truncate">{subtitle}</p>
					)}
				</div>
				<div className="flex items-center space-x-2">
					<Label className="text-sm font-medium">
						{isActive ? "Active" : "Inactive"}
					</Label>
					<Switch
						id={`active-switch-row-${id}`}
						checked={isActive}
						onCheckedChange={handleToggle}
						className="data-[state=checked]:bg-green-500"
					/>
				</div>
				{date && (
					<p className="hidden md:block text-sm text-muted-foreground">
						Added: {new Date(date).toLocaleDateString()}
					</p>
				)}
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						{/* ... same dialog content as above */}
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</Card>
	);
}
