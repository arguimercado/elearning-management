"use client"

import {EditorContent, useEditor} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit";
import EditorMenubar from "@/components/commons/inputs/rich-text-editor/editor-menubar";

import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";

import { useEffect } from "react";
import {TextStyleKit} from "@tiptap/extension-text-style";


interface RichTextEditorProps {
  value?: any;
  onChange?: (html: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      // Add your Tiptap extensions here
      StarterKit,
      TextStyleKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
    ],
    content: value || '<p></p>',
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[300px] !w-full !max-w-none p-4 prose sm:prose-xl  dark:prose-invert",
      },
    }
  });

  return (
    <div className="w-full flex flex-col border border-input rounded-lg overflow-hidder dark:bg-input/30 overflow-hidden">
      <EditorMenubar editor={editor} />
      <EditorContent editor={editor} />
  </div>)
}

export default  RichTextEditor;