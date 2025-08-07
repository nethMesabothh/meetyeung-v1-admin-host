"use client";

import { Button } from "@/components/ui/button";
import { Menu, Bell } from "lucide-react";
import { UserNav } from "./user-nav";

interface HeaderProps {
	onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
	return (
		<header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
			{/* Mobile Menu Button */}
			<Button
				variant="outline"
				size="icon"
				className="shrink-0 md:hidden"
				onClick={onMenuClick}
			>
				<Menu className="h-5 w-5" />
				<span className="sr-only">Toggle navigation menu</span>
			</Button>

			{/* Header content like search, notifications, etc. can go here */}
			<div className="flex w-full items-center justify-end gap-4">
				<Button variant="ghost" size="icon" className="rounded-full">
					<Bell className="h-5 w-5" />
					<span className="sr-only">Toggle notifications</span>
				</Button>
				<UserNav />
			</div>
		</header>
	);
}
