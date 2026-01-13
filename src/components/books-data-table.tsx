"use client";

import * as React from "react";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";
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
} from "@tanstack/react-table";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FetchedBook } from "@/types/fetchedBook";
import AddBookModal from "@/components/pages/admin/manage-books/AddBookModal";
import EditBookModal from "@/components/pages/admin/manage-books/EditBookModal";

interface BooksDataTableProps {
  data: FetchedBook[];
  onBookAdded?: () => void;
}

export function BooksDataTable({ data, onBookAdded }: BooksDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedBook, setSelectedBook] = React.useState<FetchedBook | null>(
    null
  );

  const handleEdit = (book: FetchedBook) => {
    setSelectedBook(book);
    setEditModalOpen(true);
  };

  const handleDelete = (book: FetchedBook) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/books/delete-book/${book._id}`);
          Swal.fire({
            title: "Deleted!",
            text: "Book has been deleted.",
            icon: "success",
          });
          if (onBookAdded) {
            onBookAdded();
          }
        } catch {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="#">Why do I have this issue?</a>',
          });
        }
      }
    });
  };

  const columns: ColumnDef<FetchedBook>[] = [
    {
      accessorKey: "title",
      header: "Title",
      size: 300,
      cell: ({ row }) => (
        <div className="font-medium truncate pl-4">{row.original.title}</div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "author",
      header: "Author",
      size: 200,
      cell: ({ row }) => <div className="truncate">{row.original.author}</div>,
    },
    {
      accessorKey: "genre",
      header: "Genre",
      size: 150,
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="text-muted-foreground px-1.5 truncate"
        >
          {row.original.genre}
        </Badge>
      ),
    },
    {
      accessorKey: "coverImage",
      header: "Cover Thumbnail",
      size: 120,
      cell: ({ row }) => (
        <div className="w-12 h-16 rounded overflow-hidden relative">
          <Image
            src={row.original.coverImage}
            alt={row.original.title}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      id: "actions",
      header: () => null,
      size: 80,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <IconEdit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => handleDelete(row.original)}
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

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
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-semibold">Manage Books</h1>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter books..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <AddBookModal onBookAdded={onBookAdded || (() => {})} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-5">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={header.id === "title" ? "pl-4" : ""}
                    >
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
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No books found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} book(s) total
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="h-8 w-16 rounded-md border border-input bg-background px-2 text-sm"
            >
              {[5, 10, 20, 30, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              First
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
              Last
            </Button>
          </div>
        </div>
      </div>
      {selectedBook && (
        <EditBookModal
          book={selectedBook}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onBookUpdated={() => {
            if (onBookAdded) {
              onBookAdded();
            }
          }}
        />
      )}
    </div>
  );
}
