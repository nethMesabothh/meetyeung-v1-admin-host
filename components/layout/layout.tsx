"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

// This is the main layout for your dashboard pages.
// It manages the state for the mobile sidebar.
export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="flex min-h-screen w-full bg-muted/40">
			<Sidebar
				isSidebarOpen={isSidebarOpen}
				setIsSidebarOpen={setIsSidebarOpen}
			/>
			<div className="flex flex-col flex-1">
				<Header onMenuClick={() => setIsSidebarOpen(true)} />
				<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
					{children}
				</main>
			</div>
		</div>
	);
}
