import express from "express";
import signup from "./signup.js";
import signin from "./sign.js";
import authenticate from "./AuthMiddleware.js";
import updateInfo from "./UpdateInfo.js";
import getBulkUsers from "./Bulkusers.js";

const router = express.Router();

router.post("/signup",signup);

router.get("/signin",signin);

router.put("/",authenticate,updateInfo);

router.get("/bulk",getBulkUsers);


export default router;