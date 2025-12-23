// components/FilterPopup.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";

type FilterPopupProps = {
  values: string[];
  onApply: (selected: string[]) => void;
};

export default function FilterPopup({ values, onApply }: FilterPopupProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredValues = values.filter((v) =>
    v.toLowerCase().includes(search.toLowerCase())
  );

  const toggleValue = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleAll = () => {
    setSelected(selected.length === values.length ? [] : values);
  };

  const clearFilter = () => {
    setSelected([]);
    setSearch("");
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={ref}>
      <button onClick={() => setOpen(!open)}>Filter ▾</button>

      {open && (
        <div className="popup">
          <Label className="w-28 p-2 b-black">Values</Label>

          <input
            type="text"
            placeholder="Enter text to search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search"
          />
          <div className="list">
            <label>
              <input
                type="checkbox"
                checked={selected.length === values.length}
                onChange={toggleAll}
              />
              (All)
            </label>
            {filteredValues.map((v) => (
              <label key={v}>
                <input
                  type="checkbox"
                  checked={selected.includes(v)}
                  onChange={() => toggleValue(v)}
                />
                {v}
              </label>
            ))}
          </div>

          <div className="footer">
            <button onClick={clearFilter}>Clear Filter</button>
            <button
              onClick={() => {
                onApply(selected);
                setOpen(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
