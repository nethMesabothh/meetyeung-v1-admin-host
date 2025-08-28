"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
	SUPPORTED_LANGUAGES,
	DEFAULT_LANGUAGE_CODE,
} from "@/lib/types/languages";
import type { LocalizedField } from "@/lib/types/category";
import { Label } from "@/components/ui/label";
import { Globe, Check } from "lucide-react";
import { RichTextEditor } from "./rich-text-editor";

interface MultilingualRichTextEditorProps {
	value: LocalizedField;
	onChange: (value: LocalizedField) => void;
	label: string;
	placeholder?: string;
	errors?: Record<string, string>;
	className?: string;
	activeLanguage?: string;
	onLanguageChange?: (language: string) => void;
}

export function MultilingualRichTextEditor({
	value,
	onChange,
	label,
	placeholder,
	errors,
	className,
	activeLanguage,
	onLanguageChange,
}: MultilingualRichTextEditorProps) {
	const [activeLang, setActiveLang] = useState(DEFAULT_LANGUAGE_CODE);

	useEffect(() => {
		if (activeLanguage && activeLanguage !== activeLang) {
			setActiveLang(activeLanguage);
		}
	}, [activeLanguage, activeLang]);

	const handleLanguageChange = (langCode: string) => {
		setActiveLang(langCode);
		if (onLanguageChange) {
			onLanguageChange(langCode);
		}
	};

	const handleContentChange = (content: string) => {
		onChange({ ...value, [activeLang]: content });
	};

	const activeError = errors?.[activeLang];

	const getLanguageStatus = (langCode: string) => {
		const hasContent = Boolean(value[langCode]?.trim());
		const hasError = Boolean(errors?.[langCode]);
		return { hasContent, hasError };
	};

	return (
		<div className={cn("space-y-3", className)}>
			<div className="flex items-center gap-2">
				<Globe className="h-4 w-4 text-muted-foreground" />
				<Label className="text-sm font-medium">{label}</Label>
			</div>

			{/* Language tabs */}
			<div className="relative">
				<div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border">
					{SUPPORTED_LANGUAGES.map((lang) => {
						const { hasContent, hasError } = getLanguageStatus(lang.code);
						const isActive = activeLang === lang.code;

						return (
							<button
								key={lang.code}
								type="button"
								onClick={() => handleLanguageChange(lang.code)}
								className={cn(
									"relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
									isActive
										? "bg-background text-foreground shadow-sm border"
										: "text-muted-foreground hover:text-foreground hover:bg-background/50",
									hasError && !isActive && "text-destructive",
									hasError && isActive && "border-destructive/50"
								)}
							>
								<span className="flex items-center gap-1.5">
									<span className="text-xs font-mono uppercase tracking-wide">
										{lang.code}
									</span>
									<span className="hidden sm:inline">{lang.nativeName}</span>
								</span>

								{hasContent && !hasError && (
									<Check className="h-3 w-3 text-green-600" />
								)}
								{hasError && (
									<div className="h-2 w-2 rounded-full bg-destructive" />
								)}
								{!hasContent && !hasError && (
									<div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
								)}
							</button>
						);
					})}
				</div>
			</div>

			{/* Rich text editor */}
			<div className="space-y-2">
				<RichTextEditor
					key={activeLang} // Force re-render when language changes
					content={value[activeLang] || ""}
					onChange={handleContentChange}
					placeholder={`${placeholder || "Enter content"} in ${
						SUPPORTED_LANGUAGES.find((l) => l.code === activeLang)?.nativeName
					}`}
					className={cn(activeError && "border-destructive")}
				/>

				{activeError && (
					<div className="flex items-center gap-2 text-xs text-destructive">
						<div className="h-1 w-1 rounded-full bg-destructive" />
						{activeError}
					</div>
				)}

				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<span>
						{
							SUPPORTED_LANGUAGES.filter((lang) => value[lang.code]?.trim())
								.length
						}{" "}
						of {SUPPORTED_LANGUAGES.length} languages completed
					</span>
				</div>
			</div>
		</div>
	);
}
