"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";

export function CoverImageCard({
	coverImage,
	dispatch,
}: {
	coverImage: { file: File | null; preview: string | null };
	dispatch: React.Dispatch<any>;
}) {
	const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const preview = URL.createObjectURL(file);
			dispatch({ type: "SET_COVER_IMAGE", payload: { file, preview } });
		}
	};

	const handleRemoveImage = () => {
		if (coverImage.preview?.startsWith("blob:")) {
			URL.revokeObjectURL(coverImage.preview);
		}
		dispatch({
			type: "SET_COVER_IMAGE",
			payload: { file: null, preview: null },
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Cover Image</CardTitle>
			</CardHeader>
			<CardContent>
				{coverImage.preview ? (
					<div className="relative">
						<img
							src={coverImage.preview}
							alt="Cover preview"
							className="rounded-md w-full h-40 object-cover"
						/>
						<Button
							size="icon"
							variant="destructive"
							className="absolute top-2 right-2 h-7 w-7 rounded-full"
							onClick={handleRemoveImage}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				) : (
					<Label
						htmlFor="cover-image-upload"
						className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
					>
						<UploadCloud className="w-8 h-8 text-muted-foreground" />
						<p className="text-sm text-muted-foreground">
							Click or drag to upload
						</p>
						<Input
							id="cover-image-upload"
							type="file"
							className="hidden"
							onChange={handleCoverImageChange}
							accept="image/*"
						/>
					</Label>
				)}
			</CardContent>
		</Card>
	);
}
