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
  type Column,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Search, Move } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import { Checkbox } from "@/components/ui/checkbox";

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
  itemDescription: string;
  remarks: string;
  preparedBy: string;
  requestedBy: string;
  status: "pending" | "processing" | "success" | "failed";
};

/* =======================
   SAMPLE DATA
======================= */
const data: Payment[] = Array.from({ length: 30 }, (_, index) => ({
  id: `${index + 1}`,
  branch: index % 3 === 0 ? "Gensan" : index % 3 === 1 ? "Manila" : "Cebu",
  department:
    index % 4 === 0
      ? "IT"
      : index % 4 === 1
      ? "HR"
      : index % 4 === 2
      ? "Finance"
      : "Operations",
  misName: `MIS-${String(index + 1).padStart(3, "0")}`,
  date: `2025-01-${String((index % 30) + 1).padStart(2, "0")}`,
  requestDetails:
    index % 3 === 0
      ? "Purchase printer"
      : index % 3 === 1
      ? "Laptop replacement"
      : "Office supplies",
  itemDescription: "Printer, Laptop, Office Supplies",
  remarks: "Urgent delivery needed",
  preparedBy: "Juan Dela Cruz",
  requestedBy: "Maria Santos",
  status:
    index % 4 === 0
      ? "pending"
      : index % 4 === 1
      ? "processing"
      : index % 4 === 2
      ? "success"
      : "failed",
}));

/* =======================
   HELPER: Get unique values from a column
======================= */
const getUniqueValues = (key: keyof Payment): Array<{id: string, label: string}> => {
  const values = data.map(item => item[key]);
  const uniqueValues = Array.from(new Set(values));
  return uniqueValues.map((value, index) => ({
    id: `${key}-${index}`,
    label: String(value)
  }));
};

