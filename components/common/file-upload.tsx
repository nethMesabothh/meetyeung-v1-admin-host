import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, Image, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
	label?: string;
	value?: string;
	onChange: (file: File | null, url?: string) => void;
	accept?: Record<string, string[]>;
	maxSize?: number;
	error?: string;
	className?: string;
}

export function FileUpload({
	label,
	value,
	onChange,
	accept = { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
	maxSize = 5 * 1024 * 1024, // 5MB
	error,
	className,
}: FileUploadProps) {
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
					setDragError("Invalid file type. Please upload an image file");
				} else {
					setDragError("Invalid file");
				}
				return;
			}

			if (acceptedFiles.length > 0) {
				const file = acceptedFiles[0];
				const url = URL.createObjectURL(file);
				onChange(file, url);
			}
		},
		[onChange, maxSize]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept,
		maxSize,
		multiple: false,
	});

	const handleRemove = useCallback(() => {
		onChange(null);
		setDragError("");
	}, [onChange]);

	const displayError = error || dragError;

	return (
		<div className={cn("space-y-3", className)}>
			{label && (
				<Label className={cn(displayError && "text-destructive")}>
					{label}
				</Label>
			)}

			{value ? (
				<div className="relative">
					<div className="relative overflow-hidden rounded-lg border bg-muted/50">
						<img
							src={value}
							alt="Cover preview"
							className="w-full h-48 object-cover"
						/>
						<div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
							<Button
								type="button"
								variant="destructive"
								size="sm"
								onClick={handleRemove}
								className="gap-2"
							>
								<X className="w-4 h-4" />
								Remove
							</Button>
						</div>
					</div>
				</div>
			) : (
				<div
					{...getRootProps()}
					className={cn(
						"border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
						isDragActive
							? "border-primary bg-primary/10"
							: "border-muted-foreground/25 hover:border-primary/50",
						displayError && "border-destructive"
					)}
				>
					<input {...getInputProps()} />
					<div className="flex flex-col items-center gap-3">
						<div className="p-3 rounded-full bg-muted">
							{isDragActive ? (
								<Upload className="w-6 h-6 text-primary" />
							) : (
								<Image className="w-6 h-6 text-muted-foreground" />
							)}
						</div>
						<div>
							<p className="font-medium">
								{isDragActive
									? "Drop the image here"
									: "Drop image here, or click to browse"}
							</p>
							<p className="text-sm text-muted-foreground">
								PNG, JPG, WebP up to {Math.round(maxSize / 1024 / 1024)}MB
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
