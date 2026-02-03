import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculatePriceCents, generateOrderNumber, generateTrackingCode, isEventDate } from "@/lib/order";
import { orderSchema } from "@/lib/validators";
import { PACKAGE_OPTIONS } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const allowTest = process.env.ALLOW_TEST_ORDERS === "true";
    if (!allowTest && !isEventDate(new Date())) {
      return NextResponse.json(
        { error: "Orders are only available on February 14, 2026." },
        { status: 400 }
      );
    }

    const payload = await request.json();
    const parsed = orderSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order details.", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { packageId, dorm, otherLocation, note } = parsed.data;
    const packageMeta = PACKAGE_OPTIONS.find((option) => option.id === packageId);

    if (!packageMeta) {
      return NextResponse.json({ error: "Invalid package selection." }, { status: 400 });
    }

    const needsNote = packageId !== "ROSE";
    if (needsNote && (!note || note.trim().length === 0)) {
      return NextResponse.json({ error: "A note is required for this package." }, { status: 400 });
    }

    if (dorm.includes("Other") && (!otherLocation || otherLocation.trim().length < 3)) {
      return NextResponse.json(
        { error: "Please specify the adjacent dorm or campus location." },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();
    const trackingCode = generateTrackingCode();
    const priceCents = calculatePriceCents(packageId);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        trackingCode,
        packageType: packageId,
        priceCents,
        deliveryTime: parsed.data.deliveryTime,
        dorm: parsed.data.dorm,
        room: parsed.data.room,
        otherLocation: parsed.data.otherLocation || null,
        addresseeName: parsed.data.addresseeName,
        senderName: parsed.data.senderName || null,
        isAnonymous: parsed.data.isAnonymous,
        note: parsed.data.note || null,
        paymentStatus: "PAID",
      },
    });

    return NextResponse.json({
      orderNumber: order.orderNumber,
      trackingCode: order.trackingCode,
      status: order.status,
      priceCents: order.priceCents,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to place order. Please try again." },
      { status: 500 }
    );
  }
}
