// app/dashboard/partners/_components/partner-management.tsx
"use client";

import { useState } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	rectSortingStrategy,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { IPartnerResponse } from "@/lib/types/partners";
import { mockPartners } from "@/lib/data/partner";

import { SortableManagementGrid } from "../common/sortable-management-grid";
import { SortableItemCard } from "../common/sortable-item-card";
import { PartnerEmptyState } from "./partner-empty-state";
import { AddItemDialog } from "../common/add-item-dialog";

export function PartnerManagement() {
	const [partners, setPartners] = useState<IPartnerResponse[]>(mockPartners);

	const handleAddPartner = async (file: File) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const newPartner: IPartnerResponse = {
			id: `partner_${Date.now()}`,
			order: partners.length,
			createdAt: new Date(),
			updatedAt: new Date(),
			isActive: true,
			media: {
				id: `media_${Date.now()}`,
				url: URL.createObjectURL(file),
				altText: file.name,
			},
		};

		setPartners((prev) => [...prev, newPartner]);
		// TODO: Add API call here to create the new partner and upload the logo
	};

	const handleDeletePartner = (id: string) => {
		const partnerToDelete = partners.find((p) => p.id === id);
		// Important: Prevent memory leaks by revoking the blob URL
		if (partnerToDelete?.media?.url.startsWith("blob:")) {
			URL.revokeObjectURL(partnerToDelete.media.url);
		}
		setPartners(partners.filter((partner) => partner.id !== id));
		// TODO: Add API call here to delete the partner
	};

	const handleActiveState = (id: string) => {
		partners.map((partner) =>
			partner.id === id ? { ...partner, isActive: !partner.isActive } : partner
		);
	};

	return (
		<SortableManagementGrid<IPartnerResponse>
			items={partners}
			setItems={setPartners}
			onDelete={handleDeletePartner}
			title="Partner Management"
			description="Manage and reorder partner logos."
			addDialogComponent={
				<AddItemDialog
					onItemAdd={handleAddPartner}
					dialogTitle="Add New Partner Logo"
					triggerButtonText="Add Partner"
					submitButtonText="Add Partner"
					fileTypeDescription="PNG, JPG, or SVG (MAX. 2MB)"
					acceptedFileTypes="image/png, image/jpeg, image/svg+xml"
				/>
			}
			emptyStateComponent={<PartnerEmptyState />}
			renderItem={(partner, index, viewMode) => (
				<SortableItemCard
					key={partner.id}
					id={partner.id}
					order={index + 1}
					viewMode={viewMode}
					onDelete={handleDeletePartner}
					imageUrl={partner.media?.url}
					title={partner.media?.altText || `Partner ${index + 1}`}
					subtitle={`ID: ${partner.id}`}
					date={partner.createdAt}
					isActive={partner.isActive}
					onToggleActive={handleActiveState}
				/>
			)}
		/>
	);
}