/* =======================
   COLUMN FILTER COMPONENT
======================= */
interface ColumnFilterProps {
  columnKey: keyof Payment;
  columnLabel: string;
  selectedFilters: string[];
  onApply: (selected: string[]) => void;
  onClose: () => void;
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({
  columnKey,
  columnLabel,
  selectedFilters,
  onApply,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Set<string>>(new Set(selectedFilters));
  const [selectAll, setSelectAll] = React.useState(false);
  const [size, setSize] = React.useState({ width: 400, height: 480 });
  const isResizing = React.useRef(false);
  const startPos = React.useRef({ x: 0, y: 0 });
  const startSize = React.useRef(size);

  // Get unique values for this column
  const allItems = getUniqueValues(columnKey);
  
  // Filter items based on search
  const filteredItems = allItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate selectAll based on filtered items
  React.useEffect(() => {
    const filteredSelected = filteredItems.filter(item => selected.has(item.label));
    setSelectAll(filteredSelected.length === filteredItems.length && filteredItems.length > 0);
  }, [filteredItems, selected]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = size;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;

    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;

    setSize({
      width: Math.min(Math.max(startSize.current.width + dx, 280), 600),
      height: Math.min(Math.max(startSize.current.height + dy, 300), 700),
    });
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelected = new Set(selected);
    if (checked) {
      filteredItems.forEach(item => newSelected.add(item.label));
    } else {
      filteredItems.forEach(item => newSelected.delete(item.label));
    }
    setSelected(newSelected);
  };

  const handleItemToggle = (itemLabel: string, checked: boolean) => {
    const newSelected = new Set(selected);
    checked ? newSelected.add(itemLabel) : newSelected.delete(itemLabel);
    setSelected(newSelected);
  };

  const handleClearFilter = () => {
    setSelected(new Set());
    setSelectAll(false);
    setSearchQuery("");
  };

  const handleApply = () => {
    onApply(Array.from(selected));
    onClose();
  };

  return (
    <div
      className="relative rounded-lg border border-border bg-card shadow-lg flex flex-col"
      style={{ width: size.width, height: size.height }}
    >
      {/* Header */}
      <div className="border-b border-border px-4 py-3 font-medium shrink-0">
        Filter {columnLabel}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        {/* Search */}
        <div className="mb-3 flex gap-2">
          <Input
            placeholder="Enter text to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button size="icon" variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-2">
          <div className="flex items-center space-x-2 py-1">
            <Checkbox
              id="select-all"
              checked={selectAll}
              onCheckedChange={handleSelectAll}
            />
            <label className="text-sm font-medium">(All)</label>
          </div>

          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selected.has(item.label)}
                  onCheckedChange={(checked) =>
                    handleItemToggle(item.label, checked === true)
                  }
                />
                <span className="text-xs break-words">{item.label}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No results found
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-muted/50 px-4 py-3 flex justify-between shrink-0 mb-7">
        <Button variant="ghost" size="sm" onClick={handleClearFilter}>
          Clear Filter
        </Button>
        <Button size="sm" onClick={handleApply}>
          Apply
        </Button>
      </div>

      {/* 🔹 Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute bottom-2 right-2 cursor-se-resize"
        title="Drag to resize"
      >
        <Move className="h-5 w-5 text-gray-400 hover:text-gray-600" />
      </div>
    </div>
  );
};

/* =======================
   CREATE A CUSTOM HEADER COMPONENT FOR EACH COLUMN
======================= */
const createHeaderComponent = (key: keyof Payment, label: string) => {
  return function HeaderComponent({ column }: { column: Column<Payment, unknown> }) {
    const [filterOpen, setFilterOpen] = React.useState(false);
    const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);
    
    const handleFilterApply = (selected: string[]) => {
      setSelectedFilters(selected);
      if (selected.length > 0) {
        column.setFilterValue(selected);
      } else {
        column.setFilterValue(undefined);
      }
      setFilterOpen(false);
    };
    
    return (
      <div className="flex items-center space-x-1">
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="px-0 hover:bg-transparent font-medium cursor-pointer flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                setFilterOpen(true);
              }}
            >
              {label}
              {selectedFilters.length > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {selectedFilters.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-0" align="start">
            <ColumnFilter
              columnKey={key}
              columnLabel={label}
              selectedFilters={selectedFilters}
              onApply={handleFilterApply}
              onClose={() => setFilterOpen(false)}
            />
          </PopoverContent>
        </Popover>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation();
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          <ArrowUpDown className="h-3 w-3 cursor-pointer" />
        </Button>
      </div>
    );
  };
};

/* =======================
   CUSTOM FILTER FUNCTION
======================= */
const multiValueFilterFn: any = (row: any, columnId: string, filterValue: any) => {
  // If no filter value, show all rows
  if (!filterValue || filterValue.length === 0) {
    return true;
  }
  
  // Get the cell value
  const cellValue = row.getValue(columnId) as string;
  
  // If filterValue is an array, check if cellValue is in the array
  if (Array.isArray(filterValue)) {
    return filterValue.includes(cellValue);
  }
  
  // If filterValue is a string, do simple comparison
  if (typeof filterValue === 'string') {
    return cellValue.toLowerCase().includes(filterValue.toLowerCase());
  }
  
  return true;
};

/* =======================
   COLUMN HELPER - UPDATED WITH FILTER FUNCTION
======================= */
const textColumn = (key: keyof Payment, label: string): ColumnDef<Payment> => ({
  accessorKey: key,
  header: createHeaderComponent(key, label),
  cell: ({ row }) => (
    <div className="font-medium whitespace-nowrap">{row.getValue(key)}</div>
  ),
  filterFn: multiValueFilterFn,
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
    filterFn: multiValueFilterFn,
  },

  textColumn("branch", "Branch"),
  textColumn("department", "Department"),
  textColumn("misName", "MIS Name"),
  textColumn("date", "Date"),
  textColumn("requestDetails", "Request Details"),
  textColumn("itemDescription", "Item Description"),
  textColumn("remarks", "Remarks"),
  textColumn("preparedBy", "Prepared By"),
  textColumn("requestedBy", "Requested By"),
  textColumn("status", "Status"),
];

/* =======================
   COMPONENT
======================= */
export default function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
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
        pageSize: 15,
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
                      column.id !== "serial"
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
                        {column.id === "misName"
                          ? "MIS Name"
                          : column.id === "itemDescription"
                          ? "Item Description"
                          : column.id === "requestDetails"
                          ? "Request Details"
                          : column.id === "preparedBy"
                          ? "Prepared By"
                          : column.id === "requestedBy"
                          ? "Requested By"
                          : column.id}
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