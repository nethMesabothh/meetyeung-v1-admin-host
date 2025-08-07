"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export function Breadcrumbs({ className }: { className?: string }) {
	const pathname = usePathname();
	const pathSegments = pathname.split("/").filter((segment) => segment);

	return (
		<Breadcrumb className={className}>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href="/">Home</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				{pathSegments.map((segment, index) => {
					const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
					const isLast = index === pathSegments.length - 1;
					const label = segment.charAt(0).toUpperCase() + segment.slice(1);

					return (
						<React.Fragment key={href}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage>{label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link href={href}>{label}</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
