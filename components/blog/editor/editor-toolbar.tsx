"use client";
import { Button } from "@/components/ui/button";
import type { Editor } from "@tiptap/react";

export function EditorToolbar({ editor }: { editor: Editor | null }) {
	if (!editor) return null;

	return (
		<div className="border border-input bg-transparent rounded-md p-1 flex flex-wrap gap-1">
			<Button
				size="sm"
				variant={editor.isActive("bold") ? "secondary" : "ghost"}
				onClick={() => editor.chain().focus().toggleBold().run()}
			>
				Bold
			</Button>
			<Button
				size="sm"
				variant={editor.isActive("italic") ? "secondary" : "ghost"}
				onClick={() => editor.chain().focus().toggleItalic().run()}
			>
				Italic
			</Button>
			<Button
				size="sm"
				variant={editor.isActive("strike") ? "secondary" : "ghost"}
				onClick={() => editor.chain().focus().toggleStrike().run()}
			>
				Strike
			</Button>
			<Button
				size="sm"
				variant={
					editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
				}
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
			>
				H2
			</Button>
			<Button
				size="sm"
				variant={
					editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"
				}
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
			>
				H3
			</Button>
			<Button
				size="sm"
				variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
				onClick={() => editor.chain().focus().toggleBulletList().run()}
			>
				List
			</Button>
			<Button
				size="sm"
				variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
			>
				Quote
			</Button>
			<Button
				size="sm"
				variant="ghost"
				onClick={() => editor.chain().focus().setHorizontalRule().run()}
			>
				Divider
			</Button>
		</div>
	);
}
