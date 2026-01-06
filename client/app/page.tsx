"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterDialog } from "@/components/filter-dialog";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filterItems = [
    { id: "1", label: "AVIOR HOTEL" },
    { id: "2", label: "DADLANGAS GLASS AND CONSTRUCT" },
    { id: "3", label: "EVERGREEN HOMES" },
    { id: "4", label: "JAMES CONSTRUCTION" },
    { id: "5", label: "MARIA'S BAKERY" },
    { id: "6", label: "TECH SOLUTIONS INC" },
  ];

  const handleApply = (items: string[]) => {
    setSelectedItems(items);
    setOpen(false); // Close popover after applying
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
      <div className="space-y-4">


        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
              {selectedItems.length > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {selectedItems.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-0" align="start">
            <div className="relative">
              <FilterDialog
                items={filterItems}
                selectedItems={selectedItems}
                onClose={handleClose}
                onApply={handleApply}
              />
            </div>
          </PopoverContent>
        </Popover>

       
        
      </div>
   
  );
}