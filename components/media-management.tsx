"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import {
	Upload,
	Trash2,
	File,
	Image,
	FileText,
	Plus,
	Link,
} from "lucide-react";
import { BlogMedia } from "@/lib/types/types";
import { mockMedia, mockBlogPosts } from "@/lib/data/mock-data";

export function MediaManagement() {
	const [media, setMedia] = useState<BlogMedia[]>(mockMedia);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [formData, setFormData] = useState({
		fileName: "",
		fileUrl: "",
		mimeType: "image/jpeg",
		fileSize: 0,
		blogPostId: "",
	});

	const handleOpenAddDialog = () => {
		setFormData({
			fileName: "",
			fileUrl: "",
			mimeType: "image/jpeg",
			fileSize: 0,
			blogPostId: "",
		});
		setIsAddDialogOpen(true);
	};

	const handleAddMedia = () => {
		if (!formData.fileName.trim() || !formData.fileUrl.trim()) return;

		const newMedia: BlogMedia = {
			id: Date.now().toString(),
			fileName: formData.fileName,
			fileUrl: formData.fileUrl,
			mimeType: formData.mimeType,
			fileSize:
				formData.fileSize || Math.floor(Math.random() * 1000000) + 100000,
			blogPostId: formData.blogPostId || undefined,
			createdAt: new Date(),
		};

		setMedia([newMedia, ...media]);
		setIsAddDialogOpen(false);
		setFormData({
			fileName: "",
			fileUrl: "",
			mimeType: "image/jpeg",
			fileSize: 0,
			blogPostId: "",
		});
	};

	const handleDeleteMedia = (id: string) => {
		setMedia(media.filter((item) => item.id !== id));
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const getFileIcon = (mimeType: string) => {
		if (mimeType.startsWith("image/")) return Image;
		if (mimeType.startsWith("text/")) return FileText;
		return File;
	};

	const isImage = (mimeType: string) => mimeType.startsWith("image/");

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">
						Media Management
					</h2>
					<p className="text-muted-foreground">
						Manage files and attachments for your blog posts
					</p>
				</div>

				<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
					<DialogTrigger asChild>
						<Button
							onClick={handleOpenAddDialog}
							className="bg-blue-600 hover:bg-blue-700 rounded-xl"
						>
							<Plus className="mr-2 h-4 w-4" />
							Add Media
						</Button>
					</DialogTrigger>
					<DialogContent className="rounded-xl">
						<DialogHeader>
							<DialogTitle>Add New Media</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="file-name">File Name *</Label>
								<Input
									id="file-name"
									placeholder="example.jpg"
									value={formData.fileName}
									onChange={(e) =>
										setFormData({ ...formData, fileName: e.target.value })
									}
									className="rounded-xl"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="file-url">File URL *</Label>
								<Input
									id="file-url"
									placeholder="https://example.com/file.jpg"
									value={formData.fileUrl}
									onChange={(e) =>
										setFormData({ ...formData, fileUrl: e.target.value })
									}
									className="rounded-xl"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="mime-type">File Type</Label>
									<Select
										value={formData.mimeType}
										onValueChange={(value) =>
											setFormData({ ...formData, mimeType: value })
										}
									>
										<SelectTrigger className="rounded-xl">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="image/jpeg">JPEG Image</SelectItem>
											<SelectItem value="image/png">PNG Image</SelectItem>
											<SelectItem value="image/gif">GIF Image</SelectItem>
											<SelectItem value="image/webp">WebP Image</SelectItem>
											<SelectItem value="text/plain">Text File</SelectItem>
											<SelectItem value="application/pdf">
												PDF Document
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="file-size">File Size (bytes)</Label>
									<Input
										id="file-size"
										type="number"
										placeholder="245760"
										value={formData.fileSize || ""}
										onChange={(e) =>
											setFormData({
												...formData,
												fileSize: parseInt(e.target.value) || 0,
											})
										}
										className="rounded-xl"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="blog-post">
									Attach to Blog Post (Optional)
								</Label>
								<Select
									value={formData.blogPostId}
									onValueChange={(value) =>
										setFormData({ ...formData, blogPostId: value })
									}
								>
									<SelectTrigger className="rounded-xl">
										<SelectValue placeholder="Select blog post" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="">No attachment</SelectItem>
										{mockBlogPosts.map((post) => (
											<SelectItem key={post.id} value={post.id}>
												{post.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{formData.fileUrl && isImage(formData.mimeType) && (
								<div className="space-y-2">
									<Label>Preview</Label>
									<div className="rounded-xl overflow-hidden border">
										<img
											src={formData.fileUrl}
											alt="File preview"
											className="w-full h-32 object-cover"
											onError={(e) => {
												e.currentTarget.src =
													"https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop";
											}}
										/>
									</div>
								</div>
							)}

							<div className="flex justify-end space-x-2">
								<Button
									variant="outline"
									onClick={() => setIsAddDialogOpen(false)}
									className="rounded-xl"
								>
									Cancel
								</Button>
								<Button
									onClick={handleAddMedia}
									disabled={
										!formData.fileName.trim() || !formData.fileUrl.trim()
									}
									className="bg-blue-600 hover:bg-blue-700 rounded-xl"
								>
									Add Media
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{media.map((item) => {
					const FileIcon = getFileIcon(item.mimeType);
					const attachedPost = mockBlogPosts.find(
						(post) => post.id === item.blogPostId
					);

					return (
						<Card key={item.id} className="rounded-xl overflow-hidden">
							<div className="aspect-video bg-muted flex items-center justify-center">
								{isImage(item.mimeType) ? (
									<img
										src={item.fileUrl}
										alt={item.fileName}
										className="w-full h-full object-cover"
										onError={(e) => {
											e.currentTarget.style.display = "none";
											e.currentTarget.nextElementSibling?.classList.remove(
												"hidden"
											);
										}}
									/>
								) : null}
								<div
									className={`flex flex-col items-center ${
										isImage(item.mimeType) ? "hidden" : ""
									}`}
								>
									<FileIcon className="h-12 w-12 text-muted-foreground mb-2" />
									<span className="text-sm text-muted-foreground">
										{item.mimeType}
									</span>
								</div>
							</div>

							<CardContent className="p-4">
								<div className="space-y-3">
									<div>
										<h3 className="font-medium truncate">{item.fileName}</h3>
										<p className="text-sm text-muted-foreground">
											{formatFileSize(item.fileSize)}
										</p>
									</div>

									<div className="flex items-center space-x-2">
										<Badge variant="outline" className="rounded-lg text-xs">
											{item.mimeType}
										</Badge>
										{attachedPost && (
											<Badge variant="secondary" className="rounded-lg text-xs">
												<Link className="w-3 h-3 mr-1" />
												{attachedPost.title.substring(0, 15)}...
											</Badge>
										)}
									</div>

									<div className="flex items-center justify-between">
										<span className="text-xs text-muted-foreground">
											{item.createdAt.toLocaleDateString()}
										</span>

										<AlertDialog>
											<AlertDialogTrigger asChild>
												<Button
													variant="outline"
													size="sm"
													className="h-8 w-8 p-0 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
												>
													<Trash2 className="h-3 w-3" />
												</Button>
											</AlertDialogTrigger>
											<AlertDialogContent className="rounded-xl">
												<AlertDialogHeader>
													<AlertDialogTitle>Delete Media</AlertDialogTitle>
													<AlertDialogDescription>
														Are you sure you want to delete "{item.fileName}"?
														This action cannot be undone.
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel className="rounded-xl">
														Cancel
													</AlertDialogCancel>
													<AlertDialogAction
														onClick={() => handleDeleteMedia(item.id)}
														className="bg-red-600 hover:bg-red-700 rounded-xl"
													>
														Delete
													</AlertDialogAction>
												</AlertDialogFooter>
											</AlertDialogContent>
										</AlertDialog>
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{media.length === 0 && (
				<Card className="rounded-xl">
					<CardContent className="flex flex-col items-center justify-center py-12">
						<Upload className="h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="text-lg font-medium mb-2">No media files yet</h3>
						<p className="text-muted-foreground text-center mb-4">
							Upload your first media file to get started with content
							management.
						</p>
						<Button
							onClick={handleOpenAddDialog}
							className="bg-blue-600 hover:bg-blue-700 rounded-xl"
						>
							<Plus className="mr-2 h-4 w-4" />
							Add First Media
						</Button>
					</CardContent>
				</Card>
			)}

			<div className="grid gap-4 md:grid-cols-4">
				<Card className="rounded-xl">
					<CardContent className="p-6">
						<div className="flex items-center space-x-2">
							<Image className="h-5 w-5 text-blue-600" />
							<div>
								<p className="text-2xl font-bold">
									{media.filter((m) => m.mimeType.startsWith("image/")).length}
								</p>
								<p className="text-sm text-muted-foreground">Images</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-xl">
					<CardContent className="p-6">
						<div className="flex items-center space-x-2">
							<FileText className="h-5 w-5 text-green-600" />
							<div>
								<p className="text-2xl font-bold">
									{media.filter((m) => !m.mimeType.startsWith("image/")).length}
								</p>
								<p className="text-sm text-muted-foreground">Documents</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-xl">
					<CardContent className="p-6">
						<div className="flex items-center space-x-2">
							<Link className="h-5 w-5 text-purple-600" />
							<div>
								<p className="text-2xl font-bold">
									{media.filter((m) => m.blogPostId).length}
								</p>
								<p className="text-sm text-muted-foreground">Attached</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-xl">
					<CardContent className="p-6">
						<div className="flex items-center space-x-2">
							<Upload className="h-5 w-5 text-orange-600" />
							<div>
								<p className="text-2xl font-bold">{media.length}</p>
								<p className="text-sm text-muted-foreground">Total Files</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
