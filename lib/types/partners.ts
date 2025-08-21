export interface IPartnerMedia {
	id: string;
	url: string;
	altText?: string | null;
}

export interface IPartnerResponse {
	id: string;
	order: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	media: IPartnerMedia | null;
}
