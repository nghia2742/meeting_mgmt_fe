import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"

const data: Task[] = [
  {
    id: "FIG-123",
    projectName: "Task 1",
    date: "Dec 5",
    leader: "leader1.png",
  },
  {
    id: "FIG-122",
    projectName: "Task 2",
    date: "Dec 5",
    leader: "leader1.png",
  },
  {
    id: "FIG-121",
    projectName: "Write blog post for demo day",
    date: "Dec 5",
    leader: "leader1.png",
  },
  {
    id: "FIG-120",
    projectName: "Publish blog page",
    date: "Dec 5",
    leader: "leader1.png",
  },
  {
    id: "FIG-119",
    projectName: "Add gradients to design system",
    date: "Dec 5",
    leader: "leader1.png",
  },
  {
    id: "FIG-118",
    projectName: "Responsive behavior doesn’t work on Android",
    date: "Dec 5",
    leader: "leader1.png",
  },
  {
    id: "FIG-117",
    projectName: "Confirmation states not rendering properly",
    date: "Dec 5",
    leader: "leader1.png",
  },
  {
    id: "FIG-116",
    projectName: "Text wrapping is awkward on older iPhones",
    date: "Dec 5",
    leader: "leader1.png",
  },
  {
    id: "FIG-115",
    projectName: "Revise copy on About page",
    date: "Dec 5",
    leader: "leader1.png",
  },
]

export type Task = {
  id: string
  projectName: string
  date: string
  leader: string
}

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: "Task",
  },
  {
    accessorKey: "projectName",
    header: "Project Name",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "leader",
    header: "Leader",
    cell: ({ row }) => (
      <Image
        src={'https://github.com/shadcn.png'}
        width={0}
        height={0}
        sizes="100vw"
        className="w-8 h-auto rounded-full"
        alt="Leader"
      />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>Action 1</DropdownMenuItem>
          <DropdownMenuItem>Action 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="rounded-md border">
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
                  )
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
      <div className="flex items-center justify-center space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
