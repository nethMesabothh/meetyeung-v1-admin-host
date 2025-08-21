export type LocalizedField = Record<string, string>;

export interface Category {
	id: string;
	name: LocalizedField;
	description?: LocalizedField | null;
	isActive: boolean;
	parentId?: string | null;
	createdAt: Date;
}

export interface CategoryNode extends Category {
	subCategories: CategoryNode[];
}
