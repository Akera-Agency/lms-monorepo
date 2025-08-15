import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  ListOrderedIcon,
  Redo,
  Strikethrough,
  Type,
  Underline,
  Undo,
} from 'lucide-react'
import { Toggle } from '../shadcn/toggle'
import { ColorSelect } from './color-select'
import { Editor } from '@tiptap/react'
import { Select } from '../form/select'
import TableSelect from './table-select'

type ToolbarProps = {
  editor: Editor | null
  content: string
}

const Toolbar = ({ editor }: ToolbarProps) => {
  if (!editor) {
    return null
  }

  const handleFontSizeChange = (value: string) => {
    if (!editor) return

    if (value === 'unset') {
      editor.chain().focus().unsetFontSize().run()
    } else {
      editor.chain().focus().setFontSize(value).run()
    }
  }

  return (
    <div className="flex w-full flex-wrap items-start justify-between rounded-tl-xl rounded-tr-xl border bg-tooltip-background px-2 py-0">
      <div className="flex w-full flex-wrap items-center justify-start">
        <div className="flex items-center gap-1">
          <Type className="h-4 w-4" />
          <Select
            items={[
              { label: '12px', value: '12px' },
              { label: '14px', value: '14px' },
              { label: '16px', value: '16px' },
              { label: '18px', value: '18px' },
              { label: '20px', value: '20px' },
              { label: '24px', value: '24px' },
              { label: '32px', value: '32px' },
            ]}
            onChange={handleFontSizeChange}
            className="border-0 bg-tooltip-background p-0"
            triggerClassName="w-full"
          />

          <ColorSelect editor={editor} />
        </div>
        <Toggle
          pressed={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? '' : ''}
        >
          <Bold className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? '' : ''}
        >
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? '' : ''}
        >
          <Underline className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? '' : ''}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? '' : ''}
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? '' : ''}
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? '' : ''}
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? '' : ''}
        >
          <ListOrderedIcon className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? '' : ''}
        >
          <List className="h-4 w-4" />
        </Toggle>

        {/* <Toggle>
          <ImageIcon className="h-4 w-4" />
        </Toggle>
        <Toggle>
          <Paperclip className="h-4 w-4" />
        </Toggle> */}

        <Toggle pressed={false} onClick={() => editor.chain().focus().undo().run()}>
          <Undo className="h-4 w-4" />
        </Toggle>

        <Toggle pressed={false} onClick={() => editor.chain().focus().redo().run()} className="">
          <Redo className="h-4 w-4" />
        </Toggle>
        <TableSelect editor={editor} />
      </div>
    </div>
  )
}

export default Toolbar
