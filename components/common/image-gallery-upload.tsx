"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, AlertCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryUploadProps {
	label?: string;
	images: string[];
	onChange: (images: string[]) => void;
	maxImages?: number;
	maxSize?: number;
	error?: string;
	className?: string;
}

export function ImageGalleryUpload({
	label = "Image Gallery",
	images,
	onChange,
	maxImages = 20,
	maxSize = 5 * 1024 * 1024, // 5MB
	error,
	className,
}: ImageGalleryUploadProps) {
	const [dragError, setDragError] = useState<string>("");

	const onDrop = useCallback(
		(acceptedFiles: File[], rejectedFiles: any[]) => {
			setDragError("");

			if (rejectedFiles.length > 0) {
				const rejection = rejectedFiles[0];
				if (rejection.errors?.some((e: any) => e.code === "file-too-large")) {
					setDragError(
						`File is too large. Maximum size is ${Math.round(
							maxSize / 1024 / 1024
						)}MB`
					);
				} else if (
					rejection.errors?.some((e: any) => e.code === "file-invalid-type")
				) {
					setDragError("Invalid file type. Please upload image files only");
				} else {
					setDragError("Invalid file");
				}
				return;
			}

			if (images.length + acceptedFiles.length > maxImages) {
				setDragError(`Maximum ${maxImages} images allowed`);
				return;
			}

			const newImageUrls = acceptedFiles.map((file) =>
				URL.createObjectURL(file)
			);
			onChange([...images, ...newImageUrls]);
		},
		[onChange, maxSize, images, maxImages]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
		maxSize,
		multiple: true,
	});

	const handleRemove = useCallback(
		(index: number) => {
			const newImages = images.filter((_, i) => i !== index);
			onChange(newImages);
			setDragError("");
		},
		[images, onChange]
	);

	const displayError = error || dragError;
	const canAddMore = images.length < maxImages;

	return (
		<div className={cn("space-y-4", className)}>
			{label && (
				<div className="flex items-center justify-between">
					<Label className={cn(displayError && "text-destructive")}>
						{label}
					</Label>
					<span className="text-xs text-muted-foreground">
						{images.length}/{maxImages} images
					</span>
				</div>
			)}

			{/* Image Grid */}
			{images.length > 0 && (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
					{images.map((imageUrl, index) => (
						<div key={index} className="relative group">
							<div className="aspect-square overflow-hidden rounded-lg border bg-muted">
								<img
									src={imageUrl || "/placeholder.svg"}
									alt={`Gallery image ${index + 1}`}
									className="w-full h-full object-cover"
								/>
								<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
									<Button
										type="button"
										variant="destructive"
										size="sm"
										onClick={() => handleRemove(index)}
										className="gap-1"
									>
										<X className="w-3 h-3" />
										Remove
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Upload Area */}
			{canAddMore && (
				<div
					{...getRootProps()}
					className={cn(
						"border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
						isDragActive
							? "border-primary bg-primary/10"
							: "border-muted-foreground/25 hover:border-primary/50",
						displayError && "border-destructive",
						images.length > 0 && "p-4"
					)}
				>
					<input {...getInputProps()} />
					<div className="flex flex-col items-center gap-2">
						<div className="p-2 rounded-full bg-muted">
							{isDragActive ? (
								<Upload className="w-5 h-5 text-primary" />
							) : (
								<Plus className="w-5 h-5 text-muted-foreground" />
							)}
						</div>
						<div>
							<p className="font-medium text-sm">
								{isDragActive
									? "Drop images here"
									: images.length > 0
									? "Add more images"
									: "Drop images here, or click to browse"}
							</p>
							<p className="text-xs text-muted-foreground">
								PNG, JPG, WebP up to {Math.round(maxSize / 1024 / 1024)}MB each
							</p>
						</div>
					</div>
				</div>
			)}

			{displayError && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{displayError}</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
