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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FilterPopup from "@/components/FilterPopup";
import { Loader2 } from "lucide-react"; // Import a loading icon

// Define Branch type
type Branch = {
  branch_id: number;
  branch_name: string;
};

// Define department type
type Department = {
  dept_id: number;
  dept_name: string;
};

type misName = {
  mis_id: number;
  mis_name: string;
};

type ItemRow = {
  qty: number;
  unit: string;
  itemDescription: string;
  remarks: string;
};

const people = ["Juan Dela Cruz", "Maria Santos", "Pedro Reyes", "Ana Lopez"];

export default function DashboardPage() {
  const [items, setItems] = React.useState<ItemRow[]>([
    { qty: 0, unit: "", itemDescription: "", remarks: "" },
  ]);

  // State for branch from API
  const [branch, setBranch] = useState<Branch[]>([]);
  const [department, setDepartment] = useState<Department[]>([]);
  const [misName, setMisName] = useState<misName[]>([]);
  
  // Combined loading state
  const [isLoading, setIsLoading] = useState(true);
  
  const [branchError, setBranchError] = useState<string | null>(null);
  const [departmentError, setDepartmentError] = useState<string | null>(null);
  const [misNameError, setMisNameError] = useState<string | null>(null);

  // State for form submission
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

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

  // Fetch all data with Promise.all for parallel loading
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      
      // Use Promise.all to fetch all data in parallel
      const [branchRes, deptRes, misRes] = await Promise.all([
        fetch("/api/branch"),
        fetch("/api/department"),
        fetch("/api/misName")
      ]);

      // Check all responses
      if (!branchRes.ok) throw new Error("Failed to fetch branch");
      if (!deptRes.ok) throw new Error("Failed to fetch department");
      if (!misRes.ok) throw new Error("Failed to fetch mis name");

      const [branchData, deptData, misData] = await Promise.all([
        branchRes.json(),
        deptRes.json(),
        misRes.json()
      ]);

      // Set data if successful
      if (branchData.success) setBranch(branchData.data);
      else setBranchError(branchData.message || "Failed to fetch branch");

      if (deptData.success) setDepartment(deptData.data);
      else setDepartmentError(deptData.message || "Failed to fetch department");

      if (misData.success) setMisName(misData.data);
      else setMisNameError(misData.message || "Failed to fetch mis name");

    } catch (err) {
      console.error("Error fetching data:", err);
      // Set individual errors based on what failed
      setBranchError("Failed to load branch");
      setDepartmentError("Failed to load department");
      setMisNameError("Failed to load mis name");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
    
    // Set up network listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold">Loading Dashboard...</h2>
          <p className="text-muted-foreground mt-2">
            Please wait while we load your data
          </p>
        </div>
      </div>
    );
  }

  // If all APIs failed to load
  if (branchError && departmentError && misNameError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Failed to Load Data</AlertTitle>
          <AlertDescription>
            Unable to load required data. Please check your connection and try again.
            <Button 
              onClick={fetchAllData} 
              variant="outline" 
              size="sm" 
              className="mt-4"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
    setSubmitStatus({ type: null, message: "" });

    const formData = new FormData(e.currentTarget);
    const action = formData.get("action")?.toString() || "save";
    const details = formData.get("request_details")?.toString().trim() || "";
    const branchId = formData.get("branch")?.toString() || "";
    const departmentId = formData.get("department")?.toString() || "";
    const misId = formData.get("mis_name")?.toString() || "";

    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          details,
          action,
          branchId,
          departmentId,
          misId,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save request");
      }

      const result = await res.json();

      setSubmitStatus({
        type: "success",
        message: result.message || "Request saved successfully!",
      });

      console.log("Saved successfully");

      // Auto-dismiss success message after 5 seconds
      if (action !== "print") {
        setTimeout(() => {
          setSubmitStatus({ type: null, message: "" });
        }, 5000);
      }

      if (action === "print") {
        window.print();
      }
    } catch (err) {
      console.error("API error:", err);
      setSubmitStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to save request",
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
            variant={
              submitStatus.type === "success" ? "default" : "destructive"
            }
            className="mb-4"
          >
            <AlertTitle>
              {submitStatus.type === "success" ? "Success" : "Error"}
            </AlertTitle>
            <AlertDescription>{submitStatus.message}</AlertDescription>
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
                {branchError ? (
                  <Alert variant="destructive" className="w-40 p-2">
                    <AlertDescription className="text-xs">
                      Failed to load branch
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Select name="branch" required>
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
                {departmentError ? (
                  <Alert variant="destructive" className="w-40 p-2">
                    <AlertDescription className="text-xs">
                      Failed to load department
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Select name="department">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {department.map((dept) => (
                        <SelectItem
                          key={dept.dept_id}
                          value={dept.dept_id.toString()}
                        >
                          {dept.dept_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* MIS Name */}
              <div className="flex items-center gap-3">
                <Label className="w-28">MIS Name</Label>
                {misNameError ? (
                  <Alert variant="destructive" className="w-40 p-2">
                    <AlertDescription className="text-xs">
                      Failed to load mis name
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Select name="mis_name">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select MIS Name" />
                    </SelectTrigger>
                    <SelectContent>
                      {misName.map((misName) => (
                        <SelectItem
                          key={misName.mis_id}
                          value={misName.mis_id.toString()}
                        >
                          {misName.mis_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Date */}
              <div className="flex items-center gap-3">
                <Label className="w-28">Date</Label>
                <Input
                  type="date"
                  className="w-40"
                  name="date"
                  value={new Date().toISOString().split("T")[0]} // autofill today
                  readOnly
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

              {/* Purchasing Remarks */}
              <div className="flex items-center gap-3 mt-4">
                <Label className="w-28">Purchasing Remarks</Label>
                <Input
                  placeholder="NNew remarks"
                  className="flex-1"
                  name="Pur_remarks"
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
                <SelectField options={data} name="check_designation" />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Department Head</Label>
                <SelectField options={data} name="department_head" />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Dept Designation</Label>
                <SelectField options={data} name="dept_designation" />
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
                <SelectField options={people} name="pur_designation" />
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
                <SelectField options={people} name="acct_designation" />
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
function SelectField({ options, name }: { options: string[]; name?: string }) {
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