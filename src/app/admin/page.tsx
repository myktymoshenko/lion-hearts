"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (code.trim().length < 4) {
      setError("Enter the admin code to continue.");
      return;
    }
    localStorage.setItem("lion-admin-code", code.trim());
    router.push("/admin/orders");
  };

  return (
    <div className="min-h-screen valentine-grid px-6 py-16">
      <div className="mx-auto max-w-md rounded-3xl border border-rose-100 bg-white/90 p-8 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl text-rose-900">Admin access</h1>
          <Link
            href="/"
            className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
          >
            Back
          </Link>
        </div>
        <p className="mt-2 text-sm text-rose-700">
          Enter the admin code to view and manage Valentine orders.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-rose-900">
            Admin code
            <input
              className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
              type="password"
              placeholder="Enter admin code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </label>

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="rose-gradient w-full rounded-full px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Enter dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
