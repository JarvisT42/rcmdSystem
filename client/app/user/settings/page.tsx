"use client";

import { useState } from "react";

export default function Home() {
  const [page, setPage] = useState<"home" | "about" | "contact">("home");

  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <div>
            <h2 className="text-xl font-semibold">Home</h2>
            <p className="mt-2">
              This is a simple Single Page Application built with Next.js.
            </p>
          </div>
        );
      case "about":
        return (
          <div>
            <h2 className="text-xl font-semibold">About</h2>
            <p className="mt-2">Navigation happens without page reloads.</p>
          </div>
        );
      case "contact":
        return (
          <div>
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="mt-2">
              All content is rendered dynamically on one page.
            </p>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Next.js SPA Example</h1>

      <nav className="flex gap-4">
        <button
          onClick={() => setPage("home")}
          className="px-4 py-2 rounded-xl shadow"
        >
          Home
        </button>
        <button
          onClick={() => setPage("about")}
          className="px-4 py-2 rounded-xl shadow"
        >
          About
        </button>
        <button
          onClick={() => setPage("contact")}
          className="px-4 py-2 rounded-xl shadow"
        >
          Contact
        </button>
      </nav>

      <section className="p-6 rounded-2xl shadow max-w-md w-full text-center">
        {renderPage()}
      </section>
    </main>
  );
}
