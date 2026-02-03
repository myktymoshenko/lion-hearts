export const EVENT_DATE_ISO = "2026-02-14";

export const TIME_SLOTS = [
  "9:00–11:00 AM",
  "11:00 AM–1:00 PM",
  "1:00–3:00 PM",
  "3:00–5:00 PM",
  "5:00–7:00 PM",
];

export const PACKAGE_OPTIONS = [
  {
    id: "ROSE",
    label: "Single Rose",
    description: "Classic rose delivery.",
    priceCents: 500,
  },
  {
    id: "ROSE_NOTE",
    label: "Rose + Note",
    description: "Add a handwritten note.",
    priceCents: 700,
  },
  {
    id: "ROSE_NOTE_CHOC",
    label: "Rose + Note + Chocolate Bar",
    description: "Sweeten the moment.",
    priceCents: 1000,
  },
] as const;

export const ORDER_STATUSES = [
  { id: "PLACED", label: "Placed" },
  { id: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { id: "DELIVERED", label: "Delivered" },
  { id: "CANCELLED", label: "Cancelled" },
] as const;

export const PAYMENT_STATUSES = [
  { id: "PAID", label: "Paid" },
  { id: "PENDING", label: "Pending" },
  { id: "FAILED", label: "Failed" },
] as const;

export const DORMS = [
  "Broadway Hall",
  "Furnald Hall",
  "Hartley Hall",
  "Wallach Hall",
  "John Jay Hall",
  "Livingston Hall",
  "Schapiro Hall",
  "Wien Hall",
  "Ruggles Hall",
  "Harmony Hall",
  "East Campus",
  "International House",
  "Bard Hall",
  "Butler Hall",
  "Watt Hall",
  "McBain Hall",
  "Nussbaum Hall",
  "River Hall",
  "Greenborough Hall",
  "600 West 113th",
  "611 West 112th",
  "619 West 113th",
  "623 West 113th",
  "627 West 115th",
  "633 West 115th",
  "Other (Adjacent dorm or campus location)",
] as const;

export const DEFAULT_ADMIN_CODE_HINT = "Set ADMIN_CODE in .env for real auth.";
