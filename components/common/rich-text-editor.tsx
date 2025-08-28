"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import {
	Bold,
	Italic,
	List,
	ListOrdered,
	Quote,
	Undo,
	Redo,
	Heading1,
	Heading2,
	Heading3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
	className?: string;
}

export function RichTextEditor({
	content,
	onChange,
	placeholder,
	className,
}: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				bulletList: {
					keepMarks: true,
					keepAttributes: false,
				},
				orderedList: {
					keepMarks: true,
					keepAttributes: false,
				},
			}),
		],
		content,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class:
					"prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
			},
		},
	});

	if (!editor) {
		return null;
	}

	return (
		<div className={cn("border rounded-md", className)}>
			<div className="border-b p-2 flex flex-wrap gap-1">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={editor.isActive("bold") ? "bg-muted" : ""}
				>
					<Bold className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={editor.isActive("italic") ? "bg-muted" : ""}
				>
					<Italic className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
				>
					<Heading1 className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
				>
					<Heading2 className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
				>
					<Heading3 className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={editor.isActive("bulletList") ? "bg-muted" : ""}
				>
					<List className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={editor.isActive("orderedList") ? "bg-muted" : ""}
				>
					<ListOrdered className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className={editor.isActive("blockquote") ? "bg-muted" : ""}
				>
					<Quote className="h-4 w-4" />
				</Button>
				<div className="w-px h-6 bg-border mx-1" />
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().undo()}
				>
					<Undo className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().redo()}
				>
					<Redo className="h-4 w-4" />
				</Button>
			</div>
			<EditorContent
				editor={editor}
				className="min-h-[200px]"
				placeholder={placeholder}
			/>
		</div>
	);
}
