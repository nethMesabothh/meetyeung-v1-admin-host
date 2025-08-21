// components/common/add-item-dialog.tsx

"use client";

import { useState, ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, UploadCloud, X, Loader2 } from "lucide-react";

interface AddItemDialogProps {
	onItemAdd: (file: File) => Promise<void>;

	dialogTitle: string;
	triggerButtonText: string;
	submitButtonText: string;
	fileTypeDescription: string;
	acceptedFileTypes: string;
}

export function AddItemDialog({
	onItemAdd,
	dialogTitle,
	triggerButtonText,
	submitButtonText,
	fileTypeDescription,
	acceptedFileTypes,
}: AddItemDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			setPreviewUrl(URL.createObjectURL(selectedFile));
		}
	};

	const cleanup = () => {
		setFile(null);
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);
		}
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const handleSubmit = async () => {
		if (!file) return;
		setIsUploading(true);
		try {
			await onItemAdd(file);
			setIsOpen(false); // Close on success
		} catch (error) {
			console.error("Failed to add item:", error);
			// Optionally show an error toast here
		} finally {
			setIsUploading(false);
		}
	};

	// When the dialog closes, always run cleanup
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			cleanup();
		}
		setIsOpen(open);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					{triggerButtonText}
				</Button>
			</DialogTrigger>
			<DialogContent className="rounded-xl">
				<DialogHeader>
					<DialogTitle>{dialogTitle}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-2">
					{!previewUrl ? (
						<div className="flex items-center justify-center w-full">
							<Label
								htmlFor="picture-upload"
								className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
							>
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									<UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
									<p className="mb-2 text-sm text-muted-foreground">
										<span className="font-semibold">Click to upload</span> or
										drag and drop
									</p>
									<p className="text-xs text-muted-foreground">
										{fileTypeDescription}
									</p>
								</div>
								<Input
									id="picture-upload"
									type="file"
									className="hidden"
									accept={acceptedFileTypes}
									onChange={handleFileChange}
									ref={inputRef}
								/>
							</Label>
						</div>
					) : (
						<div className="space-y-2">
							<Label>Preview</Label>
							<div className="relative rounded-xl overflow-hidden border">
								<img
									src={previewUrl}
									alt="File preview"
									className="w-full h-48 object-cover"
								/>
								<Button
									size="icon"
									variant="destructive"
									className="absolute top-2 right-2 h-7 w-7 rounded-full"
									onClick={cleanup}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsOpen(false)}
						className="rounded-xl"
						disabled={isUploading}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						className="rounded-xl"
						disabled={!file || isUploading}
					>
						{isUploading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : null}
						{submitButtonText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
