import express from "express";
import authenticate from "./AuthMiddleware.js";
import { startSession } from "mongoose";
import { BankAccount } from "../database.js";
import { User } from "../database.js";
import zod from "zod";


const bankRouter = express.Router().use(authenticate);

bankRouter.get("/balance", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const q = await BankAccount.findOne({
      userId: userId,
    });

    res.status(200).json({ balance: q.balance });
  } catch (err) {
    console.log("cannot get balance " + err);
    res.status(403).json({
      msg: "something went wrong!",
    });
  }
});


const transferScheme = zod.object({
  reciever : zod.string(),
  amt:zod.number()
});

bankRouter.post("/transfer",async (req, res) => {

  const  {success} = transferScheme.safeParse(req.body);
  if (!success) {
    return res.json({msg:"invalid inputs"});
  }

  const session = await startSession();

  const sender = req.userId;
  const { reciever, amt } = req.body;

  if (!amt || reciever==sender) {
    return res.status(403).json({ msg: "i guess amt is zero or reciever and sender are same" });
  }
  session.startTransaction();
  try {
    const senderAcc = await BankAccount.findOne({ userId: sender }).session(
      session
    );

    if (!senderAcc || senderAcc.balance < amt) {
      await session.abortTransaction();
      return res.json({ msg: "error or balance not enough!" });
    }

    const recieverInfo = await User.findOne({ _id: reciever }).session(session);

    if (!recieverInfo) {
      await session.abortTransaction();
      return res.json({ msg: "reciever not found" });
    }

    await BankAccount.updateOne(
      { userId: sender },
      { $inc: { balance: -amt } }
    ).session(session);
    await BankAccount.updateOne(
      { userId: reciever },
      { $inc: { balance: amt } }
    ).session(session);

    session.commitTransaction();

    res.status(200).json("transaction successfull!");
  } catch (error) {
    await session.abortTransaction();
    console.log("transaction failed! " + error);
    res.json({ msg: "transaction failed!" });
  }
});

export default bankRouter;
