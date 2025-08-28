"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	ChevronDown,
	Eye,
	EyeOff,
	Star,
	StarOff,
	Trash2,
	Archive,
	X,
	Edit,
} from "lucide-react";
import { useState } from "react";

interface BulkActionsToolbarProps {
	selectedCount: number;
	selectedPosts: string[];
	onAction: (action: string, postIds: string[]) => void;
	onClear: () => void;
}

export function BulkActionsToolbar({
	selectedCount,
	selectedPosts,
	onAction,
	onClear,
}: BulkActionsToolbarProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleBulkAction = (action: string) => {
		onAction(action, selectedPosts);

		if (action === "delete") {
			setShowDeleteDialog(false);
		}
	};

	return (
		<>
			<div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
				<div className="flex items-center gap-3">
					<Badge variant="secondary" className="px-3 py-1">
						{selectedCount} selected
					</Badge>

					<div className="flex items-center gap-2">
						{/* Quick actions */}
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleBulkAction("publish")}
						>
							<Eye className="mr-2 h-4 w-4" />
							Publish
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={() => handleBulkAction("draft")}
						>
							<EyeOff className="mr-2 h-4 w-4" />
							Draft
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={() => handleBulkAction("feature")}
						>
							<Star className="mr-2 h-4 w-4" />
							Feature
						</Button>

						{/* More actions dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm">
									More actions
									<ChevronDown className="ml-2 h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem onClick={() => handleBulkAction("unfeature")}>
									<StarOff className="mr-2 h-4 w-4" />
									Remove from featured
								</DropdownMenuItem>

								<DropdownMenuItem onClick={() => handleBulkAction("archive")}>
									<Archive className="mr-2 h-4 w-4" />
									Archive
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								<DropdownMenuItem>
									<Edit className="mr-2 h-4 w-4" />
									Bulk edit categories
								</DropdownMenuItem>

								<DropdownMenuItem>
									<Edit className="mr-2 h-4 w-4" />
									Bulk edit tags
								</DropdownMenuItem>

								<DropdownMenuSeparator />

								<DropdownMenuItem
									onClick={() => setShowDeleteDialog(true)}
									className="text-destructive focus:text-destructive"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete selected
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<Button variant="ghost" size="sm" onClick={onClear}>
					<X className="mr-2 h-4 w-4" />
					Clear selection
				</Button>
			</div>

			{/* Delete confirmation dialog */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete {selectedCount} posts</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete {selectedCount} selected post
							{selectedCount > 1 ? "s" : ""}? This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => handleBulkAction("delete")}
							className="bg-destructive hover:bg-destructive/90"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete {selectedCount} post{selectedCount > 1 ? "s" : ""}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
