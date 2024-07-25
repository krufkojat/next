-- CreateEnum
CREATE TYPE "SUBSCRIPTION_CURRENCY" AS ENUM ('PLN', 'EUR', 'USD');

-- CreateEnum
CREATE TYPE "SUBSCRIPTION_BILLING_PERIOD" AS ENUM ('MONTHLY', 'QUERTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SUBSCRIPTION_STATUS" AS ENUM ('ACTIVE', 'NOT_ACTIVE');

-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('PAID', 'NOT_PAID');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" "SUBSCRIPTION_CURRENCY" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "billing_perdio" "SUBSCRIPTION_BILLING_PERIOD" NOT NULL,
    "next_payment_date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "status" "SUBSCRIPTION_STATUS" NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "due_date" DATE NOT NULL,
    "status" "PAYMENT_STATUS" NOT NULL DEFAULT 'NOT_PAID',
    "subscription_id" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
