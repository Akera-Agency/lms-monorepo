import { ChevronLeft, ChevronRight, MoreHorizontal, Trash2, User2 } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { useTenant } from "@/hooks/use.tenant";
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
// import type { User } from "@supabase/supabase-js";
import { ConfirmDeleteDialog } from "../../../../packages/ui/src/components/dialog/confirm-dialog";
import { EmptyState } from "../../../../packages/ui/src/components/empty-states/empty-state";
import type { Table as TanstackTable } from "@tanstack/react-table";
import { showRolesDialog } from "@/utils/roles-dialog";

export default function DataTable() {
  const { users, loading, setUsers, deleteUser } = useTenant();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });

  const columns = useMemo<ColumnDef<any>[]>(() => getColumns(setUsers, deleteUser), [setUsers, deleteUser]);

  const table = useReactTable({
    data: users,
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
      const deletedIds: string[] = [];
      for (const row of table.getSelectedRowModel().rows) {
        await deleteUser(row.original.id);
        deletedIds.push(row.original.id);
      }
      setUsers((prev) => prev.filter((user) => !deletedIds.includes(user.id)));
      table.resetRowSelection();
    } catch (error) {
      console.error("Bulk delete failed:", error);
    }
  }, [deleteUser, table]);

  return (
    <div className="flex flex-col h-full px-10  overflow-auto custom-hidden-scrollbar">
      {loading ? (
        <LoadingSkeleton />
      ) : users.length === 0 ? (
        <EmptyState
          icon={<User2 />}
          title="No users yet"
          description="Users will appear here once they signup or get invited."
        />
      ) : (
        <div className="w-full rounded-lg text-neutral-500">
          <div className="flex items-center py-4 gap-7 justify-end">
            <Input
              className="max-w-sm lg:text-sm text-xs border-neutral-700 bg-neutral-900 text-white"
              placeholder="Filter by user name..."
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
                  description={selectedRowIds.length === 1 ? 
                    "Are you sure you want to delete this user?" : 
                    `Are you sure you want to delete these ${selectedRowIds.length} users?`
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
  setUsers: React.Dispatch<React.SetStateAction<any[]>>,
  deleteUser: (id: string) => Promise<void>
  ): ColumnDef<any>[] {
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
          className="cursor-pointer data-[state=checked]:bg-red-600 "
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
      accessorKey: "email",
      id: "email",
      header: "Email",
      cell: ({ getValue }) => <div className="lowercase">{getValue<string>()}</div>,
    },
    {
      accessorFn: (row) => row.user_metadata?.role,
      id: "role",
      header: "Role",
      cell: ({ getValue }) => <div className="capitalize">{getValue<string>()}</div>,
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const invitedAt = row.original.invited_at as string | null;
        const confirmedAt = row.original.email_confirmed_at as string | null;
        if (!confirmedAt && invitedAt) return <div className="capitalize">Invited</div>;
        if (!confirmedAt && !invitedAt) return <div className="capitalize">Pending</div>;
        if (confirmedAt) return <div className="capitalize">Active</div>;
        return null;
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
                          showRolesDialog(row.original.name,row.original.role);
                        }}
                        className="cursor-pointer focus:bg-neutral-800 focus:text-white"
                      >
                        Edit
                      </DropdownMenuItem>

            <ConfirmDeleteDialog
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="cursor-pointer text-red-500 focus:bg-neutral-800 focus:text-red-600">
                    Remove
                </DropdownMenuItem>}
              title="Confirm Deletion"
              description="Are you sure you want to delete this user?"
              closeText="Cancel"
              confirmText="Delete"
              onConfirm={async () => {
                await deleteUser(row.original.id);
                setUsers((prev) => prev.filter((user) => user.id !== row.original.id));
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
