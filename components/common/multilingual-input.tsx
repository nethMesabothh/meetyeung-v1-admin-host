"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
	Language,
	SUPPORTED_LANGUAGES,
	DEFAULT_LANGUAGE_CODE,
} from "@/lib/types/languages";
import { LocalizedField } from "@/lib/types/category";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface MultilingualInputProps {
	value: LocalizedField;
	onChange: (value: LocalizedField) => void;
	label: string;
	placeholder?: string;
	as?: "input" | "textarea";
	// New prop to receive validation errors for each language
	errors?: Record<string, string>;
}

export function MultilingualInput({
	value,
	onChange,
	label,
	placeholder,
	as = "input",
	errors,
}: MultilingualInputProps) {
	const [activeLang, setActiveLang] = useState(DEFAULT_LANGUAGE_CODE);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		onChange({ ...value, [activeLang]: e.target.value });
	};

	const InputComponent = as === "textarea" ? Textarea : Input;
	const activeError = errors?.[activeLang];

	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			{/* Language Tabs */}
			<div className="flex items-center gap-1 border-b">
				{SUPPORTED_LANGUAGES.map((lang) => {
					const hasError = Boolean(errors?.[lang.code]);
					return (
						<button
							key={lang.code}
							type="button"
							onClick={() => setActiveLang(lang.code)}
							className={cn(
								"px-3 py-1.5 text-sm font-medium rounded-t-md border-b-2 transition-colors",
								activeLang === lang.code
									? "border-primary text-primary bg-primary/10"
									: "border-transparent text-muted-foreground hover:bg-muted",
								// Add a red border to tabs with errors
								hasError && "border-destructive/50 text-destructive"
							)}
						>
							{lang.nativeName}
						</button>
					);
				})}
			</div>
			{/* Input Field */}
			<InputComponent
				value={value[activeLang] || ""}
				onChange={handleInputChange}
				placeholder={`${placeholder || "Enter value"} in ${
					SUPPORTED_LANGUAGES.find((l) => l.code === activeLang)?.nativeName
				}`}
				className={cn(
					activeError && "border-destructive focus-visible:ring-destructive"
				)}
			/>
			{/* Display error message for the active tab */}
			{activeError && <p className="text-xs text-destructive">{activeError}</p>}
		</div>
	);
}
