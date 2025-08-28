"use client";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
	Edit,
	ExternalLink,
	Eye,
	MessageCircle,
	Star,
	Clock,
	Calendar,
	User,
	Folder,
	Globe,
	Tag,
	TrendingUp,
	Copy,
	Share2,
	MoreHorizontal,
	Archive,
	Trash2,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BlogPost } from "@/lib/types/blog";
import {
	DEFAULT_LANGUAGE_CODE,
	SUPPORTED_LANGUAGES,
} from "@/lib/types/languages";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface BlogPostDetailSheetProps {
	post: BlogPost | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onEdit?: (post: BlogPost) => void;
}

export function BlogPostDetailSheet({
	post,
	open,
	onOpenChange,
	onEdit,
}: BlogPostDetailSheetProps) {
	if (!post) return null;

	const getStatusBadge = (status: BlogPost["status"]) => {
		const variants = {
			published: {
				className: "bg-green-100 text-green-800 border-green-200",
				label: "Published",
			},
			draft: {
				className: "bg-yellow-100 text-yellow-800 border-yellow-200",
				label: "Draft",
			},
			archived: {
				className: "bg-gray-100 text-gray-700 border-gray-200",
				label: "Archived",
			},
			scheduled: {
				className: "bg-blue-100 text-blue-800 border-blue-200",
				label: "Scheduled",
			},
		};

		const variant = variants[status];
		return (
			<Badge variant="outline" className={cn(variant.className)}>
				<div
					className={`w-2 h-2 rounded-full mr-2 ${
						status === "published"
							? "bg-green-500"
							: status === "draft"
							? "bg-yellow-500"
							: status === "scheduled"
							? "bg-blue-500"
							: "bg-gray-500"
					}`}
				/>
				{variant.label}
			</Badge>
		);
	};

	const getTranslationProgress = () => {
		const fields = [post.title, post.content, post.excerpt].filter(Boolean);
		if (fields.length === 0) return 0;

		let totalFields = 0;
		let completedFields = 0;

		fields.forEach((field) => {
			SUPPORTED_LANGUAGES.forEach((lang) => {
				totalFields++;
				if (field?.[lang.code]?.trim()) {
					completedFields++;
				}
			});
		});

		return Math.round((completedFields / totalFields) * 100);
	};

	const translationProgress = getTranslationProgress();

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="sm:max-w-2xl overflow-y-auto" side="right">
				<SheetHeader className="space-y-0">
					<div className="flex items-start justify-between">
						<div className="flex-1 min-w-0">
							<SheetTitle className="text-xl font-semibold line-clamp-2 text-left pr-4">
								{post.title[DEFAULT_LANGUAGE_CODE] || "Untitled"}
							</SheetTitle>
							<p className="text-sm text-gray-600 mt-2 line-clamp-3 text-left">
								{post.excerpt?.[DEFAULT_LANGUAGE_CODE] ||
									post.content?.[DEFAULT_LANGUAGE_CODE]?.replace(
										/<[^>]*>/g,
										""
									).substring(0, 200) ||
									"No excerpt available"}
							</p>
						</div>
						<div className="flex items-center space-x-2 flex-shrink-0">
							{post.isFeatured && (
								<Star className="h-5 w-5 text-yellow-500 fill-current" />
							)}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm">
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem>
										<ExternalLink className="mr-2 h-4 w-4" />
										View Live
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Copy className="mr-2 h-4 w-4" />
										Copy Link
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Share2 className="mr-2 h-4 w-4" />
										Share
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<Archive className="mr-2 h-4 w-4" />
										Archive
									</DropdownMenuItem>
									<DropdownMenuItem className="text-red-600 focus:text-red-600">
										<Trash2 className="mr-2 h-4 w-4" />
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</SheetHeader>

				<div className="space-y-6 py-6">
					{/* Cover Image */}
					{post.coverImageUrl && (
						<div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
							<img
								src={post.coverImageUrl}
								alt="Cover"
								className="w-full h-full object-cover"
								onError={(e) => {
									e.currentTarget.src =
										"https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=800";
								}}
							/>
						</div>
					)}

					{/* Quick Actions */}
					<div className="flex gap-2">
						{onEdit && (
							<Button onClick={() => onEdit(post)} className="flex-1">
								<Edit className="mr-2 h-4 w-4" />
								Edit Post
							</Button>
						)}
						<Button variant="outline">
							<ExternalLink className="mr-2 h-4 w-4" />
							Preview
						</Button>
					</div>

					{/* Performance Metrics */}
					<div>
						<label className="text-sm font-medium text-gray-500 block mb-3">
							Performance
						</label>
						<div className="grid grid-cols-3 gap-4">
							<div className="text-center p-4 bg-gray-50 rounded-lg">
								<div className="flex items-center justify-center mb-2">
									<TrendingUp className="h-4 w-4 text-blue-500" />
								</div>
								<div className="text-xl font-bold text-gray-900">
									{post.readCounts.toLocaleString()}
								</div>
								<div className="text-xs text-gray-500">Views</div>
							</div>

							<div className="text-center p-4 bg-gray-50 rounded-lg">
								<div className="flex items-center justify-center mb-2">
									<MessageCircle className="h-4 w-4 text-green-500" />
								</div>
								<div className="text-xl font-bold text-gray-900">
									{post.commentsCount}
								</div>
								<div className="text-xs text-gray-500">Comments</div>
							</div>

							<div className="text-center p-4 bg-gray-50 rounded-lg">
								<div className="flex items-center justify-center mb-2">
									<Clock className="h-4 w-4 text-purple-500" />
								</div>
								<div className="text-xl font-bold text-gray-900">
									{post.readTimes}
								</div>
								<div className="text-xs text-gray-500">Min Read</div>
							</div>
						</div>
					</div>

					<Separator />

					{/* Author Information */}
					{post.author && (
						<div>
							<label className="text-sm font-medium text-gray-500 block mb-3 flex items-center">
								<User className="mr-2 h-4 w-4" />
								Author
							</label>
							<div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
								<Avatar className="h-10 w-10">
									<AvatarImage
										src={post.author.avatar}
										alt={post.author.name}
									/>
									<AvatarFallback>
										{post.author.name
											.split(" ")
											.map((n) => n[0])
											.join("")
											.substring(0, 2)}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className="font-medium text-gray-900">
										{post.author.name}
									</div>
									<div className="text-sm text-gray-500">
										{post.author.email}
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Category */}
					{post.category && (
						<div>
							<label className="text-sm font-medium text-gray-500 block mb-2 flex items-center">
								<Folder className="mr-2 h-4 w-4" />
								Category
							</label>
							<Badge
								variant="outline"
								className="text-sm px-3 py-1"
								style={{
									borderColor: "#E5E7EB",
									color: "#6B7280",
								}}
							>
								<div
									className="w-2 h-2 rounded-full mr-2"
									style={{ backgroundColor: "#6B7280" }}
								/>
								{post.category.name[DEFAULT_LANGUAGE_CODE] || "Uncategorized"}
							</Badge>
						</div>
					)}

					{/* Tags */}
					{post.tags.length > 0 && (
						<div>
							<label className="text-sm font-medium text-gray-500 block mb-2 flex items-center">
								<Tag className="mr-2 h-4 w-4" />
								Tags
							</label>
							<div className="flex flex-wrap gap-2">
								{post.tags.map((tag) => (
									<Badge
										key={tag}
										variant="secondary"
										className="text-xs px-2 py-1"
									>
										#{tag}
									</Badge>
								))}
							</div>
						</div>
					)}

					<Separator />

					{/* Dates Information */}
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-gray-500 flex items-center mb-1">
								<Calendar className="mr-2 h-4 w-4" />
								Created
							</label>
							<div className="text-sm text-gray-900">
								{format(post.createdAt, "EEEE, MMMM dd, yyyy")} at{" "}
								{format(post.createdAt, "HH:mm")}
							</div>
							<div className="text-xs text-gray-500">
								{formatDistanceToNow(post.createdAt, { addSuffix: true })}
							</div>
						</div>

						<div>
							<label className="text-sm font-medium text-gray-500 flex items-center mb-1">
								<TrendingUp className="mr-2 h-4 w-4" />
								Last Updated
							</label>
							<div className="text-sm text-gray-900">
								{format(post.updatedAt, "EEEE, MMMM dd, yyyy")} at{" "}
								{format(post.updatedAt, "HH:mm")}
							</div>
							<div className="text-xs text-gray-500">
								{formatDistanceToNow(post.updatedAt, { addSuffix: true })}
							</div>
						</div>

						{post.publishedAt && (
							<div>
								<label className="text-sm font-medium text-gray-500 flex items-center mb-1">
									<Eye className="mr-2 h-4 w-4" />
									Published
								</label>
								<div className="text-sm text-gray-900">
									{format(post.publishedAt, "EEEE, MMMM dd, yyyy")} at{" "}
									{format(post.publishedAt, "HH:mm")}
								</div>
								<div className="text-xs text-gray-500">
									{formatDistanceToNow(post.publishedAt, { addSuffix: true })}
								</div>
							</div>
						)}
					</div>

					{/* Content Preview */}
					<div>
						<label className="text-sm font-medium text-gray-500 block mb-3">
							Content Preview
						</label>
						<div className="p-4 bg-gray-50 rounded-lg text-sm leading-relaxed max-h-40 overflow-hidden">
							<div className="line-clamp-8">
								{post.content[DEFAULT_LANGUAGE_CODE]?.replace(/<[^>]*>/g, "") ||
									"No content available"}
							</div>
							{post.content[DEFAULT_LANGUAGE_CODE] &&
								post.content[DEFAULT_LANGUAGE_CODE].length > 300 && (
									<div className="text-xs text-gray-400 mt-2">
										Content truncated for preview...
									</div>
								)}
						</div>
					</div>

					{/* Translation Status */}
					<div>
						<label className="text-sm font-medium text-gray-500 block mb-3 flex items-center">
							<Globe className="mr-2 h-4 w-4" />
							Translation Status
						</label>
						<div className="space-y-2">
							{SUPPORTED_LANGUAGES.map((lang) => {
								const hasTitle = !!post.title?.[lang.code]?.trim();
								const hasContent = !!post.content?.[lang.code]?.trim();
								const hasExcerpt = !!post.excerpt?.[lang.code]?.trim();
								const completeness = [hasTitle, hasContent, hasExcerpt].filter(
									Boolean
								).length;

								return (
									<div
										key={lang.code}
										className="flex items-center justify-between p-2 bg-gray-50 rounded"
									>
										<div className="flex items-center space-x-2">
											<span className="text-lg">{lang.flag}</span>
											<span className="text-sm font-medium">
												{lang.nativeName}
											</span>
										</div>
										<div className="flex items-center space-x-2">
											<div className="flex space-x-1">
												{[hasTitle, hasContent, hasExcerpt].map(
													(completed, idx) => (
														<div
															key={idx}
															className={`w-2 h-2 rounded-full ${
																completed ? "bg-green-500" : "bg-gray-300"
															}`}
														/>
													)
												)}
											</div>
											<span className="text-xs text-gray-500">
												{completeness}/3
											</span>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
