// Abstract base service for API operations
export abstract class BaseService<T extends { id: string }> {
	protected baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	protected async request<R = T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<R> {
		const url = `${this.baseUrl}${endpoint}`;
		const config: RequestInit = {
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			...options,
		};

		try {
			const response = await fetch(url, config);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return await response.json();
		} catch (error) {
			console.error(`API request failed: ${url}`, error);
			throw error;
		}
	}

	abstract getAll(params?: Record<string, any>): Promise<T[]>;
	abstract getById(id: string): Promise<T>;
	abstract create(data: Omit<T, "id">): Promise<T>;
	abstract update(id: string, data: Partial<T>): Promise<T>;
	abstract delete(id: string): Promise<void>;
}

// Example implementation for blog posts
export class BlogPostService extends BaseService<any> {
	constructor() {
		super("/api/blog-posts");
	}

	async getAll(params?: Record<string, any>): Promise<any[]> {
		const searchParams = new URLSearchParams(params);
		return this.request(`?${searchParams}`);
	}

	async getById(id: string): Promise<any> {
		return this.request(`/${id}`);
	}

	async create(data: Omit<any, "id">): Promise<any> {
		return this.request("", {
			method: "POST",
			body: JSON.stringify(data),
		});
	}

	async update(id: string, data: Partial<any>): Promise<any> {
		return this.request(`/${id}`, {
			method: "PATCH",
			body: JSON.stringify(data),
		});
	}

	async delete(id: string): Promise<void> {
		await this.request(`/${id}`, {
			method: "DELETE",
		});
	}

	// Blog-specific methods
	async publish(id: string): Promise<any> {
		return this.request(`/${id}/publish`, {
			method: "POST",
		});
	}

	async unpublish(id: string): Promise<any> {
		return this.request(`/${id}/unpublish`, {
			method: "POST",
		});
	}

	async bulkDelete(ids: string[]): Promise<void> {
		await this.request("/bulk-delete", {
			method: "POST",
			body: JSON.stringify({ ids }),
		});
	}
}

// Service instances
export const blogPostService = new BlogPostService();