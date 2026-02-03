import { z } from "zod";
import { PACKAGE_OPTIONS, TIME_SLOTS } from "./constants";

const packageIds = PACKAGE_OPTIONS.map((option) => option.id) as [
  string,
  ...string[],
];

export const orderSchema = z.object({
  packageId: z.enum(packageIds),
  deliveryTime: z.enum(TIME_SLOTS as [string, ...string[]]),
  dorm: z.string().min(2, "Select a dorm or location."),
  room: z.string().min(1, "Room is required."),
  otherLocation: z.string().optional(),
  addresseeName: z.string().min(2, "Addressee name required."),
  senderName: z.string().optional(),
  isAnonymous: z.boolean(),
  note: z.string().max(200).optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;
