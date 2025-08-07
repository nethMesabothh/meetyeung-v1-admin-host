// components/banner-management/add-banner-dialog.tsx
import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, UploadCloud, X, Loader2 } from "lucide-react";

interface AddBannerDialogProps {
	onBannerAdd: (file: File) => Promise<void>;
}

export function AddBannerDialog({ onBannerAdd }: AddBannerDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (selectedFile) {
			setFile(selectedFile);
			setPreviewUrl(URL.createObjectURL(selectedFile));
		}
	};

	const handleRemovePreview = () => {
		setFile(null);
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);
		}
	};

	const handleSubmit = async () => {
		if (!file) return;
		setIsUploading(true);
		await onBannerAdd(file);
		// Cleanup and close
		handleRemovePreview();
		setIsUploading(false);
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className="bg-blue-600 hover:bg-blue-700">
					<Plus className="mr-2 h-4 w-4" />
					Add Banner
				</Button>
			</DialogTrigger>
			<DialogContent className="rounded-xl">
				<DialogHeader>
					<DialogTitle>Add New Banner</DialogTitle>
				</DialogHeader>
				<div className="space-y-4 py-2">
					{!previewUrl ? (
						<div className="flex items-center justify-center w-full">
							<Label
								htmlFor="picture"
								className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
							>
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									<UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
									<p className="mb-2 text-sm text-muted-foreground">
										<span className="font-semibold">Click to upload</span> or
										drag and drop
									</p>
									<p className="text-xs text-muted-foreground">
										PNG, JPG, or WEBP (MAX. 5MB)
									</p>
								</div>
								<Input
									id="picture"
									type="file"
									className="hidden"
									accept="image/png, image/jpeg, image/webp"
									onChange={handleFileChange}
								/>
							</Label>
						</div>
					) : (
						<div className="space-y-2">
							<Label>Preview</Label>
							<div className="relative rounded-xl overflow-hidden border">
								<img
									src={previewUrl}
									alt="Banner preview"
									className="w-full h-48 object-cover"
								/>
								<Button
									size="icon"
									variant="destructive"
									className="absolute top-2 right-2 h-7 w-7 rounded-full"
									onClick={handleRemovePreview}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}
				</div>
				<div className="flex justify-end space-x-2">
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
						className="bg-blue-600 hover:bg-blue-700 rounded-xl"
						disabled={!file || isUploading}
					>
						{isUploading ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : null}
						Add Banner
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
