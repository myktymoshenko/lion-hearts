import { PACKAGE_OPTIONS } from "./constants";

export type PackageId = (typeof PACKAGE_OPTIONS)[number]["id"];

export const getPackageById = (id: PackageId) =>
  PACKAGE_OPTIONS.find((option) => option.id === id);

export const calculatePriceCents = (id: PackageId) => {
  const selected = getPackageById(id);
  return selected ? selected.priceCents : 0;
};

export const formatCents = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);

export const generateTrackingCode = () =>
  Math.floor(1000 + Math.random() * 9000).toString();

export const generateOrderNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `LH-${year}-${suffix}`;
};

export const isEventDate = (value: Date) => {
  const nyDate = value.toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
  return nyDate === "2026-02-14";
};
