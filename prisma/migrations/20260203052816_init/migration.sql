-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PLACED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'PENDING', 'FAILED');

-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('ROSE', 'ROSE_NOTE', 'ROSE_NOTE_CHOC');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "packageType" "PackageType" NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "dorm" TEXT NOT NULL,
    "room" TEXT NOT NULL,
    "otherLocation" TEXT,
    "addresseeName" TEXT NOT NULL,
    "senderName" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PLACED',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PAID',
    "stripeSession" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
