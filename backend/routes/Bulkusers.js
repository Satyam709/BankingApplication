import { User } from "../database.js";

export default async function getBulkUsers(req, res) {
  try {
    const searchString = req.query.filter; // Get the search string from the request
    
    // Find users where the search string is present in either the firstname or lastname (case-insensitive)
    const users = await User.find({
      $or: [
        { firstname: { $regex: searchString, $options: "i" } },
        { lastname: { $regex: searchString, $options: "i" } },
      ],
    });

    if (users.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }

    res.status(200).json({
      msg: `'${users.length}' Users found`,
      users: users.map((user) => ({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.username,
      })),
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ msg: "Error searching for users", error: error.message });
  }
}
