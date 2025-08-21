"use client";

import { useState } from "react";
import { Banner, Media } from "@/lib/types/banner";
import { mockBanners } from "@/lib/data/banner-data";

import { SortableManagementGrid } from "../common/sortable-management-grid";
import { BannerEmptyState } from "./banner-empty-state";
import { SortableItemCard } from "../common/sortable-item-card";
import { AddItemDialog } from "../common/add-item-dialog";

export function BannerManagement() {
	const [banners, setBanners] = useState<Banner[]>(mockBanners);

	const handleAddBanner = async (file: File) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const newMediaObject: Media = {
			id: `media_${Date.now()}`,
			url: URL.createObjectURL(file),
			fileName: file.name,
			fileSize: file.size,
			mimeType: file.type,
			altText: file.name,
			createdAt: new Date(),
		};

		const newBanner: Banner = {
			id: `banner_${Date.now()}`,
			imageUrl: newMediaObject,
			isActive: true,
			order: banners.length + 1,
			createdAt: new Date(),
		};
		setBanners((prevBanners) => [...prevBanners, newBanner]);
	};

	const handleActiveState = (id: string) => {
		banners.map((partner) =>
			partner.id === id ? { ...partner, isActive: !partner.isActive } : partner
		);
	};

	const handleDeleteBanner = (id: string) => {
		const bannerToDelete = banners.find((b) => b.id === id);
		if (bannerToDelete && bannerToDelete.imageUrl.url.startsWith("blob:")) {
			URL.revokeObjectURL(bannerToDelete.imageUrl.url);
		}
		setBanners(banners.filter((banner) => banner.id !== id));
	};

	return (
		<SortableManagementGrid<Banner>
			items={banners}
			setItems={setBanners}
			onDelete={handleDeleteBanner}
			title="Banner Management"
			description="Drag to reorder. Use the toggle to change views."
			addDialogComponent={
				<AddItemDialog
					onItemAdd={handleAddBanner}
					dialogTitle="Add New Banner"
					triggerButtonText="Add Banner"
					submitButtonText="Add Banner"
					fileTypeDescription="PNG, JPG, or WEBP (MAX. 5MB)"
					acceptedFileTypes="image/png, image/jpeg, image/webp"
				/>
			}
			emptyStateComponent={<BannerEmptyState />}
			renderItem={(banner, index, viewMode) => (
				<SortableItemCard
					key={banner.id}
					id={banner.id}
					order={index + 1}
					viewMode={viewMode}
					onDelete={handleDeleteBanner}
					imageUrl={banner.imageUrl.url}
					title={banner.imageUrl.fileName || `Banner ${index + 1}`}
					subtitle={`ID: ${banner.id}`}
					date={banner.createdAt}
					isActive={banner.isActive}
					onToggleActive={handleActiveState}
				/>
			)}
		/>
	);
}
