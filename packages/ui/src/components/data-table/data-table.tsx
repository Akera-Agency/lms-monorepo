import {
  type ColumnDef,
  flexRender,
  type Table as TTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shadcn/table";

import { DataTablePagination } from "./data-table-pagination";
import TableRowSkeleton from "./skeletons/table-skeleton";

interface DataTableProps<TData, TValue> {
  table: TTable<TData>;
  columns: ColumnDef<TData, TValue>[];
  withPagination?: boolean;
  isLoading?: boolean;
  meta: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export function DataTable<TData, TValue>({
  table,
  columns,
  withPagination = false,
  isLoading,
  meta,
}: DataTableProps<TData, TValue>) {
  return (
    <div>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-primary-100 hover:bg-primary-100"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="hover:bg-primary-100 data-[state=selected]:bg-primary-100"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isLoading ? (
              <>
                <TableRowSkeleton columnCount={columns.length} />
                <TableRowSkeleton columnCount={columns.length} />
                <TableRowSkeleton columnCount={columns.length} />
                <TableRowSkeleton columnCount={columns.length} />
                <TableRowSkeleton columnCount={columns.length} />
                <TableRowSkeleton columnCount={columns.length} />
                <TableRowSkeleton columnCount={columns.length} />
                <TableRowSkeleton columnCount={columns.length} />
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {withPagination && <DataTablePagination table={table} meta={meta} />}
    </div>
  );
}
