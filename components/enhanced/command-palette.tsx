"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Plus,
	Search,
	Settings,
	Users,
	FileText,
	Image,
	BarChart3,
} from "lucide-react";

interface CommandAction {
	id: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	action: () => void;
	keywords?: string[];
}

export function CommandPalette() {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const actions: CommandAction[] = [
		{
			id: "new-post",
			label: "Create New Blog Post",
			icon: Plus,
			action: () => {
				router.push("/blog/edit/new");
				setOpen(false);
			},
			keywords: ["create", "new", "blog", "post", "article"],
		},
		{
			id: "new-category",
			label: "Create New Category",
			icon: Plus,
			action: () => {
				router.push("/categories");
				setOpen(false);
			},
			keywords: ["create", "new", "category"],
		},
		{
			id: "media-library",
			label: "Open Media Library",
			icon: Image,
			action: () => {
				router.push("/media");
				setOpen(false);
			},
			keywords: ["media", "images", "files", "upload"],
		},
		{
			id: "user-management",
			label: "Manage Users",
			icon: Users,
			action: () => {
				router.push("/users");
				setOpen(false);
			},
			keywords: ["users", "accounts", "permissions"],
		},
		{
			id: "analytics",
			label: "View Analytics",
			icon: BarChart3,
			action: () => {
				router.push("/analytics");
				setOpen(false);
			},
			keywords: ["analytics", "stats", "reports", "data"],
		},
		{
			id: "settings",
			label: "Open Settings",
			icon: Settings,
			action: () => {
				router.push("/settings");
				setOpen(false);
			},
			keywords: ["settings", "configuration", "preferences"],
		},
	];

	return (
		<>
			{/* Trigger hint */}
			<div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
				<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
					<span className="text-xs">⌘</span>K
				</kbd>
				<span>to search</span>
			</div>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Quick Actions">
						{actions.map((action) => (
							<CommandItem key={action.id} onSelect={action.action}>
								<action.icon className="mr-2 h-4 w-4" />
								{action.label}
							</CommandItem>
						))}
					</CommandGroup>
					<CommandGroup heading="Navigation">
						<CommandItem onSelect={() => router.push("/")}>
							<BarChart3 className="mr-2 h-4 w-4" />
							Dashboard
						</CommandItem>
						<CommandItem onSelect={() => router.push("/blog")}>
							<FileText className="mr-2 h-4 w-4" />
							Blog Posts
						</CommandItem>
						<CommandItem onSelect={() => router.push("/categories")}>
							<Search className="mr-2 h-4 w-4" />
							Categories
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
}