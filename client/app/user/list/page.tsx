"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

/* =======================
   TYPE
======================= */
export type Payment = {
  id: string;
  branch: string;
  department: string;
  misName: string;
  date: string;
  requestDetails: string;
  poNumber: string;
  preparedBy: string;
  requestedBy: string;
  reqDestination: string;
  checkDestination: string;
  departmentHead: string;
  deptDesignation: string;
  purchaser: string;
  purchaserDesignation: string;
  propertyCustodian: string;
  management: string;
  accountingHead: string;
  acctDesignation: string;
  status: "pending" | "processing" | "success" | "failed";
};

/* =======================
   SAMPLE DATA
======================= */
const data: Payment[] = Array.from({ length: 30 }, (_, index) => ({
  id: `${index + 1}`,
  branch: index % 3 === 0 ? "Gensan" : index % 3 === 1 ? "Manila" : "Cebu",
  department: index % 4 === 0 ? "IT" : index % 4 === 1 ? "HR" : index % 4 === 2 ? "Finance" : "Operations",
  misName: `MIS-${String(index + 1).padStart(3, '0')}`,
  date: `2025-01-${String((index % 30) + 1).padStart(2, '0')}`,
  requestDetails: index % 3 === 0 ? "Purchase printer" : index % 3 === 1 ? "Laptop replacement" : "Office supplies",
  poNumber: `PO-${1001 + index}`,
  preparedBy: "Juan Dela Cruz",
  requestedBy: "Maria Santos",
  reqDestination: "Main Office",
  checkDestination: "Warehouse",
  departmentHead: "Pedro Reyes",
  deptDesignation: "IT Head",
  purchaser: "Anna Lim",
  purchaserDesignation: "Purchasing Officer",
  propertyCustodian: "Mark Lee",
  management: "CEO",
  accountingHead: "John Tan",
  acctDesignation: "Accounting Head",
  status: index % 4 === 0 ? "pending" : index % 4 === 1 ? "processing" : index % 4 === 2 ? "success" : "failed",
}));

/* =======================
   COLUMN HELPER (SORTABLE)
======================= */
const textColumn = (
  key: keyof Payment,
  label: string
): ColumnDef<Payment> => ({
  accessorKey: key,
  header: ({ column }) => (
    <Button
      variant="ghost"
      className="px-0"
      onClick={() =>
        column.toggleSorting(column.getIsSorted() === "asc")
      }
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => (
    <div className="font-medium whitespace-nowrap">
      {row.getValue(key)}
    </div>
  ),
});

/* =======================
   COLUMNS
======================= */
export const columns: ColumnDef<Payment>[] = [
  {
    id: "serial",
    header: "Series No.",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },

  textColumn("branch", "Branch"),
  textColumn("department", "Department"),
  textColumn("misName", "MIS Name"),
  textColumn("date", "Date"),
  textColumn("requestDetails", "Request Details"),
  textColumn("poNumber", "PO Number"),
  textColumn("preparedBy", "Prepared By"),
  textColumn("requestedBy", "Requested By"),
  textColumn("reqDestination", "Req. Destination"),
  textColumn("checkDestination", "Check Destination"),
  textColumn("departmentHead", "Department Head"),
  textColumn("deptDesignation", "Dept Designation"),
  textColumn("purchaser", "Purchaser"),
  textColumn("purchaserDesignation", "Purchaser Designation"),
  textColumn("propertyCustodian", "Property Custodian"),
  textColumn("management", "Management"),
  textColumn("accountingHead", "Accounting Head"),
  textColumn("acctDesignation", "Acct Designation"),

  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const colors: Record<string, string> = {
        success: "bg-green-100 text-green-800",
        processing: "bg-blue-100 text-blue-800",
        pending: "bg-yellow-100 text-yellow-800",
        failed: "bg-red-100 text-red-800",
      };

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            colors[status] ?? "bg-gray-100"
          }`}
        >
          {status}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(row.original.id)
            }
          >
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

/* =======================
   COMPONENT
======================= */
export default function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    // Set initial page size
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
     <div className="grid gap-4 h-full">
      <div className="rounded-xl border shadow-lg p-6 pl-10 pr-10 bg-white overflow-hidden">
        <h2 className="text-xl font-semibold mb-4">List</h2>

        <div className="w-full">
          {/* Search and Controls */}
          <div className="flex items-center py-4">
            <Input
              placeholder="Search across all columns..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      column.getCanHide() &&
                      column.id !== "serial" &&
                      column.id !== "actions"
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {/* Format column names for display */}
                        {column.id === "misName" ? "MIS Name" :
                         column.id === "poNumber" ? "PO Number" :
                         column.id === "reqDestination" ? "Req. Destination" :
                         column.id === "checkDestination" ? "Check Destination" :
                         column.id === "deptDesignation" ? "Dept Designation" :
                         column.id === "purchaserDesignation" ? "Purchaser Designation" :
                         column.id === "propertyCustodian" ? "Property Custodian" :
                         column.id === "accountingHead" ? "Accounting Head" :
                         column.id === "acctDesignation" ? "Acct Designation" :
                         column.id === "requestDetails" ? "Request Details" :
                         column.id === "preparedBy" ? "Prepared By" :
                         column.id === "requestedBy" ? "Requested By" :
                         column.id === "departmentHead" ? "Department Head" :
                         column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <div className="overflow-auto rounded-md border">
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
                    <TableRow key={row.id}>
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

          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
              Showing {table.getRowModel().rows.length} of {data.length} entries
            </div>
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
      </div>
    </div>
  );
}