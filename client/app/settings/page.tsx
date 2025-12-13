"use client";

import Link from "next/link";

export default function SettingsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Settings Page</h1>

      <nav className="flex gap-4">
        <Link href="/" className="px-4 py-2 rounded-xl shadow">
          Home
        </Link>
        <Link href="/history" className="px-4 py-2 rounded-xl shadow">
          History
        </Link>
      </nav>
    </main>
  );
}
