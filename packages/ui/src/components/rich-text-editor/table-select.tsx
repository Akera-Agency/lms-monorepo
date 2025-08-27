import { ChevronDown, Table } from 'lucide-react';
import { DropdownMenu } from '../dropdown/dropdown-menu';
import { Button } from '../button/button';
import { Editor } from '@tiptap/core';

type TableSelectProps = {
  editor: Editor | null;
};

const TableSelect = ({ editor }: TableSelectProps) => {
  const TABLE_OPERATIONS = [
    { label: 'Insert Table', value: 'insert_table' },
    { label: 'Delete Table', value: 'delete_table' },
    {
      label: 'Insert Row Above',
      value: 'insert_row_above',
      disabled: !editor?.can().addColumnBefore(),
    },
    {
      label: 'Insert Row Below',
      value: 'insert_row_below',
      disabled: !editor?.can().addColumnAfter(),
    },
    {
      label: 'Delete Row',
      value: 'delete_row',
      disabled: !editor?.can().deleteRow(),
    },
    {
      label: 'Insert Column Before',
      value: 'insert_column_before',
      disabled: !editor?.can().addColumnBefore(),
    },
    {
      label: 'Insert Column After',
      value: 'insert_column_after',
      disabled: !editor?.can().addColumnAfter(),
    },
    {
      label: 'Delete Column',
      value: 'delete_column',
      disabled: !editor?.can().deleteColumn(),
    },
  ];

  const handleTableOperation = (value: string) => {
    if (!editor) return;

    switch (value) {
      case 'insert_table':
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
        break;
      case 'delete_table':
        editor.chain().focus().deleteTable().run();
        break;
      case 'insert_row_above':
        editor.chain().focus().addRowBefore().run();
        break;
      case 'insert_row_below':
        editor.chain().focus().addRowAfter().run();
        break;
      case 'delete_row':
        editor.chain().focus().deleteRow().run();
        break;
      case 'insert_column_before':
        editor.chain().focus().addColumnBefore().run();
        break;
      case 'insert_column_after':
        editor.chain().focus().addColumnAfter().run();
        break;
      case 'delete_column':
        editor.chain().focus().deleteColumn().run();
        break;
      default:
        break;
    }
  };

  return (
    <DropdownMenu
      options={TABLE_OPERATIONS}
      onSelect={(value) => handleTableOperation(value)}
    >
      <Button variant="ghost" className="text-primary-text" type="button">
        <Table /> Table
        <ChevronDown />
      </Button>
    </DropdownMenu>
  );
};

export default TableSelect;
