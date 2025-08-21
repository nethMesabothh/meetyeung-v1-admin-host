"use client";

import { DashboardHeader } from "@/components/dashboard-header";

interface LayoutWrapperProps {
	children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
	return (
		<div className="flex h-screen bg-muted/30">
			<div className="flex-1 flex flex-col overflow-hidden">
				<DashboardHeader />

				<main className="flex-1 overflow-y-auto p-6">{children}</main>
			</div>
		</div>
	);
}
