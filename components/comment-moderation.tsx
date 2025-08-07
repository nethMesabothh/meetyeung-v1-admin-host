"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	MessageSquare,
	Trash2,
	CheckCircle,
	XCircle,
	Filter,
} from "lucide-react";
import { BlogComment } from "@/lib/types/types";
import { mockComments, mockBlogPosts } from "@/lib/data/mock-data";

export function CommentModeration() {
	const [comments, setComments] = useState<BlogComment[]>(mockComments);
	const [filterStatus, setFilterStatus] = useState<string>("all");
	const [filterPost, setFilterPost] = useState<string>("all");

	const handleToggleApproval = (commentId: string) => {
		setComments(
			comments.map((comment) =>
				comment.id === commentId
					? { ...comment, isApproved: !comment.isApproved }
					: comment
			)
		);
	};

	const handleDeleteComment = (commentId: string) => {
		setComments(comments.filter((comment) => comment.id !== commentId));
	};

	const filteredComments = comments.filter((comment) => {
		const statusMatch =
			filterStatus === "all" ||
			(filterStatus === "approved" && comment.isApproved) ||
			(filterStatus === "pending" && !comment.isApproved);

		const postMatch = filterPost === "all" || comment.blogPostId === filterPost;

		return statusMatch && postMatch;
	});

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">
						Comment Moderation
					</h2>
					<p className="text-muted-foreground">
						Review and moderate blog post comments
					</p>
				</div>
			</div>

			<Card className="rounded-xl">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>Comments</CardTitle>
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2">
								<Filter className="h-4 w-4 text-muted-foreground" />
								<Select value={filterStatus} onValueChange={setFilterStatus}>
									<SelectTrigger className="w-32 rounded-xl">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Status</SelectItem>
										<SelectItem value="approved">Approved</SelectItem>
										<SelectItem value="pending">Pending</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Select value={filterPost} onValueChange={setFilterPost}>
								<SelectTrigger className="w-48 rounded-xl">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Posts</SelectItem>
									{mockBlogPosts.map((post) => (
										<SelectItem key={post.id} value={post.id}>
											{post.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{filteredComments.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Author</TableHead>
									<TableHead>Comment</TableHead>
									<TableHead>Blog Post</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="w-[120px]">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredComments.map((comment) => (
									<TableRow key={comment.id}>
										<TableCell>
											<div>
												<div className="font-medium">{comment.authorName}</div>
												<div className="text-sm text-muted-foreground">
													{comment.authorEmail}
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className="max-w-xs">
												<p className="text-sm line-clamp-2">
													{comment.content}
												</p>
											</div>
										</TableCell>
										<TableCell>
											<div className="text-sm font-medium">
												{comment.blogPost?.title}
											</div>
										</TableCell>
										<TableCell className="text-muted-foreground text-sm">
											{comment.createdAt.toLocaleDateString()}
										</TableCell>
										<TableCell>
											<div className="flex items-center space-x-2">
												<Switch
													checked={comment.isApproved}
													onCheckedChange={() =>
														handleToggleApproval(comment.id)
													}
													className="data-[state=checked]:bg-blue-600"
												/>
												<Badge
													variant={comment.isApproved ? "default" : "secondary"}
													className={`rounded-lg ${
														comment.isApproved
															? "bg-green-600 hover:bg-green-700"
															: "bg-yellow-600 hover:bg-yellow-700"
													}`}
												>
													{comment.isApproved ? (
														<>
															<CheckCircle className="w-3 h-3 mr-1" />
															Approved
														</>
													) : (
														<>
															<XCircle className="w-3 h-3 mr-1" />
															Pending
														</>
													)}
												</Badge>
											</div>
										</TableCell>
										<TableCell>
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button
														variant="outline"
														size="sm"
														className="h-8 w-8 p-0 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
													>
														<Trash2 className="h-3 w-3" />
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent className="rounded-xl">
													<AlertDialogHeader>
														<AlertDialogTitle>Delete Comment</AlertDialogTitle>
														<AlertDialogDescription>
															Are you sure you want to delete this comment from{" "}
															{comment.authorName}? This action cannot be
															undone.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel className="rounded-xl">
															Cancel
														</AlertDialogCancel>
														<AlertDialogAction
															onClick={() => handleDeleteComment(comment.id)}
															className="bg-red-600 hover:bg-red-700 rounded-xl"
														>
															Delete
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="flex flex-col items-center justify-center py-12">
							<MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-medium mb-2">No comments found</h3>
							<p className="text-muted-foreground text-center">
								{filterStatus !== "all" || filterPost !== "all"
									? "No comments match your current filters."
									: "Comments will appear here when readers engage with your blog posts."}
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			<div className="grid gap-4 md:grid-cols-3">
				<Card className="rounded-xl">
					<CardContent className="p-6">
						<div className="flex items-center space-x-2">
							<CheckCircle className="h-5 w-5 text-green-600" />
							<div>
								<p className="text-2xl font-bold">
									{comments.filter((c) => c.isApproved).length}
								</p>
								<p className="text-sm text-muted-foreground">
									Approved Comments
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-xl">
					<CardContent className="p-6">
						<div className="flex items-center space-x-2">
							<XCircle className="h-5 w-5 text-yellow-600" />
							<div>
								<p className="text-2xl font-bold">
									{comments.filter((c) => !c.isApproved).length}
								</p>
								<p className="text-sm text-muted-foreground">Pending Review</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-xl">
					<CardContent className="p-6">
						<div className="flex items-center space-x-2">
							<MessageSquare className="h-5 w-5 text-blue-600" />
							<div>
								<p className="text-2xl font-bold">{comments.length}</p>
								<p className="text-sm text-muted-foreground">Total Comments</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
