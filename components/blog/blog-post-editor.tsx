"use client";

import { useReducer, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BlogPost } from "@/lib/types/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { EditorToolbar } from "./editor/editor-toolbar";
import { BlogPostSettingsCard } from "./blog-post-settings-card";
import { CoverImageCard } from "./cover-image-card";
import { Category } from "@/lib/types/category";

// --- State Management using useReducer ---

const initialState = {
	title: "",
	isFeatured: false,
	publishedAt: undefined as Date | undefined,
	categoryId: "",
	coverImage: { file: null as File | null, preview: null as string | null },
	isSaving: false,
};

type EditorState = typeof initialState;

type EditorAction =
	| { type: "INITIALIZE"; payload: BlogPost }
	| { type: "SET_FIELD"; field: keyof EditorState; payload: any }
	| {
			type: "SET_COVER_IMAGE";
			payload: { file: File | null; preview: string | null };
	  }
	| { type: "SET_SAVING"; payload: boolean };

function editorReducer(state: EditorState, action: EditorAction): EditorState {
	switch (action.type) {
		case "INITIALIZE":
			return {
				...state,
				title: action.payload.title,
				isFeatured: action.payload.isFeatured,
				publishedAt: action.payload.publishedAt
					? new Date(action.payload.publishedAt)
					: undefined,
				categoryId: action.payload.category.id,
				coverImage: {
					file: null,
					preview: action.payload.coverImage?.url || null,
				},
			};
		case "SET_FIELD":
			return { ...state, [action.field]: action.payload };
		case "SET_COVER_IMAGE":
			return { ...state, coverImage: action.payload };
		case "SET_SAVING":
			return { ...state, isSaving: action.payload };
		default:
			return state;
	}
}

// --- Main Editor Component ---

interface BlogPostEditorProps {
	initialData: BlogPost | null;
	categories: Category[];
}

export function BlogPostEditor({
	initialData,
	categories,
}: BlogPostEditorProps) {
	const router = useRouter();
	const [state, dispatch] = useReducer(editorReducer, initialState);

	const editor = useEditor({
		extensions: [StarterKit],
		content: initialData?.content || "",
		onUpdate: ({ editor }) => {
			/* You could auto-save here */
		},
		editorProps: {
			attributes: {
				class:
					"prose prose-stone dark:prose-invert focus:outline-none max-w-none",
			},
		},
	});

	// Initialize state from props once
	useCallback(() => {
		if (initialData) {
			dispatch({ type: "INITIALIZE", payload: initialData });
		}
	}, [initialData])();

	const handleSave = async (publish: boolean) => {
		dispatch({ type: "SET_SAVING", payload: true });
		const content = editor?.getHTML() || "";

		// In a real app, you would upload state.coverImage.file here if it exists,
		// get the URL, and then save everything to your database.
		console.log("Saving post:", {
			id: initialData?.id,
			title: state.title,
			content,
			isFeatured: state.isFeatured,
			publishedAt: publish ? state.publishedAt || new Date() : undefined,
			categoryId: state.categoryId,
			coverImageFile: state.coverImage.file,
		});

		// Simulate network delay
		await new Promise((res) => setTimeout(res, 1000));

		dispatch({ type: "SET_SAVING", payload: false });
		router.push("/dashboard/blog");
	};

	return (
		<div className="p-4 sm:p-6 md:p-8">
			{/* Sticky Header */}
			<div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-between mb-6 py-4 -mx-8 px-8 border-b">
				<Input
					value={state.title}
					onChange={(e) =>
						dispatch({
							type: "SET_FIELD",
							field: "title",
							payload: e.target.value,
						})
					}
					placeholder="Your Masterpiece Title..."
					className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 h-auto p-0"
				/>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={() => handleSave(false)}
						disabled={state.isSaving}
					>
						Save Draft
					</Button>
					<Button onClick={() => handleSave(true)} disabled={state.isSaving}>
						{state.isSaving && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						{initialData?.publishedAt ? "Update" : "Publish"}
					</Button>
				</div>
			</div>

			{/* Editor Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
				{/* Main Content */}
				<div className="lg:col-span-3 space-y-4">
					<EditorToolbar editor={editor} />
					<EditorContent
						editor={editor}
						className="bg-background p-4 border rounded-md min-h-[70vh]"
					/>
				</div>

				{/* Sticky Sidebar */}
				<div className="lg:col-span-1 lg:sticky top-24 space-y-6">
					<BlogPostSettingsCard
						state={state}
						dispatch={dispatch}
						categories={categories}
					/>
					<CoverImageCard coverImage={state.coverImage} dispatch={dispatch} />
				</div>
			</div>
		</div>
	);
}
