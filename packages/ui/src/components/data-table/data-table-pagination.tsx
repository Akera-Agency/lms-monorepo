import { Button } from '../button/button';
import { cn } from '../../lib/utils';

import { type Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  meta?: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

export function DataTablePagination<TData>({
  table,
  meta,
}: DataTablePaginationProps<TData>) {
  const { pageIndex } = table.getState().pagination;
  const totalPages = meta?.totalPages ?? 1;

  const getPageNumbers = () => {
    const pagesToShow = 3;
    const pageNumbers = [];

    if (totalPages <= pagesToShow + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (pageIndex < pagesToShow) {
      pageNumbers.push(
        ...Array.from({ length: pagesToShow }, (_, i) => i + 1),
        '...',
        totalPages
      );
    } else if (pageIndex >= totalPages - pagesToShow) {
      pageNumbers.push(
        1,
        '...',
        ...Array.from(
          { length: pagesToShow },
          (_, i) => totalPages - pagesToShow + i + 1
        )
      );
    } else {
      pageNumbers.push(
        1,
        '...',
        pageIndex,
        pageIndex + 1,
        pageIndex + 2,
        '...',
        totalPages
      );
    }

    return pageNumbers;
  };
  const totalCount = meta?.totalCount
    ? meta?.totalCount
    : table.getFilteredRowModel().rows.length;
  return (
    <div className="flex items-center justify-between rounded-b-2xl border-t bg-white px-4 py-3">
      <div>
        <span className="text-sm font-normal text-neutral-800">
          Showing{' '}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}
          -
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            totalCount
          )}{' '}
          of
          {totalCount} results
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          className="flex h-9 w-9 items-center gap-3"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-6 w-6 font-bold text-neutral-800" />
        </Button>

        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, index) =>
            typeof page === 'string' ? (
              <span key={index} className="text-sm font-bold">
                ...
              </span>
            ) : (
              <Button
                key={index}
                variant="ghost"
                onClick={() => table.setPageIndex(page - 1)}
                className={cn(
                  'h-9 w-9 p-0 text-sm transition-colors',
                  pageIndex === page - 1
                    ? 'bg-primary text-white hover:bg-primary'
                    : 'text-neutral-800'
                )}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="ghost"
          className="flex h-9 w-9 items-center gap-3"
          onClick={() => table.nextPage()}
          disabled={meta?.currentPage === meta?.totalPages}
        >
          <ChevronRight className="h-6 w-6 text-neutral-800" />
        </Button>
      </div>
    </div>
  );
}
