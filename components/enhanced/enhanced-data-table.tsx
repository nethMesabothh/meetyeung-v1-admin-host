"use client";

import { useState, useMemo } from "react";
import {
	ColumnDef,
	SortingState,
	ColumnFiltersState,
	VisibilityState,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	useReactTable,
	flexRender,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Download,
	Filter,
	MoreHorizontal,
	RefreshCw,
	Settings2,
	Trash2,
	Eye,
	EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BulkAction {
	id: string;
	label: string;
	icon?: React.ComponentType<{ className?: string }>;
	action: (selectedIds: string[]) => void;
	variant?: "default" | "destructive";
	requiresConfirmation?: boolean;
	confirmationTitle?: string;
	confirmationDescription?: string;
}

interface FilterConfig {
	id: string;
	label: string;
	type: "select" | "text" | "date";
	options?: { label: string; value: string }[];
}

interface EnhancedDataTableProps<T> {
	data: T[];
	columns: ColumnDef<T>[];
	loading?: boolean;
	error?: string | null;
	onRefresh?: () => void;
	bulkActions?: BulkAction[];
	filters?: FilterConfig[];
	searchable?: boolean;
	exportable?: boolean;
	selectable?: boolean;
	className?: string;
}

export function EnhancedDataTable<T extends { id: string }>({
	data,
	columns,
	loading = false,
	error = null,
	onRefresh,
	bulkActions = [],
	filters = [],
	searchable = true,
	exportable = false,
	selectable = false,
	className,
}: EnhancedDataTableProps<T>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [globalFilter, setGlobalFilter] = useState("");
	const [pendingBulkAction, setPendingBulkAction] = useState<BulkAction | null>(
		null
	);

	// Add selection column if selectable
	const enhancedColumns = useMemo(() => {
		if (!selectable) return columns;

		const selectionColumn: ColumnDef<T> = {
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllPageRowsSelected()}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		};

		return [selectionColumn, ...columns];
	}, [columns, selectable]);

	const table = useReactTable({
		data,
		columns: enhancedColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: "includesString",
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter,
		},
	});

	const selectedRows = table.getFilteredSelectedRowModel().rows;
	const selectedIds = selectedRows.map((row) => row.original.id);

	const handleBulkAction = (action: BulkAction) => {
		if (action.requiresConfirmation) {
			setPendingBulkAction(action);
		} else {
			action.action(selectedIds);
			setRowSelection({});
		}
	};

	const confirmBulkAction = () => {
		if (pendingBulkAction) {
			pendingBulkAction.action(selectedIds);
			setRowSelection({});
			setPendingBulkAction(null);
		}
	};

	const exportData = () => {
		const csvContent = [
			// Headers
			table
				.getVisibleFlatColumns()
				.map((col) => col.columnDef.header as string)
				.join(","),
			// Data rows
			...table
				.getFilteredRowModel()
				.rows.map((row) =>
					row
						.getVisibleCells()
						.map((cell) => flexRender(cell.column.columnDef.cell, cell.getContext()))
						.join(",")
				),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "data.csv";
		a.click();
		URL.revokeObjectURL(url);
	};

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<div className="text-destructive mb-4">Error loading data</div>
				<p className="text-muted-foreground mb-4">{error}</p>
				{onRefresh && (
					<Button onClick={onRefresh} variant="outline">
						<RefreshCw className="mr-2 h-4 w-4" />
						Try Again
					</Button>
				)}
			</div>
		);
	}

	return (
		<div className={cn("space-y-4", className)}>
			{/* Toolbar */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					{searchable && (
						<Input
							placeholder="Search..."
							value={globalFilter}
							onChange={(e) => setGlobalFilter(e.target.value)}
							className="max-w-sm"
						/>
					)}
					{filters.map((filter) => (
						<Select
							key={filter.id}
							value={
								(table.getColumn(filter.id)?.getFilterValue() as string) ?? ""
							}
							onValueChange={(value) =>
								table.getColumn(filter.id)?.setFilterValue(value || undefined)
							}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder={filter.label} />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="">All {filter.label}</SelectItem>
								{filter.options?.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					))}
				</div>

				<div className="flex items-center space-x-2">
					{/* Bulk Actions */}
					{selectable && selectedIds.length > 0 && (
						<div className="flex items-center space-x-2">
							<Badge variant="secondary">
								{selectedIds.length} selected
							</Badge>
							{bulkActions.map((action) => (
								<Button
									key={action.id}
									variant={action.variant === "destructive" ? "destructive" : "outline"}
									size="sm"
									onClick={() => handleBulkAction(action)}
								>
									{action.icon && <action.icon className="mr-2 h-4 w-4" />}
									{action.label}
								</Button>
							))}
						</div>
					)}

					{/* Export */}
					{exportable && (
						<Button variant="outline" size="sm" onClick={exportData}>
							<Download className="mr-2 h-4 w-4" />
							Export
						</Button>
					)}

					{/* Refresh */}
					{onRefresh && (
						<Button
							variant="outline"
							size="sm"
							onClick={onRefresh}
							disabled={loading}
						>
							<RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
						</Button>
					)}

					{/* Column Visibility */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								<Settings2 className="mr-2 h-4 w-4" />
								View
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell
									colSpan={enhancedColumns.length}
									className="h-24 text-center"
								>
									<div className="flex items-center justify-center">
										<RefreshCw className="mr-2 h-4 w-4 animate-spin" />
										Loading...
									</div>
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={enhancedColumns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between px-2">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="flex items-center space-x-6 lg:space-x-8">
					<div className="flex items-center space-x-2">
						<p className="text-sm font-medium">Rows per page</p>
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={(value) => {
								table.setPageSize(Number(value));
							}}
						>
							<SelectTrigger className="h-8 w-[70px]">
								<SelectValue placeholder={table.getState().pagination.pageSize} />
							</SelectTrigger>
							<SelectContent side="top">
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex w-[100px] items-center justify-center text-sm font-medium">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to first page</span>
							<ChevronsLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to next page</span>
							<ChevronRight className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to last page</span>
							<ChevronsRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Bulk Action Confirmation Dialog */}
			<AlertDialog
				open={!!pendingBulkAction}
				onOpenChange={() => setPendingBulkAction(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{pendingBulkAction?.confirmationTitle || "Confirm Action"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{pendingBulkAction?.confirmationDescription ||
								`Are you sure you want to perform this action on ${selectedIds.length} selected items?`}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmBulkAction}
							className={
								pendingBulkAction?.variant === "destructive"
									? "bg-destructive hover:bg-destructive/90"
									: ""
							}
						>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}