import express from "express";
import userRouter from "./user.js";
import bankRouter from "./Account.js";
const mainRouter = express.Router();

mainRouter.use("/user",userRouter);
mainRouter.use("/bank",bankRouter);

export default mainRouter;