"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import FilterPopup from "@/components/FilterPopup";

// Define Branch type
type Branch = {
  branch_id: number;
  branch_name: string;
};

type ItemRow = {
  qty: string;
  unit: string;
  itemDescription: string;
  remarks: string;
};

const people = ["Juan Dela Cruz", "Maria Santos", "Pedro Reyes", "Ana Lopez"];
const departments = [
  "IT Department",
  "HR Department",
  "Finance Department",
  "Marketing Department",
];
const misNames = ["MIS-001", "MIS-002", "MIS-003", "MIS-004"];

export default function DashboardPage() {
  type ItemRow = {
    qty: number;
    unit: string;
    itemDescription: string;
    remarks: string;
  };

  const [items, setItems] = React.useState<ItemRow[]>([
    { qty: 0, unit: "", itemDescription: "", remarks: "" },
  ]);

  // State for branch from API
  const [branch, setbranch] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for form submission
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // State for network status
  const [isOnline, setIsOnline] = useState(true);

  // State for filtered values
  const [filteredValues, setFilteredValues] = useState<string[]>([]);

  const data = [
    "APEX PAPER SOLUTIONS, INC.",
    "AVIOR HOTEL",
    "BUILDMORE ACHARON",
    "BUILDMORE APOPNOG",
    "BUILDMORE STORE 1",
    "BUILDMORE STORE 2",
    "DADIANGAS CORNERSTONE CENTER",
  ];

  // Fetch branch on component mount
  useEffect(() => {
    fetchbranch();
    
    // Set up network listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchbranch = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/branch');
      
      if (!response.ok) {
        throw new Error('Failed to fetch branch');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setbranch(data.data);
      } else {
        setError(data.message || 'Failed to fetch branch');
      }
    } catch (err) {
      console.error('Error fetching branch:', err);
      setError('Failed to load branch');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    index: number,
    field: keyof ItemRow,
    value: string | number
  ) => {
    let updated = [...items];

    if (field === "qty") {
      updated[index][field] = Number(value); // convert to number
    } else {
      updated[index][field] = String(value);
    }

    // Remove rows that are completely empty except the first row
    updated = updated.filter((row, i) => {
      const isEmpty =
        row.qty === 0 &&
        row.unit === "" &&
        row.itemDescription === "" &&
        row.remarks === "";
      return !isEmpty || i === 0;
    });

    // Add a new empty row if the last row has any value
    const lastRow = updated[updated.length - 1];
    if (
      lastRow.qty !== 0 ||
      lastRow.unit !== "" ||
      lastRow.itemDescription !== "" ||
      lastRow.remarks !== ""
    ) {
      updated.push({ qty: 0, unit: "", itemDescription: "", remarks: "" });
    }

    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: '' });

    const formData = new FormData(e.currentTarget);
    const action = formData.get("action")?.toString() || "save";
    const details = formData.get("request_details")?.toString().trim() || "";
    const branchId = formData.get("branch")?.toString() || "";
    

    // Validation
    if (!details) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter request details!'
      });
      return;
    }

    if (!branchId) {
      setSubmitStatus({
        type: 'error',
        message: 'Please select a branch!'
      });
      return;
    }



    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          details,
          action,
          branchId
         
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save request");
      }

      const result = await res.json();
      
      setSubmitStatus({
        type: 'success',
        message: result.message || 'Request saved successfully!'
      });

      console.log("Saved successfully");

      // Auto-dismiss success message after 5 seconds
      if (action !== "print") {
        setTimeout(() => {
          setSubmitStatus({ type: null, message: '' });
        }, 5000);
      }

      if (action === "print") {
        window.print();
      }

      

    } catch (err) {
      console.error("API error:", err);
      setSubmitStatus({
        type: 'error',
        message: err instanceof Error ? err.message : "Failed to save request"
      });
    }
  };

  return (
    <div className="grid gap-4 h-full">
      <div className="rounded-xl border shadow-lg p-6 pl-10 pr-10 details-section">
        <h2 className="text-xl font-semibold mb-4">Recommendation Form</h2>

        {/* Network Status Alert */}
        {!isOnline && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Network Connection Lost</AlertTitle>
            <AlertDescription>
              You are currently offline. Please check your internet connection.
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Status Alert */}
        {submitStatus.type && (
          <Alert 
            variant={submitStatus.type === 'success' ? 'default' : 'destructive'} 
            className="mb-4"
          >
            <AlertTitle>
              {submitStatus.type === 'success' ? 'Success' : 'Error'}
            </AlertTitle>
            <AlertDescription>
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

      

      

        

        <form onSubmit={handleSubmit} className="grid gap-6 ">
          {/* DETAILS */}
          {/* DETAILS + SERIES NO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-50 ">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <Label className="w-28">Series No.</Label>
                <Input 
                  placeholder="0001" 
                  className="w-40" 
                  name="series_no"
                  readOnly 
                />
              </div>

              {/* Branch */}
              <div className="flex items-center gap-3">
                <Label className="w-28">Branch</Label>
                {loading ? (
                  <Input 
                    placeholder="Loading branch..." 
                    className="w-40" 
                    readOnly 
                  />
                ) : error ? (
                  <Alert variant="destructive" className="w-40 p-2">
                    <AlertDescription className="text-xs">
                      Failed to load branch
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Select name="branch">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branch.map((branch) => (
                        <SelectItem 
                          key={branch.branch_id} 
                          value={branch.branch_id.toString()}
                        >
                          {branch.branch_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Department */}
              <div className="flex items-center gap-3">
                <Label className="w-28">Department</Label>
                <SelectField options={departments} name="department" />
              </div>

              {/* MIS Name */}
              <div className="flex items-center gap-3">
                <Label className="w-28">MIS Name</Label>
                <SelectField options={misNames} name="mis_name" />
              </div>

              {/* Date */}
              <div className="flex items-center gap-3">
                <Label className="w-28">Date</Label>
                <Input 
                  type="date" 
                  className="w-40" 
                  name="date"
                  required 
                />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-4">
              {/* Request Details */}
              <div className="flex gap-3 h-full">
                <Label className="w-28 self-start mt-2">Request Details</Label>
                <Textarea
                  name="request_details"
                  placeholder="Enter details..."
                  defaultValue="We would like to request"
                  className="flex-1 h-full resize-none"
                  required
                />
              </div>

              {/* PO Number */}
              <div className="flex items-center gap-3 mt-4">
                <Label className="w-28">PO Number</Label>
                <Input 
                  placeholder="PO-0001" 
                  className="flex-1" 
                  name="po_number" 
                />
              </div>
            </div>
          </div>

          {/* REQUESTED ITEMS TABLE */}
          <div className="grid gap-2">
            <Label>Requested Items</Label>

            <div className="overflow-x-auto rounded-xl border border-black">
              <table className="w-full border-collapse ">
                <thead className="border-b border-black">
                  <tr>
                    <th className="px-2 py-1 text-left w-24 rounded-tl-xl">
                      Qty
                    </th>
                    <th className="px-2 py-1 text-left w-28">Unit</th>
                    <th className="px-2 py-1 text-left">Item Description</th>
                    <th className="px-2 py-1 text-left rounded-tr-xl">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row, index) => (
                    <tr key={index}>
                      <td
                        className={`top p-1 ${
                          index === items.length - 1 ? "rounded-bl-xl" : ""
                        }`}
                      >
                        <Input
                          type="number"
                          min={0}
                          value={row.qty}
                          onChange={(e) =>
                            handleChange(index, "qty", e.target.value)
                          }
                        />
                      </td>
                      <td
                        className={`p-1 ${
                          index === items.length - 1 ? "" : ""
                        }`}
                      >
                        <Input
                          value={row.unit}
                          onChange={(e) =>
                            handleChange(index, "unit", e.target.value)
                          }
                        />
                      </td>
                      <td
                        className={`p-1 ${
                          index === items.length - 1 ? "" : ""
                        }`}
                      >
                        <Input
                          value={row.itemDescription}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "itemDescription",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td
                        className={`p-1 ${
                          index === items.length - 1 ? "rounded-br-xl" : ""
                        }`}
                      >
                        <Input
                          value={row.remarks}
                          onChange={(e) =>
                            handleChange(index, "remarks", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SIGNATORIES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-50">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <Label className="w-28">Prepared By</Label>
                <SelectField options={people} name="prepared_by" />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Requested By</Label>
                <SelectField options={people} name="requested_by" />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Req Destination</Label>
                <SelectField options={people} name="req_destination" />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Checked By</Label>
                <SelectField options={people} name="checked_by" />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Check Designation</Label>
                <SelectField options={departments} name="check_designation" />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Department Head</Label>
                <SelectField options={departments} name="department_head" />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Dept Designation</Label>
                <SelectField options={departments} name="dept_designation" />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <Label className="w-28">Purchaser</Label>
                <SelectField options={people} name="purchaser" />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Pur Designation</Label>
                <SelectField options={departments} name="pur_designation" />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Property Custodian</Label>
                <SelectField options={people} name="property_custodian" />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Management</Label>
                <SelectField options={people} name="management1" />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Management</Label>
                <SelectField options={people} name="management2" />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Accounting Head</Label>
                <SelectField options={people} name="accounting_head" />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Acct. Designation</Label>
                <SelectField options={departments} name="acct_designation" />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTONS */}
          <div className="flex justify-start gap-2 ">
            <Button type="submit" name="action" value="save">
              Save
            </Button>
            <Button
              type="submit"
              name="action"
              value="update"
              variant="outline"
            >
              Update
            </Button>

            <Button
              type="submit"
              name="action"
              value="print"
              variant="secondary"
            >
              Print
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Reusable Select Component */
function SelectField({ options, name }: { options: string[], name?: string }) {
  return (
    <div className="flex-1">
      <Select name={name}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}