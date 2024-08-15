import zod from "zod";
import { User } from "../database.js";
import jwt from "jsonwebtoken";

const userData = zod.object({
  firstname: zod.string(),
  lastname: zod.string(),
  username: zod.string().email(),
  password: zod.string(),
});

export default async function signup(req, res) {
  console.log("got a request..");
  console.log(req.body);

  const { success } = userData.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({ message: "user already exists!" });
  }

  try {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    const userId = user._id;

    const token = jwt.sign({ userId: userId }, process.env.SECRET);

    res.status(200).json({
      message: "user created successfully",
      token: token,
    });
  } catch (error) {
    res.status(411).json({msg:"something went wrong"});
    console.log(error);
  }
}
