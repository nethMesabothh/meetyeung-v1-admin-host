export interface Banner {
	id: string;
	imageUrl: Media;
	isActive: boolean;
	order: number;
	createdAt: Date;
}

export interface Media {
	id: string;
	url: string;
	altText?: string | null;
	fileName?: string | null;
	fileSize?: number | null;
	mimeType?: string | null;
	createdAt?: Date | string;
}

export type ViewMode = "grid" | "row";
