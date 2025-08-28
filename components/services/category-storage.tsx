import type { Category } from "@/lib/types/category";

export const mockCategories: Category[] = [
	{
		id: "cat_1",
		name: {
			en: "Technology",
			km: "បច្ចេកវិទ្យា",
			ko: "기술",
			th: "เทคโนโลยี",
		},
		description: {
			en: "All things related to technology and innovation",
			km: "អ្វីៗទាំងអស់ដែលទាក់ទងនឹងបច្ចេកវិទ្យានិងការច្នៃប្រឌិត",
			ko: "기술과 혁신에 관련된 모든 것",
			th: "ทุกสิ่งที่เกี่ยวข้องกับเทคโนโลยีและนวัตกรรม",
		},
		isActive: true,
		createdAt: new Date("2024-01-15"),
	},
	{
		id: "cat_2",
		name: {
			en: "Web Development",
			km: "ការអភិវឌ្ឍន៍គេហទំព័រ",
			ko: "웹 개발",
			th: "การพัฒนาเว็บ",
		},
		description: {
			en: "Frontend and backend web development topics",
			km: "ប្រធានបទអភិវឌ្ឍន៍គេហទំព័រផ្នែកមុខនិងផ្នែកក្រោយ",
			ko: "프론트엔드 및 백엔드 웹 개발 주제",
			th: "หัวข้อการพัฒนาเว็บส่วนหน้าและส่วนหลัง",
		},
		parentId: "cat_1",
		isActive: true,
		createdAt: new Date("2024-01-16"),
	},
	{
		id: "cat_3",
		name: {
			en: "Mobile Development",
			km: "ការអភិវឌ្ឍន៍ទូរស័ព្ទ",
			ko: "모바일 개발",
			th: "การพัฒนามือถือ",
		},
		description: {
			en: "iOS, Android, and cross-platform mobile development",
			km: "ការអភិវឌ្ឍន៍ទូរស័ព្ទ iOS, Android និងឆ្លងវេទិកា",
			ko: "iOS, Android 및 크로스 플랫폼 모바일 개발",
			th: "การพัฒนามือถือ iOS, Android และข้ามแพลตฟอร์ม",
		},
		parentId: "cat_1",
		isActive: true,
		createdAt: new Date("2024-01-17"),
	},
	{
		id: "cat_4",
		name: {
			en: "Business",
			km: "អាជីវកម្ម",
			ko: "비즈니스",
			th: "ธุรกิจ",
		},
		description: {
			en: "Business strategies, entrepreneurship, and management",
			km: "យុទ្ធសាស្ត្រអាជីវកម្ម ការធ្វើអាជីវកម្ម និងការគ្រប់គ្រង",
			ko: "비즈니스 전략, 기업가 정신 및 관리",
			th: "กลยุทธ์ทางธุรกิจ การเป็นผู้ประกอบการ และการจัดการ",
		},
		isActive: true,
		createdAt: new Date("2024-01-18"),
	},
	{
		id: "cat_5",
		name: {
			en: "Marketing",
			km: "ទីផ្សារ",
			ko: "마케팅",
			th: "การตลาด",
		},
		description: {
			en: "Digital marketing, SEO, and brand building",
			km: "ទីផ្សារឌីជីថល SEO និងការកសាងម៉ាក",
			ko: "디지털 마케팅, SEO 및 브랜드 구축",
			th: "การตลาดดิจิทัล SEO และการสร้างแบรนด์",
		},
		parentId: "cat_4",
		isActive: true,
		createdAt: new Date("2024-01-19"),
	},
	{
		id: "cat_6",
		name: {
			en: "Design",
			km: "ការរចនា",
			ko: "디자인",
			th: "การออกแบบ",
		},
		description: {
			en: "UI/UX design, graphic design, and creative processes",
			km: "ការរចនា UI/UX ការរចនាក្រាហ្វិក និងដំណើរការច្នៃប្រឌិត",
			ko: "UI/UX 디자인, 그래픽 디자인 및 창작 과정",
			th: "การออกแบบ UI/UX การออกแบบกราฟิก และกระบวนการสร้างสรรค์",
		},
		isActive: true,
		createdAt: new Date("2024-01-20"),
	},
];

const STORAGE_KEY = "categories";

export class CategoryStorage {
	static getAll(): Category[] {
		if (typeof window === "undefined") return mockCategories;

		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (!stored) {
				// Initialize with mock data
				this.saveAll(mockCategories);
				return mockCategories;
			}

			const categories = JSON.parse(stored);
			// Convert date strings back to Date objects
			return categories.map((cat: any) => ({
				...cat,
				createdAt: new Date(cat.createdAt),
				updatedAt: cat.updatedAt ? new Date(cat.updatedAt) : undefined,
			}));
		} catch (error) {
			console.error("Error loading categories:", error);
			return mockCategories;
		}
	}

	static saveAll(categories: Category[]): void {
		if (typeof window === "undefined") return;

		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
		} catch (error) {
			console.error("Error saving categories:", error);
		}
	}

	static getById(id: string): Category | undefined {
		return this.getAll().find((cat) => cat.id === id);
	}

	static create(category: Omit<Category, "id" | "createdAt">): Category {
		const newCategory: Category = {
			...category,
			id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			createdAt: new Date(),
		};

		const categories = this.getAll();
		categories.push(newCategory);
		this.saveAll(categories);

		return newCategory;
	}

	static update(
		id: string,
		updates: Partial<Omit<Category, "id" | "createdAt">>
	): Category | null {
		const categories = this.getAll();
		const index = categories.findIndex((cat) => cat.id === id);

		if (index === -1) return null;

		const updatedCategory = {
			...categories[index],
			...updates,
			updatedAt: new Date(),
		};

		categories[index] = updatedCategory;
		this.saveAll(categories);

		return updatedCategory;
	}

	static delete(id: string): boolean {
		const categories = this.getAll();
		const initialLength = categories.length;

		// Remove the category and any children
		const filtered = categories.filter(
			(cat) => cat.id !== id && cat.parentId !== id
		);

		if (filtered.length !== initialLength) {
			this.saveAll(filtered);
			return true;
		}

		return false;
	}

	static getParentCategories(): Category[] {
		return this.getAll().filter((cat) => !cat.parentId);
	}

	static getChildCategories(parentId: string): Category[] {
		return this.getAll().filter((cat) => cat.parentId === parentId);
	}

	static getCategoryTree(): Category[] {
		const categories = this.getAll();
		const parentCategories = categories.filter((cat) => !cat.parentId);

		return parentCategories.map((parent) => ({
			...parent,
			children: categories.filter((cat) => cat.parentId === parent.id),
		}));
	}

	static getStats() {
		const categories = this.getAll();
		const activeCategories = categories.filter((cat) => cat.isActive);
		const parentCategories = categories.filter((cat) => !cat.parentId);
		const childCategories = categories.filter((cat) => cat.parentId);

		return {
			total: categories.length,
			active: activeCategories.length,
			inactive: categories.length - activeCategories.length,
			parents: parentCategories.length,
			children: childCategories.length,
		};
	}
}
