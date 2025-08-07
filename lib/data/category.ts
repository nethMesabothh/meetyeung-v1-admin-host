import { Category } from "../types/category";

const parentId1 = "cat_parent_1";
const parentId2 = "cat_parent_2";

export const mockCategories: Category[] = [
	{
		id: parentId1,
		name: "Technology",
		description: "Articles about gadgets, software, and the future of tech.",
		parentId: null,
		createdAt: new Date("2025-08-01T10:00:00Z"),
	},
	{
		id: parentId2,
		name: "Travel",
		description: "Guides, stories, and tips for adventurers.",
		parentId: null,
		createdAt: new Date("2025-07-15T14:20:00Z"),
	},
	{
		id: "cat_parent_3",
		name: "Lifestyle",
		description: "Topics on wellness, productivity, and personal growth.",
		parentId: null,
		createdAt: new Date("2025-06-20T09:00:00Z"),
	},

	// Sub-categories
	{
		id: "cat_sub_1a",
		name: "Software Development",
		description: "Tutorials on programming languages and frameworks.",
		parentId: parentId1, // Child of Technology
		createdAt: new Date("2025-08-02T11:00:00Z"),
	},
	{
		id: "cat_sub_1b",
		name: "Gadget Reviews",
		description: "In-depth reviews of the latest devices.",
		parentId: parentId1, // Child of Technology
		createdAt: new Date("2025-08-03T12:30:00Z"),
	},
	{
		id: "cat_sub_2a",
		name: "European Destinations",
		description: "Exploring the cities and landscapes of Europe.",
		parentId: parentId2, // Child of Travel
		createdAt: new Date("2025-07-20T18:00:00Z"),
	},
];
