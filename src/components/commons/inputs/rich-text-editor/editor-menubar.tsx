import React from 'react'
import {type Editor, useEditorState} from "@tiptap/react"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Toggle} from "@/components/ui/toggle";
import {Bold, Italic, Underline, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon, Table as TableIcon, Code, Redo2, Undo2, AlignLeft, AlignCenter, AlignRight, Paintbrush2 } from "lucide-react";
import {cn} from "@/lib/utils";
interface  IProps {
  editor: Editor | null
}

interface IButtonTooltipMenuProps {
  children: React.ReactNode,
  tooltipText?: string,
  onClick?: () => void,
  className?: string,
  toggle?: boolean,
}

const ButtonTooltipMenu = ({children, tooltipText, onClick, className,toggle}: IButtonTooltipMenuProps) => {

  return(
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          size={"sm"}
          pressed={toggle}
          onPressedChange={onClick}
          className={cn(toggle ? "bg-muted text-muted-foreground" : "")}
        >
          {children}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  )
};

const EditorMenubar = ({editor} : IProps) => {

  if(!editor)
    return null;

  const editorState = useEditorState({
    editor: editor,
    selector: ctx => {
      return {
        isBold: ctx.editor.isActive("bold"),
        isItalic: ctx.editor.isActive("italic"),
        isUnderlined: ctx.editor.isActive("underline"),
        isHeading1: ctx.editor.isActive("heading", { level: 1 }),
        isHeading2: ctx.editor.isActive("heading", { level: 2 }),
        isHeading3: ctx.editor.isActive("heading", { level: 3 }),
        isBulletList: ctx.editor.isActive("bulletList"),
        isOrderedList: ctx.editor.isActive("orderedList"),
        isBlockquote: ctx.editor.isActive("blockquote"),
        isLink: ctx.editor.isActive("link"),
        isImage: ctx.editor.isActive("image"),
        isTable: ctx.editor.isActive("table"),
        isCodeBlock: ctx.editor.isActive("codeBlock"),
        isAlignLeft: ctx.editor.isActive({ textAlign: "left" }),
        isAlignCenter: ctx.editor.isActive({ textAlign: "center" }),
        isAlignRight: ctx.editor.isActive({ textAlign: "right" }),
      }
    }
  })


  return (
    <div className="w-full flex items-center justify-between p-2 bg-muted rounded-tl-md rounded-tr-md">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          {/* Headings */}
          <ButtonTooltipMenu tooltipText={"Heading 1"} toggle={editorState.isHeading1} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 /></ButtonTooltipMenu>
          <ButtonTooltipMenu tooltipText={"Heading 2"} toggle={editorState.isHeading2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 /></ButtonTooltipMenu>
          <ButtonTooltipMenu tooltipText={"Heading 3"} toggle={editorState.isHeading3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 /></ButtonTooltipMenu>
          {/* Paragraph/blockquote */}
          <ButtonTooltipMenu tooltipText={"Blockquote"} toggle={editorState.isBlockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote /></ButtonTooltipMenu>
          {/* Lists */}
          <ButtonTooltipMenu tooltipText={"Bullet List"} toggle={editorState.isBulletList} onClick={() => editor.chain().focus().toggleBulletList().run()}><List /></ButtonTooltipMenu>
          <ButtonTooltipMenu tooltipText={"Ordered List"} toggle={editorState.isOrderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered /></ButtonTooltipMenu>
          {/* Bold/Italic/Underline */}
          <ButtonTooltipMenu tooltipText={"Bold"} toggle={editorState.isBold} onClick={() => editor.chain().focus().toggleBold().run()}><Bold /></ButtonTooltipMenu>
          <ButtonTooltipMenu tooltipText={"Italic"} toggle={editorState.isItalic} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic /></ButtonTooltipMenu>
          <ButtonTooltipMenu tooltipText={"Underline"} toggle={editorState.isUnderlined} onClick={() => editor.chain().focus().toggleUnderline().run()}><Underline /></ButtonTooltipMenu>
          {/* Link/Image */}
          <ButtonTooltipMenu tooltipText={"Link"} toggle={editorState.isLink} onClick={() => { const url = window.prompt('Enter URL'); if (url) editor.chain().focus().setLink({ href: url }).run(); }}><LinkIcon /></ButtonTooltipMenu>

        
          {/* Code block */}
          <ButtonTooltipMenu tooltipText={"Code Block"} toggle={editorState.isCodeBlock} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code /></ButtonTooltipMenu>
          {/* Text color */}
          <ButtonTooltipMenu tooltipText={"Text Color"} onClick={() => { const color = window.prompt('Enter hex color'); if (color) editor.chain().focus().setColor(color).run(); }}><Paintbrush2 /></ButtonTooltipMenu>
          {/* Alignment */}
          <ButtonTooltipMenu tooltipText={"Align Left"} toggle={editorState.isAlignLeft} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft /></ButtonTooltipMenu>
          <ButtonTooltipMenu tooltipText={"Align Center"} toggle={editorState.isAlignCenter} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter /></ButtonTooltipMenu>
          <ButtonTooltipMenu tooltipText={"Align Right"} toggle={editorState.isAlignRight} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight /></ButtonTooltipMenu>
          {/* Undo/Redo */}
          <ButtonTooltipMenu tooltipText={"Undo"} onClick={() => editor.chain().focus().undo().run()}><Undo2 /></ButtonTooltipMenu>
          <ButtonTooltipMenu tooltipText={"Redo"} onClick={() => editor.chain().focus().redo().run()}><Redo2 /></ButtonTooltipMenu>
        </div>
      </TooltipProvider>
    </div>
  )
}
export default EditorMenubar
