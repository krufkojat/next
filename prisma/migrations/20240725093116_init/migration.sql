/*
  Warnings:

  - You are about to drop the column `billing_perdio` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "billing_perdio",
ADD COLUMN     "billing_period" "SUBSCRIPTION_BILLING_PERIOD" NOT NULL DEFAULT 'MONTHLY',
ALTER COLUMN "currency" SET DEFAULT 'PLN',
ALTER COLUMN "start_date" SET DATA TYPE DATE,
ALTER COLUMN "end_date" SET DATA TYPE DATE,
ALTER COLUMN "next_payment_date" SET DATA TYPE DATE,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
