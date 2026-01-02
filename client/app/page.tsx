// "use client";

// import Link from "next/link";

// export default function Home() {
//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center gap-6">
//       <h1 className="text-3xl font-bold">Home Page</h1>

//       <nav className="flex gap-4">
//         <Link href="/history" className="px-4 py-2 rounded-xl shadow">
//           Go to History
//         </Link>
//         <Link href="/settings" className="px-4 py-2 rounded-xl shadow">
//           Go to Settings
//         </Link>
//       </nav>
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { FilterDialog } from "@/components/filter-dialog";

export default function Home() {
  const [showFilter, setShowFilter] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filterItems = [
    { id: "1", label: "AVIOR HOTEL" },
    { id: "2", label: "DADLANGAS GLASS AND CONSTRUCT" },
    { id: "3", label: "EVERGREEN HOMES" },
    { id: "4", label: "EVERGREEN HOMES" },
    { id: "5", label: "EVERGREEN HOMES" },
    { id: "6", label: "EVERGREEN HOMES" },
  ];

  const handleApply = (items: string[]) => {
    setSelectedItems(items);
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Filter Dialog Component</h1>
        <p className="text-muted-foreground">
          Selected items:{" "}
          {selectedItems.length > 0 ? selectedItems.join(", ") : "None"}
        </p>

        {showFilter && (
          <FilterDialog
            items={filterItems}
            selectedItems={selectedItems}
            onClose={() => setShowFilter(false)}
            onApply={handleApply}
          />
        )}

        {!showFilter && (
          <button
            onClick={() => setShowFilter(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Open Filter
          </button>
        )}
      </div>
    </main>
  );
}
