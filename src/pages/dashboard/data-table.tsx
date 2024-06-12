"use client";

import { useEffect, useState } from "react";

import {
  ColumnDef,
  SortingState,
  getSortedRowModel,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClipLoader from "react-spinners/ClipLoader";
import { PlusCircle, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  selectedItems: TData[];
  setSelectedItems: (items: TData[]) => void;
  handleDeleteItems: () => void;
}

export function DashboardDataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  selectedItems,
  setSelectedItems,
  handleDeleteItems,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [filterUpcoming, setFilterUpcoming] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    setSelectedItems(
      table.getFilteredSelectedRowModel().rows.map((row) => row.original)
    );
  }, [rowSelection, setSelectedItems, table]);

  const handleFilterUpcomingChange = (checked: boolean) => {
    setFilterUpcoming(checked);
    if (checked) {
      table.getColumn("start")?.setFilterValue(true);
    } else {
      table.getColumn("start")?.setFilterValue(undefined);
    }
  };

  return (
    <div>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter meeting title...'
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        <div className='flex ml-auto'>
          <Dialog>
            <DialogTrigger>
              <Button className='mx-2'>
                <PlusCircle className='h-3.5 w-3.5 mr-1' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Add Meeting
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>haha</DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={selectedItems.length === 0}
                variant='outline'
                className='mr-2'
              >
                <Trash2 className='h-3.5 w-3.5 mr-1' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Delete
                </span>
              </Button>
            </AlertDialogTrigger>
            <ConfirmDialog handleConfirm={handleDeleteItems} />
          </AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className='mr-2'>
              <Button variant='outline'>Filter</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='center'>
              <DropdownMenuCheckboxItem
                className='capitalize'
                checked={filterUpcoming}
                onCheckedChange={handleFilterUpcomingChange}
              >
                Upcoming Meetings
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='ml-auto'>
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
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
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  <ClipLoader color='#36d7b7' />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel()?.rows.length} of{" "}
          {table.getFilteredRowModel()?.rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
