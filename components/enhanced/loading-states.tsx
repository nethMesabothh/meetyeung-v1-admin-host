"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Generic loading spinner
export function LoadingSpinner({ 
	size = "default", 
	className 
}: { 
	size?: "sm" | "default" | "lg"; 
	className?: string; 
}) {
	const sizeClasses = {
		sm: "h-4 w-4",
		default: "h-6 w-6",
		lg: "h-8 w-8",
	};

	return (
		<RefreshCw 
			className={cn(
				"animate-spin", 
				sizeClasses[size], 
				className
			)} 
		/>
	);
}

// Table loading skeleton
export function TableLoadingSkeleton({ 
	rows = 5, 
	columns = 4 
}: { 
	rows?: number; 
	columns?: number; 
}) {
	return (
		<div className="space-y-3">
			{/* Header skeleton */}
			<div className="flex space-x-4">
				{Array.from({ length: columns }).map((_, i) => (
					<Skeleton key={i} className="h-4 flex-1" />
				))}
			</div>
			{/* Row skeletons */}
			{Array.from({ length: rows }).map((_, i) => (
				<div key={i} className="flex space-x-4">
					{Array.from({ length: columns }).map((_, j) => (
						<Skeleton key={j} className="h-8 flex-1" />
					))}
				</div>
			))}
		</div>
	);
}

// Card loading skeleton
export function CardLoadingSkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-3/4" />
				<Skeleton className="h-4 w-1/2" />
			</CardHeader>
			<CardContent className="space-y-3">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
				<Skeleton className="h-4 w-4/6" />
			</CardContent>
		</Card>
	);
}

// Form loading skeleton
export function FormLoadingSkeleton() {
	return (
		<div className="space-y-6">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-full" />
				</div>
			))}
			<div className="flex justify-end space-x-2">
				<Skeleton className="h-10 w-20" />
				<Skeleton className="h-10 w-20" />
			</div>
		</div>
	);
}

// Page loading component
export function PageLoading({ 
	message = "Loading..." 
}: { 
	message?: string; 
}) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
			<LoadingSpinner size="lg" />
			<p className="text-muted-foreground">{message}</p>
		</div>
	);
}

// Inline loading component
export function InlineLoading({ 
	message = "Loading...", 
	className 
}: { 
	message?: string; 
	className?: string; 
}) {
	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<LoadingSpinner size="sm" />
			<span className="text-sm text-muted-foreground">{message}</span>
		</div>
	);
}

// Button loading state
export function ButtonLoading({ 
	children, 
	loading = false, 
	...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
	loading?: boolean; 
}) {
	return (
		<button {...props} disabled={loading || props.disabled}>
			{loading && <LoadingSpinner size="sm" className="mr-2" />}
			{children}
		</button>
	);
}