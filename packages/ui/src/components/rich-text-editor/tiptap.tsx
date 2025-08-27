import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './toolbar';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
// import Text from "@tiptap/extension-text";
import { TextStyle } from '@tiptap/extension-text-style';
import { TextAlign } from '@tiptap/extension-text-align';
import BulletList from '@tiptap/extension-bullet-list';
import { FontSize } from './font-size';
import { cn } from '../../lib/utils';
import { useEffect } from 'react';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { Typography } from '@tiptap/extension-typography';
import ListItem from '@tiptap/extension-list-item';
import { OrderedList } from '@tiptap/extension-ordered-list';

type TipTapProps = {
  content: string;
  onChange: (newContent: string) => void;
  className?: string;
  wrapperClassName?: string;
};

const Tiptap = ({
  onChange,
  content,
  className,
  wrapperClassName,
}: TipTapProps) => {
  const handleChange = (newContent: string) => {
    onChange(newContent);
  };
  const editor: Editor | null = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      FontSize.configure({
        types: ['textStyle'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Typography,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc pl-4',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal pl-4',
        },
      }),
      ListItem,
    ],
    content: content || 'Your description here',
    editorProps: {
      attributes: {
        class: [
          'px-4 py-3 border-b border-r border-l grow w-full h-full min-h-[15.65rem] overflow-y-scroll gap-3 font-normal text-[14px] pt-4 rounded-bl-xl rounded-br-xl outline-none tiptap',
          className,
        ].join(' '),
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div
      className={cn(
        'flex h-full w-full grow flex-col [&>*:nth-child(2)]:grow',
        wrapperClassName
      )}
    >
      <Toolbar editor={editor} content={content} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
