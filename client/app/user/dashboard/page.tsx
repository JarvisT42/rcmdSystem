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
  item: string;
  description: string;
};

const people = ["Juan Dela Cruz", "Maria Santos", "Pedro Reyes", "Ana Lopez"];

export default function DashboardPage() {
  const [items, setItems] = React.useState<ItemRow[]>([
    { qty: "", unit: "", item: "", description: "" },
  ]);

  const handleChange = (index: number, field: keyof ItemRow, value: string) => {
    const updated = [...items];
    updated[index][field] = value;

    // auto-add new row if typing in last row
    if (
      index === items.length - 1 &&
      Object.values(updated[index]).some((v) => v !== "")
    ) {
      updated.push({ qty: "", unit: "", item: "", description: "" });
    }

    setItems(updated);
  };

  return (
    <div className="grid gap-4 h-full">
      <div className="rounded-xl border shadow-lg p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Recommendation Form</h2>

        <form className="grid gap-6">
          {/* DETAILS */}
          {/* DETAILS + SERIES NO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="mt-1">Series No.</Label>
              <Input placeholder="SR-0001" />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="mt-1">Details</Label>
              <Textarea
                placeholder="Enter details..."
                rows={3}
                defaultValue="We would like to request"
              />
            </div>
          </div>

          {/* DATE & PO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input type="date" />
            </div>
            <div className="grid gap-2">
              <Label>PO Number</Label>
              <Input placeholder="PO-0001" />
            </div>
          </div>

          {/* REQUESTED ITEMS TABLE */}
          <div className="grid gap-2">
            <Label>Requested Items</Label>

            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full border-collapse">
                <thead className="border-b">
                  <tr>
                    <th className="px-2 py-1 text-left w-24 rounded-tl-xl">
                      Qty
                    </th>
                    <th className="px-2 py-1 text-left w-28">Unit</th>
                    <th className="px-2 py-1 text-left">Item</th>
                    <th className="px-2 py-1 text-left rounded-tr-xl">
                      Description
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
                          value={row.item}
                          onChange={(e) =>
                            handleChange(index, "item", e.target.value)
                          }
                        />
                      </td>
                      <td
                        className={`p-1 ${
                          index === items.length - 1 ? "rounded-br-xl" : ""
                        }`}
                      >
                        <Input
                          value={row.description}
                          onChange={(e) =>
                            handleChange(index, "description", e.target.value)
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField label="Requested By" />
            <SelectField label="Checked By" />

            <SelectField label="Received By" />
            <SelectField label="Management" />

            <SelectField label="Approved By" />
            <SelectField label="Head" />
          </div>

          {/* SUBMIT */}
          <div className="flex justify-start gap-2 ">
            <Button type="submit">Save</Button>
            <Button type="submit">Update</Button>
            <Button type="submit">Print</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Reusable Select */
function SelectField({ label }: { label: string }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {people.map((person) => (
            <SelectItem key={person} value={person}>
              {person}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
