// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ProviderLayout } from "@/components/provider/layoutProvider";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Admin Dashboard",
	description: "Modern minimalist admin dashboard",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${inter.variable} font-sans antialiased`}>
				<div className="min-h-screen">
					<ProviderLayout>
						<main className="p-4 lg:gap-6 lg:p-6 w-full">{children}</main>
					</ProviderLayout>
				</div>
			</body>
		</html>
	);
}
