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
import { GripVertical, Trash2 } from "lucide-react";
import { Banner } from "@/lib/types/banner";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "row";
const FALLBACK_IMAGE_URL =
	"https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop";

interface BannerCardProps {
	banner: Banner;
	order: number;
	viewMode: ViewMode;
	onDelete: (id: string) => void;
}

export function BannerCard({
	banner,
	order,
	viewMode,
	onDelete,
}: BannerCardProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: banner.id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 100 : "auto",
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
				<div className="aspect-[16/9] relative">
					<img
						src={banner.imageUrl.url} // Updated: Access nested URL
						alt={banner.imageUrl.altText || `Banner ${order}`} // Updated: Use alt text from media
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
								<AlertDialogTitle>Delete Banner</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to delete this banner? This action
									cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel className="rounded-xl">
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => onDelete(banner.id)}
									className="bg-red-600 hover:bg-red-700 rounded-xl"
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					<div className="absolute bottom-0 left-0 p-3 text-white">
						<p className="font-bold text-sm">Order: {order}</p>
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
				<img
					src={banner.imageUrl.url} // Updated: Access nested URL
					onError={(e) => {
						e.currentTarget.src = FALLBACK_IMAGE_URL;
					}}
					alt={banner.imageUrl.altText || `Banner ${order}`} // Updated: Use alt text from media
					className="h-14 w-24 rounded-md object-cover"
				/>
				<div className="flex-1 min-w-0">
					<p className="font-medium truncate">
						{banner.imageUrl.fileName || `Banner (Order ${order})`}
					</p>{" "}
					{/* Updated: Show filename */}
					<p className="text-sm text-muted-foreground truncate">
						ID: {banner.id}
					</p>
				</div>
				<p className="hidden md:block text-sm text-muted-foreground">
					Added: {new Date(banner.createdAt).toLocaleDateString()}
				</p>
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
					<AlertDialogContent className="rounded-xl">
						<AlertDialogHeader>
							<AlertDialogTitle>Delete Banner</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete this banner? This action cannot
								be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel className="rounded-xl">
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => onDelete(banner.id)}
								className="bg-red-600 hover:bg-red-700 rounded-xl"
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</Card>
	);
}
