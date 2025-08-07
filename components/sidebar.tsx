"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Home,
	Users,
	Settings,
	BarChart3,
	FileText,
	Bell,
	Menu,
	X,
	ChevronLeft,
	Image,
	FolderOpen,
	MessageSquare,
	Upload,
} from "lucide-react";

interface SidebarProps {
	className?: string;
}

const navigation = [
	{ name: "Dashboard", href: "/", icon: Home },
	{ name: "Banners", href: "/banners", icon: Image },
	{ name: "Categories", href: "/categories", icon: FolderOpen },
	{ name: "Blog Posts", href: "/blog", icon: FileText },
	{ name: "Comments", href: "/comments", icon: MessageSquare },
	{ name: "Media", href: "/media", icon: Upload },
	{ name: "Users", href: "/users", icon: Users },
	{ name: "Analytics", href: "/analytics", icon: BarChart3 },
	{ name: "Notifications", href: "/notifications", icon: Bell },
	{ name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ className }: SidebarProps) {
	const [collapsed, setCollapsed] = useState(false);
	const pathname = usePathname();

	return (
		<div
			className={cn(
				"flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out",
				collapsed ? "w-16" : "w-64",
				className
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-border">
				{!collapsed && (
					<h1 className="text-xl font-semibold tracking-tight text-primary">
						Blog Admin
					</h1>
				)}
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setCollapsed(!collapsed)}
					className="h-8 w-8 p-0"
				>
					{collapsed ? (
						<Menu className="h-4 w-4" />
					) : (
						<ChevronLeft className="h-4 w-4" />
					)}
				</Button>
			</div>

			{/* Navigation */}
			<nav className="flex-1 space-y-2 p-4">
				{navigation.map((item) => (
					<Link
						key={item.name}
						href={item.href}
						className={cn(
							"flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground w-full",
							pathname === item.href
								? "bg-primary text-primary-foreground"
								: "text-muted-foreground"
						)}
					>
						<item.icon className="h-5 w-5 flex-shrink-0" />
						{!collapsed && <span className="ml-3 truncate">{item.name}</span>}
					</Link>
				))}
			</nav>

			{/* User Profile */}
			<div className="border-t border-border p-4">
				<div className="flex items-center">
					<div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
						<span className="text-xs font-medium text-primary-foreground">
							JD
						</span>
					</div>
					{!collapsed && (
						<div className="ml-3 min-w-0 flex-1">
							<p className="text-sm font-medium truncate">John Doe</p>
							<p className="text-xs text-muted-foreground truncate">
								john@example.com
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
