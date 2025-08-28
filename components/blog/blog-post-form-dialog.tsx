"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Loader2,
	AlertCircle,
	Eye,
	ImageIcon,
	Folder,
	Clock,
	FileText,
	X,
	Calendar,
	User,
	Tag,
	ArrowLeft,
	CheckCircle,
} from "lucide-react";
import type { BlogPost, Author, Category } from "@/lib/types/blog";
import {
	DEFAULT_LANGUAGE_CODE,
	SUPPORTED_LANGUAGES,
} from "@/lib/types/languages";
import { MultilingualInput } from "@/components/common/multilingual-input";
import { MultilingualRichTextEditor } from "@/components/common/multilingual-rich-text-editor";
import { FileUpload } from "@/components/common/file-upload";
import { ImageGalleryUpload } from "@/components/common/image-gallery-upload";
import type { LocalizedField } from "@/lib/types/category";
import { BlogStorageService } from "../services/blog-storage";

interface BlogPostFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave?: (postData: BlogPost) => void;
	initialData?: BlogPost | null;
	mode: "create" | "edit";
	availableAuthors: Author[];
	availableCategories: Category[];
}

const statusOptions = [
	{ value: "draft", label: "Draft", icon: FileText },
	{ value: "published", label: "Published", icon: Eye },
	{ value: "scheduled", label: "Scheduled", icon: Clock },
	{ value: "archived", label: "Archived", icon: Folder },
];

