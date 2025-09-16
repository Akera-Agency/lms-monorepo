import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, Trash2, University } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { SuperAdminQueries } from "@/queries/super-tenant-queries";
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
import { showRolesDialog } from "@/utils/dialogs/roles-dialog-utils";
import { showTenantsDialog } from "@/utils/dialogs/tenants-dialog-utils";

export default function DataTable() {
  const { deleteTenant } = SuperAdminQueries();
    const { tenants, loading } = SuperAdminQueries().tenants();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });

  const columns = useMemo<ColumnDef<TenantEntity>[]>(() => getColumns(deleteTenant), [deleteTenant]);

  const table = useReactTable({
    data: tenants,
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

  const selectedRowIds = table.getSelectedRowModel().rows.map((row) => row.original.id);
  const hasSelected = selectedRowIds.length > 0;

  const handleBulkDelete = useCallback(async () => {
    try {
      for (const row of table.getSelectedRowModel().rows) {
        await deleteTenant(row.original.id);
      }
      table.resetRowSelection();
    } catch (error) {
      console.error("Bulk delete failed:", error);
    }
  }, [deleteTenant, table]);

  return (
    <div className="flex flex-col h-full overflow-auto custom-hidden-scrollbar">
      {loading ? (
        <LoadingSkeleton />
      ) : tenants.length === 0 ? (
        <EmptyState
          icon={<University />}
          title="No tenants yet"
          description="Tenants will appear here once they get created."
        />
      ) : (
        <div className="w-full rounded-lg text-neutral-500">
          <div className="flex items-center py-4 gap-7 justify-end">
            <Input
              className="max-w-sm lg:text-sm text-xs border-neutral-700 bg-neutral-900 text-white"
              placeholder="Filter by tenant name..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
            />
          </div>

          <div className="overflow-hidden rounded-md border border-neutral-700">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-neutral-800/50 text-neutral-300">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-neutral-300 lg:text-sm text-xs px-2.5 py-2">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="border-b border-neutral-700 transition-colors">
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
              {hasSelected && (
                <ConfirmDeleteDialog
                  trigger={<Trash2 className="md:h-6 md:w-6 h-5 w-5 text-red-500 cursor-pointer" />}
                  title="Confirm Deletion"
                  description={
                    selectedRowIds.length === 1
                      ? "Are you sure you want to delete this tenant?"
                      : `Are you sure you want to delete these ${selectedRowIds.length} tenants?`
                  }
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

function getColumns(
  deleteTenant: (id: string) => Promise<void>,
): ColumnDef<TenantEntity>[] {

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="cursor-pointer data-[state=checked]:bg-red-600"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="cursor-pointer data-[state=checked]:bg-red-600"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      id: "name",
      header: "Name",
      cell: ({ getValue }) => <div className="capitalize">{getValue<string>()}</div>,
      filterFn: "includesString",
    },
    {
      accessorKey: "description",
      id: "description",
      header: "Description",
      cell: ({ getValue }) => <div className="lowercase">{getValue<string>()}</div>,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 cursor-pointer"
        >
          Date submitted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const rawDate = row.getValue("created_at") as string;
        const date = new Date(rawDate);
        const formatted = `${date.toLocaleDateString("en-CA")} at ${date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
        return <div>{formatted}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="cursor-pointer h-8 w-8 ml-2">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border bg-neutral-900 border-neutral-800 text-neutral-400">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // showTenantsDialog(row.original.id);
            }}
            className="cursor-pointer text-neutral-300 focus:bg-neutral-800 focus:text-white"
          >
            Add User
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              e.stopPropagation();
              showTenantsDialog(row.original.id);
            }}
            className="cursor-pointer text-neutral-300 focus:bg-neutral-800 focus:text-white"
          >
            Edit Tenant
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              e.stopPropagation();
              showRolesDialog(row.original.id);
            }}
            className="cursor-pointer text-neutral-300 focus:bg-neutral-800 focus:text-white"
          >
            Edit Roles
          </DropdownMenuItem>

            <ConfirmDeleteDialog
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="cursor-pointer text-red-500 focus:bg-neutral-800 focus:text-red-600"
                >
                  Remove
                </DropdownMenuItem>
              }
              title="Confirm Deletion"
              description="Are you sure you want to delete this tenant?"
              closeText="Cancel"
              confirmText="Delete"
              onConfirm={async () => {
                await deleteTenant(row.original.id);
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
