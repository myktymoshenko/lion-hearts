"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DORMS, ORDER_STATUSES, PACKAGE_OPTIONS, TIME_SLOTS } from "@/lib/constants";
import { formatCents } from "@/lib/order";

type Order = {
  id: string;
  orderNumber: string;
  trackingCode: string;
  status: string;
  deliveryTime: string;
  dorm: string;
  room: string;
  otherLocation?: string | null;
  addresseeName: string;
  senderName?: string | null;
  isAnonymous: boolean;
  note?: string | null;
  packageType: string;
  priceCents: number;
  createdAt: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lion-admin-code") ?? "";
    setAdminCode(stored);
  }, []);

  const fetchOrders = async (code: string) => {
    if (!code) {
      setError("Admin code required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/orders", {
        headers: { "x-admin-code": code },
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Unable to load orders.");
        return;
      }
      setOrders(data.orders);
    } catch (err) {
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminCode) {
      fetchOrders(adminCode);
    }
  }, [adminCode]);

  const totalOrders = orders.length;
  const pendingCount = useMemo(
    () => orders.filter((order) => order.status !== "DELIVERED").length,
    [orders]
  );

  const handleUpdate = async () => {
    if (!selected || !adminCode) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/orders/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-code": adminCode },
        body: JSON.stringify(selected),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Unable to update order.");
        return;
      }
      setOrders((prev) =>
        prev.map((order) => (order.id === selected.id ? data.order : order))
      );
      setSelected(null);
    } catch (err) {
      setError("Unable to update order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen valentine-grid px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-rose-500">Lion Hearts</p>
            <h1 className="font-serif text-3xl text-rose-900">Admin dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
            >
              View site
            </Link>
            <button
              onClick={() => fetchOrders(adminCode)}
              className="rose-gradient rounded-full px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Refresh
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="glass-card rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-500">Total orders</p>
            <p className="mt-3 text-3xl font-semibold text-rose-900">{totalOrders}</p>
          </div>
          <div className="glass-card rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-500">Active orders</p>
            <p className="mt-3 text-3xl font-semibold text-rose-900">{pendingCount}</p>
          </div>
          <div className="glass-card rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-500">Admin code</p>
            <input
              className="mt-3 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-rose-900 focus:border-rose-400 focus:outline-none"
              placeholder="Admin code"
              value={adminCode}
              onChange={(event) => setAdminCode(event.target.value)}
            />
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelected(order)}
                className="glass-card flex w-full flex-col gap-3 rounded-3xl px-6 py-5 text-left transition hover:shadow-xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-rose-500">
                      {order.orderNumber}
                    </p>
                    <p className="text-lg font-semibold text-rose-900">
                      {order.addresseeName}
                    </p>
                  </div>
                  <span className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700">
                    {order.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-rose-700">
                  <p>
                    {order.dorm} {order.room}
                  </p>
                  <p>{formatCents(order.priceCents)}</p>
                </div>
                <p className="text-xs text-rose-500">Tracking code: {order.trackingCode}</p>
              </button>
            ))}
            {!orders.length && (
              <div className="glass-card rounded-3xl p-6 text-sm text-rose-700">
                {loading ? "Loading orders..." : "No orders yet."}
              </div>
            )}
          </div>

          <div className="glass-card rounded-3xl p-6">
            <h2 className="font-serif text-xl text-rose-900">Edit order</h2>
            {selected ? (
              <div className="mt-4 space-y-4 text-sm text-rose-700">
                <label className="flex flex-col gap-2">
                  Status
                  <select
                    className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                    value={selected.status}
                    onChange={(event) =>
                      setSelected({ ...selected, status: event.target.value })
                    }
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  Delivery time
                  <select
                    className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                    value={selected.deliveryTime}
                    onChange={(event) =>
                      setSelected({ ...selected, deliveryTime: event.target.value })
                    }
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  Dorm or location
                  <select
                    className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                    value={selected.dorm}
                    onChange={(event) =>
                      setSelected({ ...selected, dorm: event.target.value })
                    }
                  >
                    {DORMS.map((dorm) => (
                      <option key={dorm} value={dorm}>
                        {dorm}
                      </option>
                    ))}
                  </select>
                </label>
                {selected.dorm.includes("Other") && (
                  <label className="flex flex-col gap-2">
                    Other location
                    <input
                      className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                      value={selected.otherLocation ?? ""}
                      onChange={(event) =>
                        setSelected({ ...selected, otherLocation: event.target.value })
                      }
                    />
                  </label>
                )}
                <label className="flex flex-col gap-2">
                  Room
                  <input
                    className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                    value={selected.room}
                    onChange={(event) =>
                      setSelected({ ...selected, room: event.target.value })
                    }
                  />
                </label>
                <label className="flex flex-col gap-2">
                  Addressee name
                  <input
                    className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                    value={selected.addresseeName}
                    onChange={(event) =>
                      setSelected({ ...selected, addresseeName: event.target.value })
                    }
                  />
                </label>
                <label className="flex flex-col gap-2">
                  Package
                  <select
                    className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                    value={selected.packageType}
                    onChange={(event) =>
                      setSelected({ ...selected, packageType: event.target.value })
                    }
                  >
                    {PACKAGE_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  Price (cents)
                  <input
                    type="number"
                    className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                    value={selected.priceCents}
                    onChange={(event) =>
                      setSelected({
                        ...selected,
                        priceCents: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label className="flex flex-col gap-2">
                  Note
                  <textarea
                    className="min-h-[120px] rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                    value={selected.note ?? ""}
                    onChange={(event) =>
                      setSelected({ ...selected, note: event.target.value })
                    }
                  />
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-rose-600"
                    checked={selected.isAnonymous}
                    onChange={(event) =>
                      setSelected({ ...selected, isAnonymous: event.target.checked })
                    }
                  />
                  Anonymous for receiver
                </label>

                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="rose-gradient w-full rounded-full px-6 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Save changes"}
                </button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-rose-600">
                Select an order to view and edit details.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