export function BlogPostFormDialog({
	open,
	onOpenChange,
	onSave,
	initialData,
	mode,
	availableAuthors,
	availableCategories,
}: BlogPostFormDialogProps) {
	// Form state
	const [title, setTitle] = useState<LocalizedField>({});
	const [content, setContent] = useState<LocalizedField>({});
	const [excerpt, setExcerpt] = useState<LocalizedField>({});
	const [coverImageUrl, setCoverImageUrl] = useState<string>("");
	const [galleryImages, setGalleryImages] = useState<string[]>([]);
	const [authorId, setAuthorId] = useState<string>("");
	const [categoryId, setCategoryId] = useState<string>("");
	const [status, setStatus] = useState<BlogPost["status"]>("draft");
	const [isFeatured, setIsFeatured] = useState(false);
	const [publishedAt, setPublishedAt] = useState<Date | undefined>();
	const [readTimes, setReadTimes] = useState<number>(5);
	const [tags, setTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState("");
	const [activeLanguage, setActiveLanguage] = useState(DEFAULT_LANGUAGE_CODE);

	// UI state
	const [isSaving, setIsSaving] = useState(false);
	const [errors, setErrors] = useState<Record<string, any>>({});
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [activeTab, setActiveTab] = useState("content");
	const [previewLanguage, setPreviewLanguage] = useState(DEFAULT_LANGUAGE_CODE);

	const isEditMode = mode === "edit";
	const dialogTitle = isEditMode ? "Edit Blog Post" : "Create New Blog Post";
	const saveButtonText = isEditMode ? "Update Post" : "Create Post";

	// Reset form when dialog opens
	useEffect(() => {
		if (open) {
			if (initialData) {
				setTitle(initialData.title || {});
				setContent(initialData.content || {});
				setExcerpt(initialData.excerpt || {});
				setCoverImageUrl(initialData.coverImageUrl || "");
				setGalleryImages(initialData.galleryImages || []);
				setAuthorId(initialData.authorId || "");
				setCategoryId(initialData.categoryId || "");
				setStatus(initialData.status || "draft");
				setIsFeatured(initialData.isFeatured || false);
				setPublishedAt(initialData.publishedAt);
				setReadTimes(initialData.readTimes || 5);
				setTags(initialData.tags || []);
			} else {
				setTitle({});
				setContent({});
				setExcerpt({});
				setCoverImageUrl("");
				setGalleryImages([]);
				setAuthorId("");
				setCategoryId("");
				setStatus("draft");
				setIsFeatured(false);
				setPublishedAt(undefined);
				setReadTimes(5);
				setTags([]);
			}
			setErrors({});
			setHasUnsavedChanges(false);
			setNewTag("");
		}
	}, [open, initialData]);

	// Validation logic
	const validationErrors = useMemo(() => {
		const errs: Record<string, any> = {};
		const nameErrs: Record<string, string> = {};
		SUPPORTED_LANGUAGES.forEach((lang) => {
			if (!title[lang.code]?.trim())
				nameErrs[lang.code] = `Title in ${lang.nativeName} is required.`;
		});
		if (Object.keys(nameErrs).length > 0) errs.title = nameErrs;
		if (!authorId) errs.author = "Author is required";
		if (!categoryId) errs.category = "Category is required";
		if (status === "scheduled" && (!publishedAt || publishedAt <= new Date())) {
			errs.publishedAt = "Scheduled posts must have a future publish date";
		}
		return errs;
	}, [title, authorId, categoryId, status, publishedAt]);

	const isSaveDisabled = Object.keys(validationErrors).length > 0 || isSaving;

	const handleSave = useCallback(async () => {
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		setIsSaving(true);
		setErrors({});
		try {
			const postData: BlogPost = {
				id: initialData?.id || Date.now().toString(),
				title,
				content,
				excerpt,
				coverImageUrl: coverImageUrl || undefined,
				galleryImages,
				authorId,
				author: availableAuthors.find((a) => a.id === authorId),
				categoryId,
				category: availableCategories.find((c) => c.id === categoryId),
				status,
				isFeatured,
				publishedAt:
					status === "published" && !initialData?.publishedAt
						? new Date()
						: publishedAt,
				readTimes,
				tags,
				readCounts: 0,
				commentsCount: 0,
				createdAt: initialData?.createdAt || new Date(),
				updatedAt: new Date(),
			};

			BlogStorageService.saveBlogPost(postData);

			onSave?.(postData);

			setErrors({ success: "Blog post saved successfully!" });
			setTimeout(() => {
				onOpenChange(false);
			}, 1000);
		} catch (error) {
			setErrors({
				submit: error instanceof Error ? error.message : "Failed to save post",
			});
		} finally {
			setIsSaving(false);
		}
	}, [
		validationErrors,
		onSave,
		initialData,
		title,
		content,
		excerpt,
		coverImageUrl,
		galleryImages,
		authorId,
		categoryId,
		status,
		isFeatured,
		publishedAt,
		readTimes,
		tags,
		availableAuthors,
		availableCategories,
		onOpenChange,
	]);

	const addTag = useCallback(() => {
		if (newTag.trim() && !tags.includes(newTag.trim())) {
			setTags([...tags, newTag.trim()]);
			setNewTag("");
		}
	}, [newTag, tags]);

	const removeTag = useCallback(
		(tag: string) => {
			setTags(tags.filter((t) => t !== tag));
		},
		[tags]
	);

	const handleCoverImageChange = useCallback(
		(file: File | null, url?: string) => {
			setCoverImageUrl(url || "");
		},
		[]
	);

	const currentAuthor = useMemo(
		() => availableAuthors.find((a) => a.id === authorId),
		[availableAuthors, authorId]
	);

	const currentCategory = useMemo(
		() => availableCategories.find((c) => c.id === categoryId),
		[availableCategories, categoryId]
	);

	const renderPreviewContent = useCallback((htmlContent: string) => {
		return { __html: htmlContent };
	}, []);

	const calculateReadTime = useCallback((content: LocalizedField) => {
		const allContent = Object.values(content).join(" ");
		const wordCount = allContent
			.trim()
			.split(/\s+/)
			.filter((word) => word.length > 0).length;
		const wordsPerMinute = 200; // Average reading speed
		return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
	}, []);

	useEffect(() => {
		const calculatedReadTime = calculateReadTime(content);
		if (calculatedReadTime !== readTimes) {
			setReadTimes(calculatedReadTime);
		}
	}, [content, readTimes, calculateReadTime]);

	useEffect(() => {
		setPreviewLanguage(activeLanguage);
	}, [activeLanguage]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 bg-background">
			{/* Header Bar */}
			<div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
				<div className="flex items-center justify-between px-4 sm:px-6 py-4">
					<div className="flex items-center gap-3 sm:gap-4">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onOpenChange(false)}
							className="flex items-center gap-2"
						>
							<ArrowLeft className="h-4 w-4" />
							<span className="hidden sm:inline">Back</span>
						</Button>
						<div className="flex items-center gap-2">
							<FileText className="h-5 w-5" />
							<h1 className="text-lg sm:text-xl font-semibold truncate">
								{dialogTitle}
							</h1>
						</div>
					</div>
					<div className="flex items-center gap-2 sm:gap-3">
						<Button
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="hidden sm:inline-flex"
						>
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							disabled={isSaveDisabled}
							size="sm"
							className="sm:size-default"
						>
							{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							<span className="hidden sm:inline">{saveButtonText}</span>
							<span className="sm:hidden">Save</span>
						</Button>
					</div>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
				{/* Left Panel - Form */}
				<div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-border overflow-y-auto">
					<div className="p-4 sm:p-6 space-y-6">
						{errors.success && (
							<Alert className="border-green-200 bg-green-50 text-green-800">
								<CheckCircle className="h-4 w-4" />
								<AlertDescription>{errors.success}</AlertDescription>
							</Alert>
						)}
						{errors.submit && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{errors.submit}</AlertDescription>
							</Alert>
						)}

						<Tabs value={activeTab} onValueChange={setActiveTab}>
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="content">Content</TabsTrigger>
								<TabsTrigger value="media">Media</TabsTrigger>
								<TabsTrigger value="settings">Settings</TabsTrigger>
							</TabsList>

							<TabsContent value="content" className="space-y-6 pt-6">
								<Card>
									<CardHeader>
										<CardTitle>Post Content</CardTitle>
										<CardDescription>
											Create engaging content for your blog post
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<MultilingualInput
											label="Post Title *"
											value={title}
											onChange={setTitle}
											errors={errors.title}
											activeLanguage={activeLanguage}
											onLanguageChange={setActiveLanguage}
										/>
										<MultilingualInput
											label="Excerpt"
											value={excerpt}
											onChange={setExcerpt}
											as="textarea"
											activeLanguage={activeLanguage}
											onLanguageChange={setActiveLanguage}
										/>
										<MultilingualRichTextEditor
											label="Main Content"
											value={content}
											onChange={setContent}
											activeLanguage={activeLanguage}
											onLanguageChange={setActiveLanguage}
										/>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Media Tab */}
							<TabsContent value="media" className="space-y-6 pt-6">
								<div className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle className="flex items-center gap-2">
												<ImageIcon className="h-5 w-5" />
												Cover Image
											</CardTitle>
											<CardDescription>
												Upload a cover image for your blog post
											</CardDescription>
										</CardHeader>
										<CardContent>
											<FileUpload
												value={coverImageUrl}
												onChange={handleCoverImageChange}
												accept={{
													"image/*": [".jpeg", ".jpg", ".png", ".webp"],
												}}
												maxSize={5 * 1024 * 1024}
											/>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle>Image Gallery</CardTitle>
											<CardDescription>
												Add up to 20 images to create a gallery for your post
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ImageGalleryUpload
												images={galleryImages}
												onChange={setGalleryImages}
												maxImages={20}
												maxSize={5 * 1024 * 1024}
											/>
										</CardContent>
									</Card>
								</div>
							</TabsContent>

							{/* Settings Tab */}
							<TabsContent value="settings" className="space-y-6 pt-6">
								<div className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle>Publication</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div>
												<Label>Status *</Label>
												<Select
													value={status}
													onValueChange={(v) =>
														setStatus(v as BlogPost["status"])
													}
												>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{statusOptions.map((o) => (
															<SelectItem key={o.value} value={o.value}>
																<div className="flex items-center gap-2">
																	<o.icon className="h-4 w-4" />
																	{o.label}
																</div>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											{status === "scheduled" && (
												<div>
													<Label>Publish Date *</Label>
													<Input
														type="datetime-local"
														value={
															publishedAt?.toISOString().slice(0, 16) || ""
														}
														onChange={(e) =>
															setPublishedAt(
																e.target.value
																	? new Date(e.target.value)
																	: undefined
															)
														}
													/>
													{errors.publishedAt && (
														<p className="text-sm text-destructive mt-1">
															{errors.publishedAt}
														</p>
													)}
												</div>
											)}
											<div className="flex items-center justify-between pt-2">
												<div>
													<Label>Featured Post</Label>
													<p className="text-xs text-muted-foreground">
														Highlight this post
													</p>
												</div>
												<Switch
													checked={isFeatured}
													onCheckedChange={setIsFeatured}
												/>
											</div>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle>Organization</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											<div>
												<Label>Author *</Label>
												<Select value={authorId} onValueChange={setAuthorId}>
													<SelectTrigger>
														<SelectValue placeholder="Select author" />
													</SelectTrigger>
													<SelectContent>
														{availableAuthors.map((a) => (
															<SelectItem key={a.id} value={a.id}>
																{a.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												{errors.author && (
													<p className="text-sm text-destructive mt-1">
														{errors.author}
													</p>
												)}
											</div>
											<div>
												<Label>Category *</Label>
												<Select
													value={categoryId}
													onValueChange={setCategoryId}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select category" />
													</SelectTrigger>
													<SelectContent>
														{availableCategories.map((c) => (
															<SelectItem key={c.id} value={c.id}>
																{c.name[DEFAULT_LANGUAGE_CODE]}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												{errors.category && (
													<p className="text-sm text-destructive mt-1">
														{errors.category}
													</p>
												)}
											</div>

											<div className="space-y-3">
												<Label>Tags</Label>
												<div className="flex gap-2">
													<Input
														value={newTag}
														onChange={(e) => setNewTag(e.target.value)}
														placeholder="Add a tag"
														onKeyPress={(e) => {
															if (e.key === "Enter") {
																e.preventDefault();
																addTag();
															}
														}}
													/>
													<Button type="button" onClick={addTag} size="sm">
														Add
													</Button>
												</div>
												{tags.length > 0 && (
													<div className="flex flex-wrap gap-2">
														{tags.map((tag) => (
															<Badge
																key={tag}
																variant="secondary"
																className="gap-1"
															>
																{tag}
																<button
																	type="button"
																	onClick={() => removeTag(tag)}
																	className="ml-1 hover:text-destructive"
																>
																	<X className="h-3 w-3" />
																</button>
															</Badge>
														))}
													</div>
												)}
											</div>
										</CardContent>
									</Card>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</div>

				{/* Right Panel - Preview */}
				<div className="w-full lg:w-1/2 overflow-y-auto bg-muted/30">
					<div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
						<div className="flex items-center justify-between px-4 sm:px-6 py-4">
							<div className="flex items-center gap-2">
								<Eye className="h-5 w-5" />
								<h2 className="text-base sm:text-lg font-semibold">
									Live Preview
								</h2>
							</div>
							<div className="flex items-center gap-2">
								<Label
									htmlFor="preview-language"
									className="text-sm hidden sm:inline"
								>
									Language:
								</Label>
								<Select
									value={activeLanguage}
									onValueChange={setActiveLanguage}
								>
									<SelectTrigger className="w-32 sm:w-40">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{SUPPORTED_LANGUAGES.map((lang) => (
											<SelectItem key={lang.code} value={lang.code}>
												<span className="flex items-center gap-2">
													<span className="text-xs">{lang.flag}</span>
													<span className="hidden sm:inline">
														{lang.nativeName}
													</span>
													<span className="sm:hidden">
														{lang.code.toUpperCase()}
													</span>
												</span>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					<div className="p-4 sm:p-6">
						<article className="bg-background border rounded-xl shadow-sm overflow-hidden">
							{coverImageUrl && (
								<header className="relative">
									<div className="aspect-[16/9] w-full overflow-hidden">
										<img
											src={coverImageUrl || "/placeholder.svg"}
											alt="Cover image"
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
								</header>
							)}

							<div className="px-4 sm:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
								<header className="space-y-4 sm:space-y-6">
									<div className="flex flex-wrap items-center gap-3 sm:gap-6">
										<Badge
											variant={
												status === "published"
													? "default"
													: status === "draft"
													? "secondary"
													: "outline"
											}
											className="capitalize text-sm"
										>
											{statusOptions.find((s) => s.value === status)?.label ||
												status}
										</Badge>
										{isFeatured && (
											<Badge
												variant="outline"
												className="text-amber-600 border-amber-600 bg-amber-50"
											>
												⭐ Featured
											</Badge>
										)}
									</div>

									<div className="space-y-4">
										<h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-balance leading-tight tracking-tight">
											{title[activeLanguage] ||
												`[Title in ${
													SUPPORTED_LANGUAGES.find(
														(l) => l.code === activeLanguage
													)?.nativeName
												}]`}
										</h1>

										{excerpt[activeLanguage] && (
											<p className="text-lg sm:text-xl text-muted-foreground text-pretty leading-relaxed">
												{excerpt[activeLanguage]}
											</p>
										)}
									</div>

									<div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground border-b border-border pb-4 sm:pb-6">
										{currentAuthor && (
											<div className="flex items-center gap-2">
												<div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
													<User className="h-4 w-4" />
												</div>
												<div>
													<span className="font-medium text-foreground">
														{currentAuthor.name}
													</span>
													<p className="text-xs">Author</p>
												</div>
											</div>
										)}
										{currentCategory && (
											<div className="flex items-center gap-2">
												<Folder className="h-4 w-4" />
												<span className="font-medium">
													{currentCategory.name[activeLanguage] ||
														currentCategory.name[DEFAULT_LANGUAGE_CODE]}
												</span>
											</div>
										)}
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4" />
											<span>
												{publishedAt
													? publishedAt.toLocaleDateString("en-US", {
															year: "numeric",
															month: "long",
															day: "numeric",
													  })
													: new Date().toLocaleDateString("en-US", {
															year: "numeric",
															month: "long",
															day: "numeric",
													  })}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4" />
											<span>{readTimes} min read</span>
										</div>
									</div>
								</header>

								<main className="space-y-6 sm:space-y-8">
									<div className="prose prose-sm sm:prose-lg prose-slate max-w-none dark:prose-invert">
										{content[activeLanguage] ? (
											<div
												dangerouslySetInnerHTML={renderPreviewContent(
													content[activeLanguage]
												)}
												className="leading-relaxed [&>*]:mb-4 sm:[&>*]:mb-6 [&>h1]:text-2xl sm:[&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mt-8 sm:[&>h1]:mt-12 [&>h1]:mb-4 sm:[&>h1]:mb-6 [&>h2]:text-xl sm:[&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-6 sm:[&>h2]:mt-10 [&>h2]:mb-3 sm:[&>h2]:mb-4 [&>h3]:text-lg sm:[&>h3]:text-xl [&>h3]:font-medium [&>h3]:mt-4 sm:[&>h3]:mt-8 [&>h3]:mb-2 sm:[&>h3]:mb-3 [&>p]:text-sm sm:[&>p]:text-base [&>p]:leading-6 sm:[&>p]:leading-7 [&>ul]:space-y-1 sm:[&>ul]:space-y-2 [&>ol]:space-y-1 sm:[&>ol]:space-y-2 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 sm:[&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-muted-foreground"
											/>
										) : (
											<div className="text-center py-12 sm:py-16 text-muted-foreground">
												<FileText className="h-12 sm:h-16 w-12 sm:w-16 mx-auto mb-4 sm:mb-6 opacity-50" />
												<p className="text-lg sm:text-xl italic mb-2">
													Content in{" "}
													{
														SUPPORTED_LANGUAGES.find(
															(l) => l.code === activeLanguage
														)?.nativeName
													}{" "}
													will appear here
												</p>
												<p className="text-sm">
													Start writing in the Content tab to see your preview
												</p>
											</div>
										)}
									</div>

									{galleryImages.length > 0 && (
										<section className="space-y-6">
											<div className="border-t border-border pt-8">
												<h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
													<ImageIcon className="h-5 w-5" />
													Image Gallery
												</h2>
												<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
													{galleryImages.map((image, index) => (
														<div
															key={index}
															className="group relative aspect-square overflow-hidden rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-200"
														>
															<img
																src={image || "/placeholder.svg"}
																alt={`Gallery image ${index + 1}`}
																className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
															/>
															<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
														</div>
													))}
												</div>
											</div>
										</section>
									)}
								</main>

								{tags.length > 0 && (
									<footer className="border-t border-border pt-8">
										<div className="space-y-4">
											<div className="flex items-center gap-2">
												<Tag className="h-5 w-5 text-muted-foreground" />
												<h3 className="text-lg font-semibold">Tags</h3>
											</div>
											<div className="flex flex-wrap gap-2">
												{tags.map((tag) => (
													<Badge
														key={tag}
														variant="secondary"
														className="text-sm px-3 py-1 hover:bg-secondary/80 transition-colors"
													>
														#{tag}
													</Badge>
												))}
											</div>
										</div>
									</footer>
								)}
							</div>
						</article>
					</div>
				</div>
			</div>
		</div>
	);
}
