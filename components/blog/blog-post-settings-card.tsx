"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { Check, ChevronsUpDown, Calendar as CalendarIcon } from "lucide-react";
import { Category } from "@/lib/types/category";

export function BlogPostSettingsCard({
	state,
	dispatch,
	categories,
}: {
	state: any;
	dispatch: React.Dispatch<any>;
	categories: Category[];
}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Post Settings</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div>
					<Label>Category</Label>
					<CategoryCombobox
						categories={categories}
						value={state.categoryId}
						onChange={(value) =>
							dispatch({
								type: "SET_FIELD",
								field: "categoryId",
								payload: value,
							})
						}
					/>
				</div>
				<div>
					<Label>Publish Date</Label>
					<DatePicker
						date={state.publishedAt}
						setDate={(date) =>
							dispatch({
								type: "SET_FIELD",
								field: "publishedAt",
								payload: date,
							})
						}
					/>
				</div>
				<div className="flex items-center justify-between rounded-lg border p-3">
					<Label htmlFor="is-featured">Feature this post?</Label>
					<Switch
						id="is-featured"
						checked={state.isFeatured}
						onCheckedChange={(checked) =>
							dispatch({
								type: "SET_FIELD",
								field: "isFeatured",
								payload: checked,
							})
						}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

function DatePicker({
	date,
	setDate,
}: {
	date?: Date;
	setDate: (date?: Date) => void;
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-full justify-start text-left font-normal",
						!date && "text-muted-foreground"
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}

function CategoryCombobox({
	categories,
	value,
	onChange,
}: {
	categories: Category[];
	value: string;
	onChange: (value: string) => void;
}) {
	const [open, setOpen] = useState(false);
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
				>
					{value
						? categories.find((c) => c.id === value)?.name
						: "Select category..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[--radix-popover-trigger-width] p-0">
				<Command>
					<CommandInput placeholder="Search category..." />
					<CommandEmpty>No category found.</CommandEmpty>
					<CommandGroup>
						{categories.map((category) => (
							<CommandItem
								key={category.id}
								value={category.name}
								onSelect={() => {
									onChange(category.id);
									setOpen(false);
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										value === category.id ? "opacity-100" : "opacity-0"
									)}
								/>
								{category.name}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
