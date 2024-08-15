import express from "express";
import signup from "./signup.js";
import signin from "./sign.js";
const router = express.Router();

router.post("/signup",signup);

router.get("/signin",signin);

export default router;