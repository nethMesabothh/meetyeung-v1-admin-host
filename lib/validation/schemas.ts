import { z } from "zod";

// Common validation schemas
export const idSchema = z.string().uuid("Invalid ID format");

export const emailSchema = z
	.string()
	.email("Invalid email address")
	.min(1, "Email is required");

export const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.regex(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
		"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
	);

// Blog post validation
export const blogPostSchema = z.object({
	title: z
		.string()
		.min(1, "Title is required")
		.max(200, "Title must be less than 200 characters"),
	content: z.string().min(1, "Content is required"),
	categoryId: idSchema,
	isFeatured: z.boolean().default(false),
	publishedAt: z.date().optional().nullable(),
	coverImageId: idSchema.optional().nullable(),
	mediaIds: z.array(idSchema).default([]),
});

export const blogPostUpdateSchema = blogPostSchema.partial();

// Category validation
export const categorySchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be less than 100 characters"),
	description: z
		.string()
		.max(500, "Description must be less than 500 characters")
		.optional()
		.nullable(),
	parentId: idSchema.optional().nullable(),
});

export const categoryUpdateSchema = categorySchema.partial();

// User validation
export const userSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be less than 100 characters"),
	email: emailSchema,
	role: z.enum(["admin", "editor", "user"]).default("user"),
	permissions: z.array(z.string()).default([]),
});

export const userUpdateSchema = userSchema.partial();

export const userCreateSchema = userSchema.extend({
	password: passwordSchema,
});

// Media validation
export const mediaSchema = z.object({
	fileName: z.string().min(1, "File name is required"),
	fileSize: z.number().positive("File size must be positive"),
	mimeType: z.string().min(1, "MIME type is required"),
	altText: z.string().optional().nullable(),
	url: z.string().url("Invalid URL format"),
});

// Comment validation
export const commentSchema = z.object({
	content: z
		.string()
		.min(1, "Comment content is required")
		.max(1000, "Comment must be less than 1000 characters"),
	authorName: z
		.string()
		.min(1, "Author name is required")
		.max(100, "Author name must be less than 100 characters"),
	authorEmail: emailSchema,
	blogPostId: idSchema,
	isApproved: z.boolean().default(false),
});

// Banner validation
export const bannerSchema = z.object({
	imageId: idSchema,
	order: z.number().int().positive("Order must be a positive integer"),
});

// Authentication validation
export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: emailSchema,
	password: passwordSchema,
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"],
});

// Settings validation
export const settingsSchema = z.object({
	siteName: z.string().min(1, "Site name is required"),
	siteDescription: z.string().optional(),
	siteUrl: z.string().url("Invalid URL format").optional(),
	emailNotifications: z.boolean().default(true),
	pushNotifications: z.boolean().default(false),
	marketingEmails: z.boolean().default(false),
});

// Bulk operations validation
export const bulkDeleteSchema = z.object({
	ids: z.array(idSchema).min(1, "At least one ID is required"),
});

export const bulkUpdateSchema = z.object({
	ids: z.array(idSchema).min(1, "At least one ID is required"),
	updates: z.record(z.any()),
});

// Search and filter validation
export const searchSchema = z.object({
	query: z.string().optional(),
	category: idSchema.optional(),
	status: z.enum(["published", "draft", "all"]).default("all"),
	sortBy: z.enum(["createdAt", "updatedAt", "title", "publishedAt"]).default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
	page: z.number().int().positive().default(1),
	limit: z.number().int().positive().max(100).default(10),
});

// Validation helper functions
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
	const result = schema.safeParse(data);
	if (!result.success) {
		throw new Error(`Validation failed: ${result.error.message}`);
	}
	return result.data;
}

export function getValidationErrors<T>(
	schema: z.ZodSchema<T>,
	data: unknown
): Record<string, string> | null {
	const result = schema.safeParse(data);
	if (result.success) return null;

	const errors: Record<string, string> = {};
	result.error.errors.forEach((error) => {
		const path = error.path.join(".");
		errors[path] = error.message;
	});
	return errors;
}

// Type exports
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type MediaInput = z.infer<typeof mediaSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type BannerInput = z.infer<typeof bannerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type SearchInput = z.infer<typeof searchSchema>;