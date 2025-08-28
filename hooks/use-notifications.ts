"use client";

import { useState, useCallback } from "react";

export interface Notification {
	id: string;
	type: "success" | "error" | "warning" | "info";
	message: string;
	duration: number;
}

interface UseNotificationsReturn {
	notifications: Notification[];
	addNotification: (notification: Omit<Notification, "id">) => void;
	removeNotification: (id: string) => void;
	clearNotifications: () => void;
}

export function useNotifications(): UseNotificationsReturn {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const addNotification = useCallback(
		(notification: Omit<Notification, "id">) => {
			const id =
				Date.now().toString() + Math.random().toString(36).substr(2, 9);
			const newNotification: Notification = {
				...notification,
				id,
				duration: notification.duration ?? 5000, // Default 5 seconds
			};

			setNotifications((prev) => [...prev, newNotification]);

			// Auto-remove notification after duration
			if (newNotification && newNotification.duration > 0) {
				setTimeout(() => {
					removeNotification(id);
				}, newNotification.duration);
			}
		},
		[]
	);

	const removeNotification = useCallback((id: string) => {
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id)
		);
	}, []);

	const clearNotifications = useCallback(() => {
		setNotifications([]);
	}, []);

	return {
		notifications,
		addNotification,
		removeNotification,
		clearNotifications,
	};
}
