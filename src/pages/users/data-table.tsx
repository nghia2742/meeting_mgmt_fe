import * as React from "react";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  HeaderGroup,
  Header,
  Row,
  Cell,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserProfile } from "@/types/userProfile.type";
import { getUser, softDeleteUser, updateUserProfile } from "@/lib/apiUser";
import { DeleteUserModal } from "./components/DeleteUserModal";
import EditUserModal from "./components/EditUserModal";
import { getColumns } from "./column";
import { toast } from "@/components/ui/use-toast";
import ClipLoader from "react-spinners/ClipLoader";

interface DataTableDemoProps {
  users: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
}

export function DataTableDemo({ users, setUsers }: DataTableDemoProps) {
  const [loading, setLoading] = React.useState<boolean>(false); // 1. Add loading state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<UserProfile[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserProfile | null>(
    null
  );

  React.useEffect(() => {
    setLoading(users.length === 0); // 2. Update loading state based on users
  }, [users]);

  const handleDeleteClick = (user: UserProfile) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      try {
        await softDeleteUser(selectedUser.id);
        toast({
          variant: "success",
          description: "User deleted successfully",
          duration: 1000,
        });
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== selectedUser.id)
        );
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Failure deleting user",
          duration: 1000,
        });
        console.error("Error deleting user:", error);
      } finally {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
      }
    }
  };

  const handleEditClick = (user: UserProfile) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (updatedUser: UserProfile) => {
    try {
      await updateUserProfile(updatedUser.email, updatedUser);
      const updatedUserData = await getUser();
      toast({
        variant: "success",
        title: "Success",
        description: "User edited successfully.",
        duration: 1000,
      });
      setUsers(updatedUserData);
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to edit user.",
        duration: 1000,
      });
    }
  };

  const columns = React.useMemo(
    () => getColumns(handleEditClick, handleDeleteClick),
    [handleEditClick, handleDeleteClick]
  );

  const table = useReactTable({
    data: users,
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
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<UserProfile>) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header: Header<UserProfile, unknown>) => {
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
                    }
                  )}
                </TableRow>
              ))}
          </TableHeader>
          <TableBody>
            {loading ? ( // 3. Conditionally render loading state
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <ClipLoader>
                    
                  </ClipLoader>
                  <p>Loading data...</p>
              
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: Row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell: Cell) => (
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
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
          {">>"}
        </Button>
        <span className="text-sm">
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>{" "}
        </span>
        <span className="text-sm">
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
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
          className="w-32 p-1 border rounded"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        children={`Delete the ${selectedUser?.fullName}`}
      />
      {selectedUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditSave}
          user={selectedUser}
        />
      )}
    </div>
  );
}
