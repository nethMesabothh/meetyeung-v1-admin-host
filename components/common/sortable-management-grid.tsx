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
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { Button } from "@/components/ui/button";
import { List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "row";

interface SortableManagementGridProps<T extends { id: string }> {
	items: T[];
	setItems: React.Dispatch<React.SetStateAction<T[]>>;
	onDelete: (id: string) => void;

	title: string;
	description: string;
	addDialogComponent: React.ReactNode;
	emptyStateComponent: React.ReactNode;

	renderItem: (item: T, index: number, viewMode: ViewMode) => React.ReactNode;
}

export function SortableManagementGrid<T extends { id: string }>({
	items,
	setItems,
	onDelete,
	title,
	description,
	addDialogComponent,
	emptyStateComponent,
	renderItem,
}: SortableManagementGridProps<T>) {
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
				return arrayMove(currentItems, oldIndex, newIndex);
			});
			// NOTE: You would add your API call to persist the new order here
		}
	};

	const dndStrategy =
		viewMode === "grid" ? rectSortingStrategy : verticalListSortingStrategy;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
					<p className="text-muted-foreground">{description}</p>
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
					{addDialogComponent}
				</div>
			</div>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				modifiers={[restrictToWindowEdges]}
			>
				<SortableContext items={items} strategy={dndStrategy}>
					{items.length > 0 ? (
						<div
							className={cn(
								"transition-all duration-300",
								viewMode === "grid"
									? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
									: "flex flex-col gap-2"
							)}
						>
							{items.map((item, index) => renderItem(item, index, viewMode))}
						</div>
					) : (
						emptyStateComponent
					)}
				</SortableContext>
			</DndContext>
		</div>
	);
}
