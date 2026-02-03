import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/admin";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = await request.json();

  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: payload.status,
      deliveryTime: payload.deliveryTime,
      dorm: payload.dorm,
      room: payload.room,
      otherLocation: payload.otherLocation || null,
      addresseeName: payload.addresseeName,
      senderName: payload.senderName || null,
      isAnonymous: payload.isAnonymous,
      note: payload.note || null,
      packageType: payload.packageType,
      priceCents: payload.priceCents,
    },
  });

  return NextResponse.json({ order: updated });
}
