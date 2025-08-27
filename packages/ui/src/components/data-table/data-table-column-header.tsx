import { type Column } from '@tanstack/react-table';
import { Button } from '../button/button';
import { cn } from '../../lib/utils';
import { DropdownMenu } from '../dropdown/dropdown-menu';
import { ChevronsUpDown } from 'lucide-react';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div className={cn('text-sm font-bold text-secondary-text', className)}>
        {title}
      </div>
    );
  }

  const options = [
    { label: 'Asc', value: 'asc' },
    { label: 'Desc', value: 'desc' },
    // { label: "Hide", value: "hide" },
  ];

  const handleSelect = (value: string) => {
    if (value === 'asc') {
      column.toggleSorting(false);
    } else if (value === 'desc') {
      column.toggleSorting(true);
    } else if (value === 'hide') {
      column.toggleVisibility(false);
    }
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu options={options} onSelect={handleSelect} align="start">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 flex h-8 w-full max-w-[7.75rem] justify-between"
        >
          <span className="text-sm font-bold text-secondary-text">{title}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 text-secondary-text" />
        </Button>
      </DropdownMenu>
    </div>
  );
}
