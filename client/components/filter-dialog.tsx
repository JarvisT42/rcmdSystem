"use client";

import { useState, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CornerDownRight, Move } from "lucide-react";

export interface FilterItem {
  id: string;
  label: string;
}

interface FilterDialogProps {
  items: FilterItem[];
  selectedItems?: string[];
  onClose: () => void;
  onApply: (selectedItems: string[]) => void;
}

export function FilterDialog({
  items,
  selectedItems = [],
  onClose,
  onApply,
}: FilterDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set(selectedItems));
  const [selectAll, setSelectAll] = useState(
    selectedItems.length === items.length
  );

  // 🔹 Resizable state
  const [size, setSize] = useState({ width: 400, height: 480 });
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef(size);

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    setSelectAll(checked);
    setSelected(checked ? new Set(items.map((item) => item.id)) : new Set());
  };

  const handleItemToggle = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selected);
    checked ? newSelected.add(itemId) : newSelected.delete(itemId);
    setSelected(newSelected);
    setSelectAll(newSelected.size === items.length);
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
        Values
      </div>

      {/* Content */}
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

          {filteredItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-2 ">
              <Checkbox
                checked={selected.has(item.id)}
                onCheckedChange={(checked) =>
                  handleItemToggle(item.id, checked === true)
                }
              />
              <span className="text-xs break-words">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-muted/50 px-4 py-3 flex justify-between shrink-0 mb-7">
        <Button variant="ghost" size="sm" onClick={handleClearFilter}>
          Clear Filter
        </Button>
        <Button size="sm" onClick={handleApply}>
          Close
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
}
