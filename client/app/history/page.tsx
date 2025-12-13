"use client";

import Link from "next/link";

export default function HistoryPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">History Page</h1>

      <nav className="flex gap-4">
        <Link href="/" className="px-4 py-2 rounded-xl shadow">
          Home
        </Link>
        <Link href="/settings" className="px-4 py-2 rounded-xl shadow">
          Settings
        </Link>
      </nav>
    </main>
  );
}
