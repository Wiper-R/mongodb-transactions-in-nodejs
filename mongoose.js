const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL);

const accountSchema = mongoose.Schema({
  email: String,
  balance: Number,
});

const Account = mongoose.model("Account", accountSchema);

async function seed() {
  const shivangEmail = "shivang@gmail.com";
  const sachinEmail = "sachin@gmail.com";
  await Account.findOneAndUpdate(
    { email: shivangEmail },
    { $set: { balance: 1000 } },
    { upsert: true }
  );

  await Account.findOneAndUpdate(
    { email: sachinEmail },
    { $set: { balance: 0 } },
    { upsert: true }
  );
}

async function transfer(from, to, amount) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // 1. Decrement amount from the sender.
    const sender = await Account.findOneAndUpdate(
      { email: from },
      { $inc: { balance: -amount } },
      { new: true, session }
    );

    // 2. Verify that the sender's balance didn't go below zero.
    if (sender.balance < 0) {
      throw new Error(`${from} doesn't have enough to send ${amount}`);
    }

    // 3. Increment the recipient's balance by amount
    await Account.findOneAndUpdate(
      { email: to },
      { $inc: { balance: amount } },
      { new: true, session }
    );

    await session.commitTransaction();
    console.log("Transfer was successful");
  } catch (error) {
    await session.abortTransaction();

    console.log("Transfer failed");
  } finally {
    session.endSession();
  }
}

async function main() {
    await seed()
    await transfer("shivang@gmail.com", "sachin@gmail.com", 1000);
    await transfer("shivang@gmail.com", "sachin@gmail.com", 1000);
    await mongoose.disconnect()
}


main()