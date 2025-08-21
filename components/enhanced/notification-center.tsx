"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Bell,
	Check,
	CheckCheck,
	AlertCircle,
	Info,
	MessageSquare,
	User,
	FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
	id: string;
	type: "info" | "warning" | "success" | "comment" | "user" | "post";
	title: string;
	message: string;
	timestamp: Date;
	read: boolean;
	actionUrl?: string;
}

const mockNotifications: Notification[] = [
	{
		id: "1",
		type: "comment",
		title: "New Comment",
		message: "John Doe commented on 'The Future of Web Development'",
		timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
		read: false,
		actionUrl: "/comments",
	},
	{
		id: "2",
		type: "user",
		title: "New User Registration",
		message: "Jane Smith has registered as a new user",
		timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
		read: false,
		actionUrl: "/users",
	},
	{
		id: "3",
		type: "post",
		title: "Post Published",
		message: "Your post 'Modern Design Principles' has been published",
		timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
		read: true,
		actionUrl: "/blog",
	},
	{
		id: "4",
		type: "warning",
		title: "Storage Warning",
		message: "Media storage is 85% full. Consider cleaning up old files.",
		timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
		read: false,
		actionUrl: "/media",
	},
];

const getNotificationIcon = (type: Notification["type"]) => {
	switch (type) {
		case "comment":
			return MessageSquare;
		case "user":
			return User;
		case "post":
			return FileText;
		case "warning":
			return AlertCircle;
		case "success":
			return Check;
		default:
			return Info;
	}
};

const getNotificationColor = (type: Notification["type"]) => {
	switch (type) {
		case "comment":
			return "text-blue-600";
		case "user":
			return "text-green-600";
		case "post":
			return "text-purple-600";
		case "warning":
			return "text-orange-600";
		case "success":
			return "text-green-600";
		default:
			return "text-gray-600";
	}
};

const formatTimestamp = (timestamp: Date) => {
	const now = new Date();
	const diff = now.getTime() - timestamp.getTime();
	const minutes = Math.floor(diff / (1000 * 60));
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	if (hours < 24) return `${hours}h ago`;
	return `${days}d ago`;
};

export function NotificationCenter() {
	const [notifications, setNotifications] = useState<Notification[]>(
		mockNotifications
	);
	const [open, setOpen] = useState(false);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const markAsRead = (id: string) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, read: true } : n))
		);
	};

	const markAllAsRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
	};

	const handleNotificationClick = (notification: Notification) => {
		if (!notification.read) {
			markAsRead(notification.id);
		}
		if (notification.actionUrl) {
			// In a real app, you'd use router.push(notification.actionUrl)
			console.log(`Navigate to: ${notification.actionUrl}`);
		}
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
							{unreadCount > 99 ? "99+" : unreadCount}
						</Badge>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0" align="end">
				<div className="flex items-center justify-between p-4 border-b">
					<h3 className="font-semibold">Notifications</h3>
					{unreadCount > 0 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={markAllAsRead}
							className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
						>
							<CheckCheck className="mr-1 h-3 w-3" />
							Mark all read
						</Button>
					)}
				</div>
				<ScrollArea className="h-80">
					{notifications.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-8 text-center">
							<Bell className="h-8 w-8 text-muted-foreground mb-2" />
							<p className="text-sm text-muted-foreground">
								No notifications yet
							</p>
						</div>
					) : (
						<div className="divide-y">
							{notifications.map((notification) => {
								const Icon = getNotificationIcon(notification.type);
								const iconColor = getNotificationColor(notification.type);

								return (
									<div
										key={notification.id}
										className={cn(
											"flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
											!notification.read && "bg-blue-50/50"
										)}
										onClick={() => handleNotificationClick(notification)}
									>
										<div
											className={cn(
												"flex-shrink-0 mt-0.5",
												iconColor
											)}
										>
											<Icon className="h-4 w-4" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between">
												<p
													className={cn(
														"text-sm font-medium truncate",
														!notification.read && "font-semibold"
													)}
												>
													{notification.title}
												</p>
												{!notification.read && (
													<div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2" />
												)}
											</div>
											<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
												{notification.message}
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												{formatTimestamp(notification.timestamp)}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</ScrollArea>
				{notifications.length > 0 && (
					<>
						<Separator />
						<div className="p-2">
							<Button
								variant="ghost"
								size="sm"
								className="w-full justify-center text-xs"
								onClick={() => {
									// Navigate to notifications page
									console.log("Navigate to all notifications");
									setOpen(false);
								}}
							>
								View all notifications
							</Button>
						</div>
					</>
				)}
			</PopoverContent>
		</Popover>
	);
}