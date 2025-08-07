"use client";

import { useState } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	rectSortingStrategy,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Plus, LayoutGrid, List } from "lucide-react";
import { Banner, Media } from "@/lib/types/banner";
import { mockBanners } from "@/lib/data/banner-data"; // Use new mockBanners
import { BannerCard } from "./banner-card";
import { AddBannerDialog } from "./add-banner-dialog"; // No changes needed for this component
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "row";
const EmptyState = () => (
	<Card className="rounded-xl mt-4 border-2 border-dashed">
		<CardContent className="flex flex-col items-center justify-center py-20 text-center">
			<Upload className="h-12 w-12 text-muted-foreground mb-4" />
			<h3 className="text-lg font-medium mb-2">No Banners Yet</h3>
			<p className="text-muted-foreground mb-4 max-w-xs">
				Click "Add Banner" to upload your first one.
			</p>
		</CardContent>
	</Card>
);

export function BannerManagement() {
	// Fixed: Initialize state with the correct mockBanners data
	const [banners, setBanners] = useState<Banner[]>(mockBanners);
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor)
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			setBanners((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	const handleAddBanner = async (file: File) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Updated: Simulate creating a full Media object from the uploaded file
		const newMediaObject: Media = {
			id: `media_${Date.now()}`,
			url: URL.createObjectURL(file), // This is a temporary local URL
			fileName: file.name,
			fileSize: file.size,
			mimeType: file.type,
			altText: file.name,
			createdAt: new Date(),
		};

		const newBanner: Banner = {
			id: `banner_${Date.now()}`,
			imageUrl: newMediaObject, // Nest the new Media object
			order: banners.length + 1,
			createdAt: new Date(),
		};
		setBanners((prevBanners) => [...prevBanners, newBanner]);
	};

	const handleDeleteBanner = (id: string) => {
		const bannerToDelete = banners.find((b) => b.id === id);
		// Updated: Access nested URL to revoke blob
		if (bannerToDelete && bannerToDelete.imageUrl.url.startsWith("blob:")) {
			URL.revokeObjectURL(bannerToDelete.imageUrl.url);
		}
		setBanners(banners.filter((banner) => banner.id !== id));
	};

	const dndStrategy =
		viewMode === "grid" ? rectSortingStrategy : verticalListSortingStrategy;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">
						Banner Management
					</h2>
					<p className="text-muted-foreground">
						Drag to reorder. Use the toggle to change views.
					</p>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
						<Button
							size="sm"
							variant={viewMode === "grid" ? "secondary" : "ghost"}
							onClick={() => setViewMode("grid")}
							className="h-8 w-8 p-0"
						>
							<LayoutGrid className="h-4 w-4" />
						</Button>
						<Button
							size="sm"
							variant={viewMode === "row" ? "secondary" : "ghost"}
							onClick={() => setViewMode("row")}
							className="h-8 w-8 p-0"
						>
							<List className="h-4 w-4" />
						</Button>
					</div>
					<AddBannerDialog onBannerAdd={handleAddBanner} />
				</div>
			</div>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={banners} strategy={dndStrategy}>
					{banners.length > 0 ? (
						<div
							className={cn(
								"transition-all duration-300",
								viewMode === "grid"
									? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
									: "flex flex-col gap-2"
							)}
						>
							{banners.map((banner, index) => (
								<BannerCard
									key={banner.id}
									banner={banner}
									order={index + 1}
									viewMode={viewMode}
									onDelete={handleDeleteBanner}
								/>
							))}
						</div>
					) : (
						<EmptyState />
					)}
				</SortableContext>
			</DndContext>
		</div>
	);
}
