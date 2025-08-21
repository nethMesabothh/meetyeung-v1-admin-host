"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Play, Calendar, GripVertical, Pencil, Trash2 } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface SortableVideoCardProps {
	id: string;
	onDelete: (id: string) => void;
	onEdit: (id: string) => void;
	onToggleActive: (id: string) => void;
	isActive: boolean;
	imageUrl: string;
	title: string;
	category?: string;
	date: Date;
	duration?: string;
}

const FALLBACK_IMAGE_URL =
	"https://via.placeholder.com/800x450/4B5563/FFFFFF?text=No+Image";

export function SortableVideoCard({
	id,
	onDelete,
	onEdit,
	onToggleActive,
	isActive,
	imageUrl,
	title,
	category,
	date,
	duration,
}: SortableVideoCardProps) {
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
		transition: isDragging ? "none" : transition,
		zIndex: isDragging ? 100 : "auto",
	};

	return (
		<Card
			ref={setNodeRef}
			style={style}
			className={cn(
				"overflow-hidden transition-all duration-300 group",
				isDragging && "shadow-2xl ring-2 ring-primary scale-105"
			)}
		>
			<div className="relative aspect-video overflow-hidden">
				<Image
					src={imageUrl || FALLBACK_IMAGE_URL}
					alt={title}
					layout="fill"
					objectFit="cover"
					className="group-hover:scale-105 transition-transform duration-300"
				/>
				<div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
				<motion.div
					className="absolute inset-0 flex items-center justify-center pointer-events-none"
					whileHover={{ scale: 1.1 }}
				>
					<div className="bg-white/90 rounded-full flex items-center justify-center shadow-md w-12 h-12">
						<Play className="text-primary ml-1 w-5 h-5" />
					</div>
				</motion.div>

				<div className="absolute top-2 right-2 z-20 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
					<div
						{...attributes}
						{...listeners}
						className="p-2 cursor-grab bg-background/80 rounded-full shadow active:cursor-grabbing"
					>
						<GripVertical className="h-5 w-5 text-muted-foreground" />
					</div>
					<Button
						size="icon"
						variant="outline"
						onClick={() => onEdit(id)}
						className="h-9 w-9 shadow"
					>
						<Pencil className="h-4 w-4" />
					</Button>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								size="icon"
								variant="destructive"
								className="h-9 w-9 shadow"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							{/* ... Your Delete Dialog Content ... */}
						</AlertDialogContent>
					</AlertDialog>
				</div>

				{duration && (
					<div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs pointer-events-none">
						{duration}
					</div>
				)}
				<div className="absolute bottom-2 left-2 z-10">
					<Switch
						id={`active-${id}`}
						checked={isActive}
						onCheckedChange={() => onToggleActive(id)}
					/>
				</div>
			</div>

			<CardContent className="p-4">
				{category && <Badge variant="secondary">{category}</Badge>}
				<h3 className="text-lg font-bold my-2 line-clamp-1">{title}</h3>
				<div className="flex items-center text-xs text-muted-foreground">
					<Calendar className="w-3 h-3 mr-1.5" />
					{formatDate(date)}
				</div>
			</CardContent>
		</Card>
	);
}
