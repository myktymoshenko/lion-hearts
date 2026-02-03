import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ orderNumber: string }> };

export async function GET(request: Request, { params }: Params) {
  const { orderNumber } = await params;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Tracking code required." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
  });

  if (!order || order.trackingCode !== code) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    deliveryTime: order.deliveryTime,
    dorm: order.dorm,
    room: order.room,
    otherLocation: order.otherLocation,
    addresseeName: order.addresseeName,
    isAnonymous: order.isAnonymous,
    packageType: order.packageType,
    priceCents: order.priceCents,
    note: order.note,
  });
}
