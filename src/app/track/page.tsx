"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCents } from "@/lib/order";

type OrderLookup = {
  orderNumber: string;
  status: string;
  deliveryTime: string;
  dorm: string;
  room: string;
  otherLocation?: string | null;
  addresseeName: string;
  isAnonymous: boolean;
  packageType: string;
  priceCents: number;
  note?: string | null;
};

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderLookup | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch(`/api/orders/${orderNumber}?code=${code}`);
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Order not found.");
        return;
      }
      setOrder(data);
    } catch (err) {
      setError("Unable to fetch your order right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen valentine-grid px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="glass-card rounded-3xl p-8">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-3xl text-rose-900">Track your order</h1>
            <Link
              href="/"
              className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
            >
              Back to order
            </Link>
          </div>
          <p className="mt-3 text-sm text-rose-700">
            Enter your order number and 4-digit code to see delivery status.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-[1.2fr_1fr_auto]">
            <input
              className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-rose-900 focus:border-rose-400 focus:outline-none"
              placeholder="Order number (e.g. LH-2026-1234)"
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value.trim())}
            />
            <input
              className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-rose-900 focus:border-rose-400 focus:outline-none"
              placeholder="4-digit code"
              value={code}
              onChange={(event) => setCode(event.target.value.trim())}
            />
            <button
              type="submit"
              disabled={loading}
              className="rose-gradient rounded-full px-6 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Checking..." : "Track"}
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
        </div>

        {order && (
          <div className="glass-card rounded-3xl p-8">
            <h2 className="font-serif text-2xl text-rose-900">Order details</h2>
            <div className="mt-4 grid gap-4 text-sm text-rose-700 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-rose-500">Status</p>
                <p className="text-lg font-semibold text-rose-900">{order.status}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-rose-500">Delivery time</p>
                <p className="text-lg font-semibold text-rose-900">{order.deliveryTime}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-rose-500">Location</p>
                <p className="text-lg font-semibold text-rose-900">
                  {order.dorm} {order.room}
                </p>
                {order.otherLocation && (
                  <p className="text-sm text-rose-600">Other: {order.otherLocation}</p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-rose-500">Package</p>
                <p className="text-lg font-semibold text-rose-900">{order.packageType}</p>
                <p className="text-sm text-rose-600">{formatCents(order.priceCents)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-rose-500">Addressee</p>
                <p className="text-lg font-semibold text-rose-900">{order.addresseeName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-rose-500">Anonymous</p>
                <p className="text-lg font-semibold text-rose-900">
                  {order.isAnonymous ? "Yes" : "No"}
                </p>
              </div>
              {order.note && (
                <div className="md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-rose-500">Note</p>
                  <p className="mt-2 rounded-2xl border border-rose-100 bg-white px-4 py-3 text-rose-700">
                    {order.note}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
