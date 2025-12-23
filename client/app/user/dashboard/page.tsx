"use client";

import * as React from "react";
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
const branches = ["Main Branch", "East Branch", "West Branch", "North Branch"];
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

  return (
    <div className="grid gap-4 h-full">
      <div className="rounded-xl border shadow-lg p-6 pl-10 pr-10 details-section">
        <h2 className="text-xl font-semibold mb-4">Recommendation Form</h2>

        <form className="grid gap-6 " >
          {/* DETAILS */}
          {/* DETAILS + SERIES NO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-50 " >
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-1">
         


              <div className="flex items-center gap-3">
                <Label className="w-28">Series No.</Label>
                <Input placeholder="SR-0001" className="w-40" readOnly />{" "}
                {/* width 10rem */}
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <Label className="w-28">Status</Label>
                <Input placeholder="Pending" className="flex-1" />
              </div>

              {/* Branch */}
              <div className="flex items-center gap-3">
                <Label className="w-28">Branch</Label>
                <SelectField options={branches} />
              </div>

              {/* Department */}
              <div className="flex items-center gap-3">
                <Label className="w-28">Department</Label>
                <SelectField options={departments} />
              </div>

              {/* MIS Name */}
              <div className="flex items-center gap-3">
                <Label className="w-28">MIS Name</Label>
                <SelectField options={misNames} />
              </div>

              {/* Date */}
              <div className="flex items-center gap-3">
                <Label className="w-28">Date</Label>
                <Input type="date" className="w-40" />
              </div>



            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-4">
              {/* Request Details */}
              <div className="flex gap-3 h-full">
                <Label className="w-28 self-start mt-2">Request Details</Label>
                <Textarea
                  placeholder="Enter details..."
                  defaultValue="We would like to request"
                  className="flex-1 h-full resize-none"
                />
              </div>

              {/* PO Number */}
              <div className="flex items-center gap-3 mt-4">
                <Label className="w-28">PO Number</Label>
                <Input placeholder="PO-0001" className="flex-1" />
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
                    <th className="px-2 py-1 text-left">Item Discription</th>
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
                          min={0} // optional, prevents negative numbers
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
          {/* SIGNATORIES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-50">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <Label className="w-28">Prepared By</Label>
                <SelectField options={people} />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Requested By</Label>
                <SelectField options={people} />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Req Destination</Label>
                <SelectField options={people} />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Checked By</Label>
                <SelectField options={people} />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Check Designation</Label>
                <SelectField options={departments} />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Department Head</Label>
                <SelectField options={departments} />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Dept Designation</Label>
                <SelectField options={departments} />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <Label className="w-28">Purchaser</Label>
                <SelectField options={people} />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Pur Designation</Label>
                <SelectField options={departments} />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Property Custodian</Label>
                <SelectField options={people} />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Management</Label>
                <SelectField options={people} />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Management</Label>
                <SelectField options={people} />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Accounting Head</Label>
                <SelectField options={people} />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28">Acct. Designation</Label>
                <SelectField options={departments} />
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <div className="flex justify-start gap-2 ">
            <Button type="submit">Save</Button>
            <Button type="submit" variant="outline">
              Update
            </Button>
            <Button type="submit" variant="secondary">
              Print
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Reusable Select */
/* Reusable Select */

function SelectField({ options }: { options: string[] }) {
  return (
    <div className="flex-1">
      <Select>
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
