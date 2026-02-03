"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DORMS,
  EVENT_DATE_ISO,
  PACKAGE_OPTIONS,
  TIME_SLOTS,
} from "@/lib/constants";
import { formatCents } from "@/lib/order";

type OrderState = {
  packageId: (typeof PACKAGE_OPTIONS)[number]["id"];
  deliveryTime: string;
  dorm: string;
  room: string;
  otherLocation: string;
  addresseeName: string;
  senderName: string;
  isAnonymous: boolean;
  note: string;
};

export default function Home() {
  const [form, setForm] = useState<OrderState>({
    packageId: "ROSE",
    deliveryTime: TIME_SLOTS[0],
    dorm: DORMS[0],
    room: "",
    otherLocation: "",
    addresseeName: "",
    senderName: "",
    isAnonymous: false,
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<{
    orderNumber: string;
    trackingCode: string;
    priceCents: number;
  } | null>(null);

  const selectedPackage = useMemo(
    () => PACKAGE_OPTIONS.find((option) => option.id === form.packageId),
    [form.packageId]
  );

  const showNote = form.packageId !== "ROSE";
  const showOtherLocation = form.dorm.includes("Other");

  const totalLabel = selectedPackage ? formatCents(selectedPackage.priceCents) : "$0";

  const handleChange = (field: keyof OrderState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setConfirmation(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          note: showNote ? form.note : undefined,
          otherLocation: showOtherLocation ? form.otherLocation : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error || "Unable to place order.");
        return;
      }

      setConfirmation({
        orderNumber: data.orderNumber,
        trackingCode: data.trackingCode,
        priceCents: data.priceCents,
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen valentine-grid">
      <header className="px-6 pt-10 pb-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-3xl border border-rose-100 bg-white/80 px-6 py-8 shadow-lg backdrop-blur-md">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.3em] text-rose-700/70">
              Columbia Valentine Delivery
            </p>
            <h1 className="text-3xl font-semibold text-rose-900 md:text-5xl">
              Lion Hearts Rose Delivery
            </h1>
            <p className="max-w-2xl text-base text-rose-700 md:text-lg">
              Surprise someone on campus with a rose. Orders are for February 14, 2026
              only, with delivery limited to Columbia dorms and adjacent campus
              locations.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-rose-50 px-4 py-2 text-sm text-rose-700">
              Feb 14 only
            </span>
            <span className="rounded-full bg-rose-50 px-4 py-2 text-sm text-rose-700">
              Columbia campus delivery
            </span>
            <span className="rounded-full bg-rose-50 px-4 py-2 text-sm text-rose-700">
              Track with order number + 4-digit code
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/track"
              className="rounded-full border border-rose-200 px-5 py-2 text-sm font-semibold text-rose-800 transition hover:border-rose-300 hover:bg-rose-50"
            >
              Track an order
            </Link>
            <Link
              href="/admin"
              className="rounded-full border border-transparent bg-rose-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
            >
              Admin login
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 pb-16 md:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-card rounded-3xl p-8">
          <h2 className="font-serif text-2xl text-rose-900">Place Your Order</h2>
          <p className="mt-2 text-sm text-rose-700">
            All deliveries are scheduled for {EVENT_DATE_ISO}. Orders outside campus
            will be canceled.
          </p>

          <form onSubmit={submitOrder} className="mt-6 space-y-6">
            <div>
              <p className="text-sm font-semibold text-rose-900">Choose a package</p>
              <div className="mt-3 grid gap-3">
                {PACKAGE_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 transition ${
                      form.packageId === option.id
                        ? "border-rose-400 bg-rose-50"
                        : "border-rose-100 bg-white"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-rose-900">{option.label}</p>
                      <p className="text-sm text-rose-600">{option.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-rose-800">
                        {formatCents(option.priceCents)}
                      </span>
                      <input
                        type="radio"
                        name="package"
                        checked={form.packageId === option.id}
                        onChange={() => handleChange("packageId", option.id)}
                        className="accent-rose-600"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-rose-900">
                Delivery time
                <select
                  className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                  value={form.deliveryTime}
                  onChange={(event) => handleChange("deliveryTime", event.target.value)}
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-rose-900">
                Dorm or campus location
                <select
                  className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                  value={form.dorm}
                  onChange={(event) => handleChange("dorm", event.target.value)}
                >
                  {DORMS.map((dorm) => (
                    <option key={dorm} value={dorm}>
                      {dorm}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {showOtherLocation && (
              <label className="flex flex-col gap-2 text-sm font-medium text-rose-900">
                Adjacent dorm / campus location
                <input
                  className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                  placeholder="e.g. Lerner Hall lobby"
                  value={form.otherLocation}
                  onChange={(event) => handleChange("otherLocation", event.target.value)}
                />
              </label>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-rose-900">
                Room
                <input
                  className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                  placeholder="Room number"
                  value={form.room}
                  onChange={(event) => handleChange("room", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-rose-900">
                Addressee name
                <input
                  className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                  placeholder="Who should receive the rose?"
                  value={form.addresseeName}
                  onChange={(event) => handleChange("addresseeName", event.target.value)}
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-rose-900">
                Sender name (optional)
                <input
                  className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                  placeholder="Leave blank for anonymous"
                  value={form.senderName}
                  onChange={(event) => handleChange("senderName", event.target.value)}
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-rose-900">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-rose-600"
                  checked={form.isAnonymous}
                  onChange={(event) => handleChange("isAnonymous", event.target.checked)}
                />
                Make this anonymous for the receiver
              </label>
            </div>

            {showNote && (
              <label className="flex flex-col gap-2 text-sm font-medium text-rose-900">
                Note (max 200 characters)
                <textarea
                  className="min-h-[120px] rounded-xl border border-rose-100 bg-white px-3 py-2 text-rose-900 focus:border-rose-400 focus:outline-none"
                  placeholder="Write your note..."
                  maxLength={200}
                  value={form.note}
                  onChange={(event) => handleChange("note", event.target.value)}
                />
                <span className="text-xs text-rose-600">
                  {form.note.length}/200 characters
                </span>
              </label>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            {confirmation && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
                <p className="font-semibold">Order placed successfully.</p>
                <p className="mt-2">
                  Order number: <span className="font-semibold">{confirmation.orderNumber}</span>
                </p>
                <p>
                  Tracking code: <span className="font-semibold">{confirmation.trackingCode}</span>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="rose-gradient w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Placing order..." : `Pay ${totalLabel} & place order`}
            </button>
          </form>
        </section>

        <aside className="space-y-6">
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-serif text-xl text-rose-900">What is included</h3>
            <ul className="mt-4 space-y-3 text-sm text-rose-700">
              <li>Single fresh rose delivered by hand.</li>
              <li>Note option with anonymous delivery if desired.</li>
              <li>Chocolate bar add-on for extra sweetness.</li>
            </ul>
          </div>
          <div className="glass-card rounded-3xl p-6">
            <h3 className="font-serif text-xl text-rose-900">Delivery rules</h3>
            <ul className="mt-4 space-y-3 text-sm text-rose-700">
              <li>Only Columbia dorms and adjacent campus locations.</li>
              <li>Orders outside campus will be canceled.</li>
              <li>Track using your order number + 4-digit code.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6">
            <h3 className="font-serif text-xl text-rose-900">Need help?</h3>
            <p className="mt-3 text-sm text-rose-700">
              Questions about the form or delivery? Reach out to the Lion Hearts
              team and we will help confirm the details.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
