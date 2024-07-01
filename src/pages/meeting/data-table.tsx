import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import AddNewMeeting from '@/components/modal/AddNewMeeting';
import ClipLoader from 'react-spinners/ClipLoader';
import { useAllMeeting } from '@/hooks/useMeeting';
import { FilterIcon, RefreshCw } from 'lucide-react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { DateTimePicker } from '@/components/timePicker/dateTimePicker';
import { formatDateTime } from '@/utils/datetime.util';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: Readonly<DataTableProps<TData, TValue>>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState({});
    const { isLoading } = useAllMeeting();
    const [isOpenCollapse, setIsOpenCollapse] = useState(false);

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

    const [startTime, setStartTime] = useState<Date>();
    const [status, setStatus] = useState<string>();

    useEffect(() => {
        if (startTime) {
            table
                .getColumn('startTime')
                ?.setFilterValue(
                    formatDateTime(startTime.toString()).formattedDate
                );
            table.getColumn('startTime')?.getFilterValue();
        }
    }, [table, startTime]);

    const resetTable = () => {
        table.setColumnFilters([]);
        setStartTime(undefined);
        setStatus('');
    };

    const handleStatusChange = (status: string) => {
        setStatus(status);
        table.getColumn('status')?.setFilterValue(status);
        table.getColumn('status')?.getFilterValue();
    };

    return (
        <div className='min-w-[1200px]'>
            <div className="flex items-center justify-between gap-2 py-2">
                <div className="flex gap-2">
                    <Input
                        placeholder="Title of meeting..."
                        value={
                            (table
                                .getColumn('title')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table
                                .getColumn('title')
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <Button
                        variant={isOpenCollapse ? 'default' : 'outline'}
                        onClick={() => setIsOpenCollapse(!isOpenCollapse)}
                    >
                        <FilterIcon className="h-4 w-4 md:mr-2" />{' '}
                        <span className="hidden md:block">Advanced</span>
                    </Button>
                    <Button variant={'outline'} onClick={() => resetTable()}>
                        <RefreshCw className="h-4 w-4 md:mr-2" />{' '}
                        <span className="hidden md:block">Reset</span>
                    </Button>
                </div>
                <AddNewMeeting />
            </div>
            <Collapsible open={isOpenCollapse} className="mb-4">
                <CollapsibleContent className="flex flex-wrap gap-2 items-center">
                    <Input
                        placeholder="Tag"
                        value={
                            (table
                                .getColumn('tag')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table
                                .getColumn('tag')
                                ?.setFilterValue(event.target.value)
                        }
                        className="w-[100px] md:max-w-48"
                    />
                    <DateTimePicker
                        setDate={setStartTime}
                        date={startTime}
                        isTime={false}
                        placeholder="Date start"
                    />
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-[100px] md:w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                value="1"
                                className="text-green-500 hover:text-green-500"
                            >
                                Upcoming
                            </SelectItem>
                            <SelectItem
                                value="-1"
                                className="text-destructive hover:text-destructive"
                            >
                                Close
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Location"
                        value={
                            (table
                                .getColumn('location')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={(event) =>
                            table
                                .getColumn('location')
                                ?.setFilterValue(event.target.value)
                        }
                        className="w-[200px]"
                    />
                </CollapsibleContent>
            </Collapsible>
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
                                                      header.column.columnDef
                                                          .header,
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
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
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
                                    className="h-24 text-center space-y-2"
                                >
                                    <ClipLoader color="#000000" />
                                    <p>Loading data...</p>
                                </TableCell>
                            </TableRow>
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
            <div className="md:flex items-center justify-center space-x-2 py-4 gap-2">
                <div className='flex justify-center gap-1 mb-2 md:mb-0'>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </Button>
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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </Button>
                </div>
                <div className='flex items-center gap-1'>
                    <span className="text-sm">
                        Page{' '}
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}
                        </strong>
                        {' '}
                    </span>
                    <span className="text-sm">
                        | Go to:{' '}
                        <input
                            type="number"
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value
                                    ? Number(e.target.value) - 1
                                    : 0;
                                table.setPageIndex(page);
                            }}
                            className="w-16 p-1 border rounded"
                        />
                    </span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        className="lg:w-32 p-1 border rounded"
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
