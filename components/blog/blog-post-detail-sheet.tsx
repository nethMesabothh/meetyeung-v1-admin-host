"use client";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Calendar, Eye, MessageSquare } from "lucide-react";
import { BlogPost } from "@/lib/types/blog";
import { Badge } from "../ui/badge";
import { DEFAULT_LANGUAGE_CODE } from "@/lib/types/languages";

interface BlogPostDetailSheetProps {
	post: BlogPost | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function BlogPostDetailSheet({
	post,
	open,
	onOpenChange,
}: BlogPostDetailSheetProps) {
	if (!post) return null;
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-full sm:max-w-3xl overflow-y-auto p-0">
				{post.coverImage?.url && (
					<div className="aspect-[16/9] w-full bg-muted">
						<img
							src={post.coverImage.url}
							alt={post.title}
							className="w-full h-full object-cover"
						/>
					</div>
				)}
				<div className="p-6 space-y-6">
					<header className="space-y-2">
						<Badge variant="outline" className="rounded-md w-fit">
							{post.category?.name[DEFAULT_LANGUAGE_CODE]}
						</Badge>
						<SheetTitle className="text-3xl !mt-2 font-bold tracking-tight">
							{post.title}
						</SheetTitle>
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<div className="flex items-center gap-1.5">
								<Calendar className="h-4 w-4" />
								{post.publishedAt
									? `Published on ${new Date(post.publishedAt)}`
									: "Draft"}
							</div>
							<div className="flex items-center gap-1.5">
								<Eye className="h-4 w-4" />
								{post.readCounts.toLocaleString()} reads
							</div>
							<div className="flex items-center gap-1.5">
								<MessageSquare className="h-4 w-4" />
								{post.commentsCount} comments
							</div>
						</div>
					</header>
					<Separator />
					<div
						className="prose prose-stone dark:prose-invert max-w-none"
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>
					{post.media && post.media.length > 0 && (
						<div>
							<Separator className="my-6" />
							<h3 className="text-xl font-semibold mb-4">Post Gallery</h3>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
								{post.media.map((mediaItem) => (
									<div
										key={mediaItem.id}
										className="aspect-square bg-muted rounded-lg overflow-hidden"
									>
										<img
											src={mediaItem.url}
											alt={mediaItem.altText || ""}
											className="w-full h-full object-cover"
										/>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
