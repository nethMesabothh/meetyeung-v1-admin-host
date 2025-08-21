import { Banner, Media } from "../types/banner";

const formatBytes = (bytes: number, decimals = 2): string => {
	if (!+bytes) return "0 Bytes";
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const mockMedia: Media[] = [
	{
		id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
		url: "https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
		altText: "A vibrant abstract painting with colorful strokes.",
		fileName: "abstract_art_01.jpg",
		fileSize: 4200000, // 4.2 MB
		mimeType: "image/jpeg",
		createdAt: new Date("2025-08-01T10:00:00Z"),
	},
	{
		id: "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
		url: "https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
		altText: "A modern web design layout on a computer screen.",
		fileName: "web_design_mockup.png",
		fileSize: 2800000, // 2.8 MB
		mimeType: "image/png",
		createdAt: new Date("2025-08-02T11:30:00Z"),
	},
	{
		id: "c3d4e5f6-a7b8-9012-3456-7890abcdef23",
		url: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
		altText: "A person coding on a laptop in a dark room.",
		fileName: "developer_focus.jpg",
		fileSize: 3500000, // 3.5 MB
		mimeType: "image/jpeg",
		createdAt: new Date("2025-08-03T14:00:00Z"),
	},
	{
		id: "d4e5f6a7-b8c9-0123-4567-890abcdef34",
		url: "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
		altText: "A clean and organized office workspace.",
		fileName: "workspace_setup.webp",
		fileSize: 1900000, // 1.9 MB
		mimeType: "image/webp",
		createdAt: new Date("2025-08-04T09:00:00Z"),
	},
];

export const mockBanners: Banner[] = [
	{
		id: "banner_abc_1",
		order: 1,
		createdAt: new Date("2025-08-04T11:00:00Z"),
		isActive: true,
		imageUrl: mockMedia[1], // Nesting the full Media object
	},
	{
		id: "banner_def_2",
		order: 2,
		isActive: true,
		createdAt: new Date("2025-08-04T12:00:00Z"),
		imageUrl: mockMedia[2], // Nesting the full Media object
	},
	{
		id: "banner_ghi_3",
		order: 3,
		isActive: true,
		createdAt: new Date("2025-08-04T13:00:00Z"),
		imageUrl: mockMedia[0], // Nesting the full Media object
	},
];
