// @ts-check

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  const shivangEmail = "shivang@gmail.com";
  const sachinEmail = "sachin@gmail.com";
  await prisma.account.upsert({
    create: { email: shivangEmail, balance: 1000 },
    where: { email: shivangEmail },
    update: {balance: 1000},
  });

  await prisma.account.upsert({
    create: { email: sachinEmail, balance: 0 },
    where: { email: sachinEmail },
    update: {},
  });
}

seed();

/**
 * @param {string} from
 */
async function transfer(from, to, amount) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Decrement amount from the sender.
      const sender = await tx.account.update({
        data: {
          balance: {
            decrement: amount,
          },
        },
        where: {
          email: from,
        },
      });

      // 2. Verify that the sender's balance didn't go below zero.
      if (sender.balance < 0) {
        throw new Error(`${from} doesn't have enough to send ${amount}`);
      }

      // 3. Increment the recipient's balance by amount
      const recipient = await tx.account.update({
        data: {
          balance: {
            increment: amount,
          },
        },
        where: {
          email: to,
        },
      });
      return recipient;
    });
    console.log("Transfer was successful");
  } catch (e) {
    console.log("Transfer failed");
  }
}

async function main() {
  await seed();
  await transfer("shivang@gmail.com", "sachin@gmail.com", 1000);
  await transfer("shivang@gmail.com", "sachin@gmail.com", 1000);
}

main();
