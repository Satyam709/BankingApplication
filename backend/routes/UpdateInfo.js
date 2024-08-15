import zod from "zod";
import { User } from "../database.js";

const userStructure = zod.object({
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string(),
});

export default async function updateInfo(req, res) {
  const validate = userStructure.safeParse(req.body);

  if (!validate.success) {
    return res.status(403).json({ msg: "cant update / invalid inputs" });
  }
  try {
    await User.updateOne({
      _id: req.userId,
    },req.body,{runValidators:true});

    const updatedInfo = await User.findOne({_id:req.userId});

    res.status(200).json({ msg: "updated successfully!" +updatedInfo});
  } catch (error) {
    console.log(error);
    return res.status(403).json({ msg: "cant update" });
  }
}
