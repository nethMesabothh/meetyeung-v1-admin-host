import { Video } from "../types/video";
import { mockCategories } from "./category";

export const mockVideos: Video[] = [
	{
		id: "vid_1",
		videoId: "ezBY2g3ad0Y",
		title: {
			en: "Community Event Highlights",
			km: "ចំណុចសំខាន់ៗនៃព្រឹត្តិការណ៍សហគមន៍",
		},
		description: {
			en: "A look back at our recent community outreach program.",
			km: "ក្រឡេកមើលកម្មវិធីផ្សព្វផ្សាយសហគមន៍ថ្មីៗរបស់យើង។",
		},
		date: new Date("2025-08-15T10:00:00Z"),
		category: "community",
		order: 0,
		isActive: true,
		createdAt: new Date(),
	},
	{
		id: "vid_2",
		videoId: "VKOWFVXAsAg",
		title: {
			en: "Educational Workshop on Digital Skills",
			km: "សិក្ខាសាលាស្តីពីជំនាញឌីជីថល",
		},
		description: {
			en: "Empowering the next generation with modern technology skills.",
			km: "ផ្តល់អំណាចដល់យុវជនជំនាន់ក្រោយជាមួយនឹងជំនាញបច្ចេកវិទ្យាទំនើប។",
		},
		date: new Date("2025-07-20T14:00:00Z"),
		category: "education",
		order: 1,
		isActive: true,
		createdAt: new Date(),
	},
	{
		id: "vid_3",
		videoId: "Hz1p7hryPww",
		title: { en: "Cultural Dance Festival", km: "មហោស្រពរបាំវប្បធម៌" },
		description: {
			en: "Celebrating the rich heritage of Khmer traditional dance.",
			km: "អបអរសាទរមរតកដ៏សម្បូរបែបនៃរបាំប្រពៃណីខ្មែរ។",
		},
		date: new Date("2025-06-01T18:00:00Z"),
		category: "culture",
		order: 2,
		isActive: false,
		createdAt: new Date(),
	},
];

export const videoCategories = [
	{ id: "all", name: { en: "All", km: "ទាំងអស់" } },
	{ id: "community", name: { en: "Community", km: "សហគមន៍" } },
	{ id: "education", name: { en: "Education", km: "ការអប់រំ" } },
	{ id: "culture", name: { en: "Culture", km: "វប្បធម៌" } },
];
