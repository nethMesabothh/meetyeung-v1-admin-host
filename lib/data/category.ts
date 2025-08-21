import { Category } from "../types/category";

const parentId1 = "cat_parent_1";
const parentId2 = "cat_parent_2";

export const mockCategories: Category[] = [
	// --- LEVEL 1 ---
	{
		id: parentId1,
		name: { en: "Technology", km: "បច្ចេកវិទ្យា" },
		description: {
			en: "Articles about gadgets, software, and the future of tech.",
		},
		parentId: null,
		isActive: true, // Added
		createdAt: new Date("2025-08-01T10:00:00Z"),
	},
	{
		id: parentId2,
		name: { en: "Travel", km: "ការធ្វើដំណើរ" },
		description: { en: "Guides, stories, and tips for adventurers." },
		parentId: null,
		isActive: true, // Added
		createdAt: new Date("2025-07-15T14:20:00Z"),
	},
	{
		id: "cat_parent_3",
		name: { en: "Lifestyle", km: "របៀបរស់នៅ" },
		description: {
			en: "Topics on wellness, productivity, and personal growth.",
		},
		parentId: null,
		isActive: false, // Added as 'false' for testing
		createdAt: new Date("2025-06-20T09:00:00Z"),
	},

	// --- LEVEL 2 ---
	{
		id: "cat_sub_1a",
		name: { en: "Software Development", km: "ការអភិវឌ្ឍន៍កម្មវិធី" },
		description: { en: "Tutorials on programming languages and frameworks." },
		parentId: parentId1,
		isActive: true, // Added
		createdAt: new Date("2025-08-02T11:00:00Z"),
	},
	{
		id: "cat_sub_1b",
		name: { en: "Gadget Reviews", km: "ការត្រួតពិនិត្យឧបករណ៍" },
		description: { en: "In-depth reviews of the latest devices." },
		parentId: parentId1,
		isActive: false, // Added as 'false' for testing
		createdAt: new Date("2025-08-03T12:30:00Z"),
	},
	{
		id: "cat_sub_2a",
		name: { en: "European Destinations", km: "គោលដៅអឺរ៉ុប" },
		description: { en: "Exploring the cities and landscapes of Europe." },
		parentId: parentId2,
		isActive: true, // Added
		createdAt: new Date("2025-07-20T18:00:00Z"),
	},

	// --- LEVEL 3 ---
	{
		id: "cat_sub_1a_1",
		name: { en: "React", km: "React" },
		description: { en: "Tutorials for the React framework." },
		parentId: "cat_sub_1a",
		isActive: true, // Added
		createdAt: new Date("2025-08-05T15:00:00Z"),
	},
];
