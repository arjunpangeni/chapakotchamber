'use client'

import { useEffect, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  onSaveStatusChange?: (status: 'idle' | 'saving' | 'saved' | 'error' | 'restored') => void
}

export default function RichTextEditor({ value, onChange, onSaveStatusChange }: RichTextEditorProps) {
  const [message, setMessage] = useState<'idle' | 'saving' | 'saved' | 'error' | 'restored'>('idle')

  const editor = useEditor({
    immediatelyRender: false,
    content: value || '',
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: true,
          linkOnPaste: true,
        },
      }),
      Placeholder.configure({
        placeholder: 'Write your content here...',
      }),
    ],
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '')
    }
  }, [editor, value])

  useEffect(() => {
    if (onSaveStatusChange) {
      onSaveStatusChange(message)
    }
  }, [message, onSaveStatusChange])

  const toolbarItem = (label: string, onClick: () => void, active?: boolean) => (
    <Button
      variant={active ? 'default' : 'outline'}
      size="sm"
      onClick={onClick}
      className={active ? 'bg-emerald-100 text-emerald-800' : ''}
      type="button"
    >
      {label}
    </Button>
  )

  if (!editor) {
    return (
      <div className="border rounded-lg p-4 space-y-3 bg-white text-center text-sm text-muted-foreground">
        Loading editor...
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-white">
      <div className="flex flex-wrap gap-2 mb-2">
        {toolbarItem('H1', () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive('heading', { level: 1 }))}
        {toolbarItem('H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }))}
        {toolbarItem('Bold', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
        {toolbarItem('Italic', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
        {toolbarItem('Bullet', () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
        {toolbarItem('Number', () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
        {toolbarItem('Link', () => {
          if (!editor) return
          const previousUrl = editor.getAttributes('link').href
          const url = window.prompt('Enter URL', previousUrl || 'https://')
          if (url === null) return
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
          }
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        })}
      </div>

      <div className="h-80 overflow-y-auto border rounded p-3">
        {editor ? <EditorContent editor={editor} /> : <p>Loading editor...</p>}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {message === 'saving' && 'Saving...'}
          {message === 'saved' && 'Saved'}
          {message === 'error' && 'Error saving'}
          {message === 'restored' && 'Draft restored'}
          {message === 'idle' && 'Idle'}
        </span>
      </div>
    </div>
  )
}
