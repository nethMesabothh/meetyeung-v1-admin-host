"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
		this.props.onError?.(error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: undefined });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<Card className="max-w-md mx-auto mt-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-destructive">
							<AlertTriangle className="h-5 w-5" />
							Something went wrong
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-sm text-muted-foreground">
							An unexpected error occurred. Please try refreshing the page or
							contact support if the problem persists.
						</p>
						{process.env.NODE_ENV === "development" && this.state.error && (
							<details className="text-xs bg-muted p-2 rounded">
								<summary className="cursor-pointer font-medium">
									Error Details
								</summary>
								<pre className="mt-2 whitespace-pre-wrap">
									{this.state.error.message}
									{"\n"}
									{this.state.error.stack}
								</pre>
							</details>
						)}
						<div className="flex gap-2">
							<Button onClick={this.handleReset} size="sm">
								<RefreshCw className="mr-2 h-4 w-4" />
								Try Again
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => window.location.reload()}
							>
								Refresh Page
							</Button>
						</div>
					</CardContent>
				</Card>
			);
		}

		return this.props.children;
	}
}

// Hook version for functional components
export function useErrorHandler() {
	return (error: Error, errorInfo?: ErrorInfo) => {
		console.error("Error:", error, errorInfo);
		// You could send this to an error reporting service
		// like Sentry, LogRocket, etc.
	};
}