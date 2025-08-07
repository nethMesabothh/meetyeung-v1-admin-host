"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const users = [
	{
		id: 1,
		name: "Alice Johnson",
		email: "alice@example.com",
		role: "Admin",
		status: "active",
		lastLogin: "2 hours ago",
	},
	{
		id: 2,
		name: "Bob Smith",
		email: "bob@example.com",
		role: "User",
		status: "active",
		lastLogin: "1 day ago",
	},
	{
		id: 3,
		name: "Carol Wilson",
		email: "carol@example.com",
		role: "Editor",
		status: "inactive",
		lastLogin: "1 week ago",
	},
	{
		id: 4,
		name: "David Brown",
		email: "david@example.com",
		role: "User",
		status: "active",
		lastLogin: "3 hours ago",
	},
];

export function UsersTable() {
	return (
		<Card className="rounded-xl">
			<CardHeader>
				<CardTitle>Recent Users</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-muted/50">
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Last Login</TableHead>
							<TableHead className="w-[70px]"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id} className="hover:bg-muted/50">
								<TableCell className="font-medium">{user.name}</TableCell>
								<TableCell className="text-muted-foreground">
									{user.email}
								</TableCell>
								<TableCell>
									<Badge variant="outline" className="rounded-xl">
										{user.role}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge
										variant={user.status === "active" ? "default" : "secondary"}
										className={cn(
											"rounded-xl",
											user.status === "active"
												? "bg-green-600 hover:bg-green-700 text-white"
												: ""
										)}
									>
										{user.status}
									</Badge>
								</TableCell>
								<TableCell className="text-muted-foreground">
									{user.lastLogin}
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												className="h-8 w-8 p-0 rounded-xl"
											>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="rounded-xl">
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuItem className="hover:bg-accent">
												<Eye className="mr-2 h-4 w-4" />
												View
											</DropdownMenuItem>
											<DropdownMenuItem className="hover:bg-accent">
												<Edit className="mr-2 h-4 w-4" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem className="hover:bg-destructive hover:text-destructive-foreground">
												<Trash2 className="mr-2 h-4 w-4" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
