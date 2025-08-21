"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	BarChart3,
	Bell,
	FileText,
	FolderOpen,
	Handshake,
	Home,
	Image,
	MessageSquare,
	Settings,
	Upload,
	Users,
	Youtube,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
	SidebarTrigger, // 1. Import the trigger component
	useSidebar, // 2. Import the state management hook
} from "@/components/ui/sidebar";
import { title } from "process";

const navigation = [
	{ title: "Dashboard", url: "/", icon: Home },
	{ title: "Banners", url: "/banners", icon: Image },
	{ title: "Partners", url: "/partners", icon: Handshake },
	{ title: "Categories", url: "/categories", icon: FolderOpen },
	{ title: "Youtube", url: "/videos", icon: Youtube },
	{ title: "Blog Posts", url: "/blog", icon: FileText },
	{ title: "Comments", url: "/comments", icon: MessageSquare },
	{ title: "Media", url: "/media", icon: Upload },
	{ title: "Users", url: "/users", icon: Users },
	{ title: "Analytics", url: "/analytics", icon: BarChart3 },
	{ title: "Notifications", url: "/notifications", icon: Bell },
	{ title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
	const pathname = usePathname();
	const { state } = useSidebar(); // 3. Get the current state of the sidebar

	return (
		<Sidebar>
			<SidebarHeader className="flex items-center justify-between p-[15px] border-b">
				<h1 className="text-lg font-semibold tracking-tight text-primary">
					Admin Panel
				</h1>
			</SidebarHeader>

			<SidebarContent className="p-2 py-2.5">
				<SidebarMenu>
					{navigation.map((item) => {
						const isActive = pathname.startsWith(item.url) && item.url !== "/";
						const isDashboardActive = pathname === "/";

						return (
							<SidebarMenuItem key={item.title} className="py-0.5">
								<SidebarMenuButton
									asChild
									isActive={item.url === "/" ? isDashboardActive : isActive}
									tooltip={item.title} // Tooltip shows automatically when collapsed
									className="justify-start rounded-sm text-muted-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
								>
									<Link href={item.url}>
										<item.icon className="h-5 w-5 shrink-0" />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarContent>

			<SidebarSeparator />
			<SidebarFooter className="p-4">
				<div className="flex items-center">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
						<span className="text-sm font-medium text-primary-foreground">
							JD
						</span>
					</div>
					{/* 5. Conditionally render user info based on the sidebar state */}
					{state === "expanded" && (
						<div className="ml-3 min-w-0 flex-1">
							<p className="truncate text-sm font-semibold">John Doe</p>
							<p className="truncate text-xs text-muted-foreground">
								john@example.com
							</p>
						</div>
					)}
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
