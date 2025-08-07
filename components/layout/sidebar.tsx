"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Home,
	Users,
	Settings,
	FileText,
	ChevronLeft,
	Image,
	FolderOpen,
	MessageSquare,
	Upload,
} from "lucide-react";

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: Home },
	{ name: "Banners", href: "/dashboard/banners", icon: Image },
	{ name: "Categories", href: "/dashboard/categories", icon: FolderOpen },
	{ name: "Blog Posts", href: "/dashboard/blog", icon: FileText },
	{ name: "Media", href: "/dashboard/media", icon: Upload },
];

const secondaryNavigation = [
	{ name: "Comments", href: "/dashboard/comments", icon: MessageSquare },
	{ name: "Users", href: "/dashboard/users", icon: Users },
	{ name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
	isSidebarOpen: boolean;
	setIsSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
	const [collapsed, setCollapsed] = useState(false);
	const pathname = usePathname();

	const NavLink = ({
		item,
		isCollapsed,
	}: {
		item: (typeof navigation)[0];
		isCollapsed: boolean;
	}) => {
		// Handle the root path separately
		const isActive =
			item.href === "/dashboard"
				? pathname === item.href
				: pathname.startsWith(item.href);

		const linkContent = (
			<>
				<item.icon
					className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")}
				/>
				{!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
			</>
		);

		const linkClasses = cn(
			"flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
			isActive
				? "text-primary font-semibold"
				: "text-muted-foreground hover:text-foreground",
			isCollapsed && "justify-center"
		);

		if (isCollapsed) {
			return (
				<TooltipProvider delayDuration={0}>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link href={item.href} className={linkClasses}>
								{linkContent}
								<span className="sr-only">{item.name}</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right">{item.name}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		}

		return (
			<Link href={item.href} className={linkClasses}>
				{linkContent}
			</Link>
		);
	};

	const sidebarContent = (
		<div className="flex flex-col h-full bg-card">
			<div className="flex h-16 items-center border-b px-4 lg:px-6 shrink-0">
				<Link href="/" className="flex items-center gap-2 font-semibold">
					<span className="">My Admin</span>
				</Link>
			</div>
			<nav className="flex-1 space-y-2 p-4">
				{navigation.map((item) => (
					<NavLink key={item.name} item={item} isCollapsed={collapsed} />
				))}
			</nav>
			<nav className="mt-auto space-y-2 border-t p-4">
				{secondaryNavigation.map((item) => (
					<NavLink key={item.name} item={item} isCollapsed={collapsed} />
				))}
			</nav>
		</div>
	);

	return (
		<>
			{/* Mobile Sidebar (Sheet) */}
			<div className="md:hidden">
				<Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
					<SheetContent side="left" className="w-64 p-0">
						{sidebarContent}
					</SheetContent>
				</Sheet>
			</div>

			{/* Desktop Sidebar */}
			<div
				className={cn(
					"hidden md:flex flex-col border-r transition-[width] duration-300 ease-in-out relative",
					collapsed ? "w-20" : "w-64"
				)}
			>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setCollapsed(!collapsed)}
					className="absolute top-4 -right-4 z-10 bg-card border hover:bg-accent rounded-full h-8 w-8"
				>
					<ChevronLeft
						className={cn(
							"h-4 w-4 transition-transform",
							collapsed && "rotate-180"
						)}
					/>
				</Button>
				{sidebarContent}
			</div>
		</>
	);
}
