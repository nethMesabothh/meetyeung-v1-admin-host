"use client";

import { useMemo, useState } from "react";
import { Video } from "@/lib/types/video";
import { mockVideos, videoCategories } from "@/lib/data/video";
import { DEFAULT_LANGUAGE_CODE } from "@/lib/types/languages";
import { SortableManagementGrid } from "@/components/common/sortable-management-grid";
import { SortableVideoCard } from "./sortable-video-card";
import { VideoFormDialog } from "./video-form-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mockCategories } from "@/lib/data/category";
import { VideoPlayerDialog } from "./video-player-dialog";

export function VideoManagement() {
	const [videos, setVideos] = useState<Video[]>(mockVideos);
	const [dialogState, setDialogState] = useState<{
		open: boolean;
		video?: Video | null;
	}>({ open: false });
	const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

	const availableCategories = useMemo(() => {
		return mockCategories.filter((cat) => !cat.parentId);
	}, []);

	const handleVideoClick = (video: Video) => {
		setDialogState({ open: true, video: video });
	};

	const handleSave = (data: Partial<Video>) => {
		if (data.id) {
			setVideos(videos.map((v) => (v.id === data.id ? { ...v, ...data } : v)));
		} else {
			const newVideo: Video = {
				id: `vid_${Date.now()}`,
				createdAt: new Date(),
				order: videos.length,
				...data,
			} as Video;
			setVideos([...videos, newVideo]);
		}
	};

	const handleDelete = (id: string) =>
		setVideos(videos.filter((v) => v.id !== id));

	const handleToggleActive = (id: string) =>
		setVideos(
			videos.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v))
		);

	return (
		<>
			<SortableManagementGrid<Video>
				items={videos}
				setItems={setVideos}
				title="Video Management"
				description="Manage, reorder, and update your YouTube videos."
				onDelete={handleDelete}
				addDialogComponent={
					<Button onClick={() => setDialogState({ open: true, video: null })}>
						<Plus className="mr-2 h-4 w-4" /> Add Video
					</Button>
				}
				emptyStateComponent={
					<div className="text-center py-16 text-gray-500 bg-card rounded-lg border-2 border-dashed">
						<h3 className="text-xl font-semibold">No Videos Found</h3>
						<p className="mt-2 text-sm">Click "Add Video" to get started.</p>
					</div>
				}
				renderItem={(video, isGhost, isDragging) => (
					<SortableVideoCard
						key={video.id}
						id={video.id}
						onDelete={handleDelete}
						onToggleActive={handleToggleActive}
						onEdit={() => setDialogState({ open: true, video })}
						isActive={video.isActive}
						imageUrl={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`}
						title={video.title[DEFAULT_LANGUAGE_CODE] || "Untitled Video"}
						category={
							availableCategories.find((c) => c.id === video.category)?.name[
								DEFAULT_LANGUAGE_CODE
							]
						}
						onPlay={() => setPlayingVideo(video)}
						date={video.date}
					/>
				)}
			/>

			<VideoFormDialog
				open={dialogState.open}
				onOpenChange={(open) => setDialogState({ ...dialogState, open })}
				onSave={handleSave}
				initialData={dialogState.video}
				availableCategories={availableCategories}
			/>

			<VideoPlayerDialog
				open={!!playingVideo}
				onOpenChange={(open) => !open && setPlayingVideo(null)}
				title={playingVideo?.title[DEFAULT_LANGUAGE_CODE]}
				videoId={playingVideo?.videoId}
			/>
		</>
	);
}
