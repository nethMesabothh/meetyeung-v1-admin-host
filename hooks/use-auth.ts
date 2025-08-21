// "use-client";

// import {
// 	createContext,
// 	useContext,
// 	useState,
// 	useEffect,
// 	ReactNode,
// 	useMemo,
// 	useCallback,
// } from "react";

// // Define the shape of your User object
// interface User {
// 	id: string;
// 	email: string;
// 	name: string;
// 	role: "admin" | "editor" | "user";
// 	permissions: string[];
// }

// // Define the shape of the context value
// interface AuthContextType {
// 	user: User | null;
// 	loading: boolean;
// 	login: (email: string, password: string) => Promise<void>;
// 	logout: () => Promise<void>;
// 	hasPermission: (permission: string) => boolean;
// }

// // Create the context with an undefined initial value
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Custom hook for easy access to the auth context
// export function useAuth() {
// 	const context = useContext(AuthContext);
// 	if (context === undefined) {
// 		throw new Error("useAuth must be used within an AuthProvider");
// 	}
// 	return context;
// }

// // The provider component that wraps your application
// export function AuthProvider({ children }: { children: ReactNode }) {
// 	const [user, setUser] = useState<User | null>(null);
// 	const [loading, setLoading] = useState(true); // Start with loading=true

// 	// Function to check auth status on initial load
// 	const checkAuthStatus = useCallback(async () => {
// 		try {
// 			const token = localStorage.getItem("auth_token");
// 			if (!token) {
// 				// No token found, user is not logged in
// 				return;
// 			}

// 			// NOTE: In a real app, you'd verify the token with your backend
// 			const response = await fetch("/api/auth/me", {
// 				headers: { Authorization: `Bearer ${token}` },
// 			});

// 			if (response.ok) {
// 				const userData: User = await response.json();
// 				setUser(userData);
// 			} else {
// 				// Token is invalid or expired
// 				localStorage.removeItem("auth_token");
// 			}
// 		} catch (error) {
// 			console.error("Auth check failed:", error);
// 			localStorage.removeItem("auth_token");
// 		} finally {
// 			setLoading(false);
// 		}
// 	}, []);

// 	// Run the auth check when the component mounts
// 	useEffect(() => {
// 		checkAuthStatus();
// 	}, [checkAuthStatus]);

// 	const login = async (email: string, password: string) => {
// 		// Show loading state or handle errors as needed
// 		const response = await fetch("/api/auth/login", {
// 			method: "POST",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify({ email, password }),
// 		});

// 		if (!response.ok) {
// 			throw new Error("Login failed. Please check your credentials.");
// 		}

// 		const { user: userData, token } = await response.json();
// 		localStorage.setItem("auth_token", token);
// 		setUser(userData);
// 	};

// 	const logout = async () => {
// 		// Inform the backend about the logout
// 		await fetch("/api/auth/logout", { method: "POST" });
// 		localStorage.removeItem("auth_token");
// 		setUser(null);
// 	};

// 	const hasPermission = useCallback(
// 		(permission: string): boolean => {
// 			if (!user) return false;
// 			// An admin has all permissions implicitly
// 			if (user.role === "admin") return true;
// 			return user.permissions.includes(permission);
// 		},
// 		[user]
// 	);

// 	// Memoize the context value to prevent unnecessary re-renders
// 	const value = useMemo(
// 		() => ({
// 			user,
// 			loading,
// 			login,
// 			logout,
// 			hasPermission,
// 		}),
// 		[user, loading, hasPermission]
// 	);

// 	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
