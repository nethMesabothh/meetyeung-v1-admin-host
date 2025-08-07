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
import { Media, ViewMode } from "@/lib/types/banner";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaItemCard } from "./media-item-card";

interface SortableMediaGalleryProps {
	initialItems: Media[];
}

export function SortableMediaGallery({
	initialItems,
}: SortableMediaGalleryProps) {
	const [items, setItems] = useState<Media[]>(initialItems);
	const [viewMode, setViewMode] = useState<ViewMode>("grid");

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor)
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			setItems((currentItems) => {
				const oldIndex = currentItems.findIndex(
					(item) => item.id === active.id
				);
				const newIndex = currentItems.findIndex((item) => item.id === over.id);
				const reorderedItems = arrayMove(currentItems, oldIndex, newIndex);

				// In a real app, you would now call your API to persist the new order.
				// For example:
				// const updatePayload = reorderedItems.map((item, index) => ({
				//   id: item.id,
				//   order: index + 1,
				// }));
				// api.media.updateOrder(updatePayload);

				return reorderedItems;
			});
		}
	};

	const handleDelete = (id: string) => {
		setItems((current) => current.filter((item) => item.id !== id));
		// In a real app, call your API here:
		// api.media.delete({ id });
	};

	const dndStrategy =
		viewMode === "grid" ? rectSortingStrategy : verticalListSortingStrategy;

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">
					Media Gallery ({items.length})
				</h3>
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
			</div>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext items={items} strategy={dndStrategy}>
					<div
						className={cn(
							"transition-all duration-300",
							viewMode === "grid"
								? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
								: "flex flex-col"
						)}
					>
						{items.map((item) => (
							<MediaItemCard
								key={item.id}
								media={item}
								viewMode={viewMode}
								onDelete={handleDelete}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>

			{items.length === 0 && (
				<div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-lg">
					<p className="text-muted-foreground">No media items found.</p>
					<p className="text-sm text-muted-foreground">
						Upload new media to get started.
					</p>
				</div>
			)}
		</div>
	);
}
