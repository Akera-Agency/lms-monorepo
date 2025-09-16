import React from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, Trash2, University } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
  type PaginationState,
} from "@tanstack/react-table";
import { Button } from "../../../../packages/ui/src/components/shadcn/button";
import { Checkbox } from "../../../../packages/ui/src/components/shadcn/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../packages/ui/src/components/shadcn/dropdown-menu";
import { Input } from "../../../../packages/ui/src/components/shadcn/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../packages/ui/src/components/table/table";
import { Skeleton } from "../../../../packages/ui/src/components/skeleton/skeleton";
import { ConfirmDeleteDialog } from "../../../../packages/ui/src/components/dialog/confirm-dialog";
import { EmptyState } from "../../../../packages/ui/src/components/empty-states/empty-state";
import type { Table as TanstackTable } from "@tanstack/react-table";
import type { TenantEntity } from "elysia-app/src/modules/tenants/infrastructure/tenant.entity";

interface DataTableProps<T> {
    data: T[];
    loading: boolean;
    getColumns: (args: { deleteData?: (id: any) => Promise<void> }) => ColumnDef<T>[];
    deleteData?: (id: any) => Promise<void>;
    filterKey?: keyof T; // optional column key for the search input
  }
  
  export default function DataTable<T>({
    data,
    loading,
    getColumns,
    deleteData,
    filterKey,
  }: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 6,
    });
  
    const columns = useMemo(() => getColumns({ deleteData }), [getColumns, deleteData]);
  
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      onPaginationChange: setPagination,
      state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
    });
  
    const selectedRowIds = table.getSelectedRowModel().rows.map((row) => row.original);
    const hasSelected = selectedRowIds.length > 0;
  
    const handleBulkDelete = useCallback(async () => {
      if (!deleteData) return;
      try {
        for (const row of table.getSelectedRowModel().rows) {
          await deleteData(row.original);
        }
        table.resetRowSelection();
      } catch (error) {
        console.error("Bulk delete failed:", error);
      }
    }, [deleteData, table]);
  
    return (
      <div className="flex flex-col h-full overflow-auto custom-hidden-scrollbar">
        {loading ? (
          <LoadingSkeleton />
        ) : data.length === 0 ? (
          <EmptyState title="No data" description="No items to display." icon={undefined} />
        ) : (
          <div className="w-full rounded-lg text-neutral-500">
            {filterKey && (
              <div className="flex items-center py-4 gap-7 justify-end">
                <Input
                  className="max-w-sm lg:text-sm text-xs border-neutral-700 bg-neutral-900 text-white"
                  placeholder={`Filter by ${String(filterKey)}...`}
                  value={(table.getColumn(String(filterKey))?.getFilterValue() as string) ?? ""}
                  onChange={(e) => table.getColumn(String(filterKey))?.setFilterValue(e.target.value)}
                />
              </div>
            )}
  
            <div className="overflow-hidden rounded-md border border-neutral-700">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="bg-neutral-800/50 text-neutral-300">
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="text-neutral-300 lg:text-sm text-xs px-2.5 py-2">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="border-b border-neutral-700 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="lg:text-sm text-xs px-2.5 py-2">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
  
            <div className="flex items-center justify-between py-4">
              <div className="sm:text-sm text-xs flex items-end flex-row gap-3 text-neutral-400">
                {hasSelected && deleteData && (
                  <ConfirmDeleteDialog
                    trigger={<Trash2 className="md:h-6 md:w-6 h-5 w-5 text-red-500 cursor-pointer" />}
                    title="Confirm Deletion"
                    description={`Are you sure you want to delete ${selectedRowIds.length} item(s)?`}
                    closeText="Cancel"
                    confirmText="Delete"
                    onConfirm={handleBulkDelete}
                  />
                )}
                {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <PaginationControls table={table} />
            </div>
          </div>
        )}
      </div>
    );
  }

  function LoadingSkeleton() {
    return (
      <>
        <div className="py-4 justify-end flex gap-7 mt-6">
          <Skeleton className="h-7 w-1/3 rounded-md bg-neutral-800" />
        </div>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-7 w-full rounded-md bg-neutral-800 mb-2" />
        ))}
      </>
    );
  }
  
  function PaginationControls({ table }: { table: TanstackTable<any> }) {
    return (
      <div className="flex items-center space-x-2">
        <p className="sm:text-sm text-xs text-neutral-400">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="cursor-pointer hidden md:flex"
        >
          Previous
        </Button>
        <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="cursor-pointer md:hidden flex w-2 h-2">
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="cursor-pointer hidden md:flex"
        >
          Next
        </Button>
        <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="cursor-pointer md:hidden flex w-2 h-2">
          <ChevronRight />
        </Button>
      </div>
    );
  }
  
  