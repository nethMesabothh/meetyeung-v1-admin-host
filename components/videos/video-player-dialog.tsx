"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface VideoPlayerDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	videoId?: string;
}

export function VideoPlayerDialog({
	open,
	onOpenChange,
	title,
	videoId,
}: VideoPlayerDialogProps) {
	if (!videoId) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl w-full p-0 border-0">
				<DialogHeader className="p-4 pb-0">
					<DialogTitle>{title || "Video Preview"}</DialogTitle>
				</DialogHeader>
				<div className="aspect-video bg-black rounded-b-lg overflow-hidden">
					<iframe
						width="100%"
						height="100%"
						src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
						title={title}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					></iframe>
				</div>
			</DialogContent>
		</Dialog>
	);
}
