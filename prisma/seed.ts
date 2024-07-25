import {
  SUBSCRIPTION_BILLING_PERIOD,
  SUBSCRIPTION_CURRENCY,
} from ".prisma/client";
import { PAYMENT_STATUS } from "@prisma/client";
import { addMonths, endOfMonth, isBefore, startOfMonth } from "date-fns";
import { prisma } from "@/lib/db";

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function getRandomDateInCurrentMonth() {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  return randomDate(start, end);
}

function nextPaymentMonthGenerator(billingPeriod: SUBSCRIPTION_BILLING_PERIOD) {
  switch (billingPeriod) {
    case SUBSCRIPTION_BILLING_PERIOD.QUERTERLY:
      return 3;
    case SUBSCRIPTION_BILLING_PERIOD.YEARLY:
      return 12;
    default:
      return 1;
  }
}

async function main() {
  const user = await prisma.user.upsert({
    where: {
      email: "jakobczyk.michal@gmail.com",
    },
    update: {
      subscriptions: {
        create: [
          {
            name: "Google Cloud",
            category: "Infrastructure",
            billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
            avatar_url: "https://avatars.githubusercontent.com/u/1040572?v=4",
            price: 5.2,
            currency: SUBSCRIPTION_CURRENCY.EUR,
            start_date: randomDate(new Date(2023, 1, 1), new Date()),
            next_payment_date: new Date(),
          },
        ],
      },
    },
    create: {
      id: "test123",
      email: "jakobczyk.michal@gmail.com",
      name: "Michal Jakobczyk",
      subscriptions: {
        create: [
          {
            name: "Google Cloud",
            category: "Infrastructure",
            billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
            avatar_url: "https://avatars.githubusercontent.com/u/1040572?v=4",
            price: 5.2,
            currency: SUBSCRIPTION_CURRENCY.EUR,
            start_date: randomDate(new Date(2023, 1, 1), new Date()),
            next_payment_date: new Date(),
          },
        ],
      },
    },
    include: {
      subscriptions: true,
    },
  });

  const updateSubscriptions = await Promise.all(
    user.subscriptions.map(async (subscription) => {
      const due_date = getRandomDateInCurrentMonth();

      const status = isBefore(due_date, new Date())
        ? PAYMENT_STATUS.PAID
        : PAYMENT_STATUS.NOT_PAID;

      await prisma.payment.create({
        data: {
          amount: subscription.price,
          due_date,
          subscription_id: subscription.id,
          status,
        },
      });

      return prisma.subscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          next_payment_date:
            status === PAYMENT_STATUS.PAID
              ? addMonths(
                  due_date,
                  nextPaymentMonthGenerator(subscription.billing_period),
                )
              : due_date,
        },
      });
    }),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
