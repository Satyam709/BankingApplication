import jwt from "jsonwebtoken";

export default function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(403).json({ msg: "auth failed" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    if (decoded.userId) {
      req.userId = decoded.userId;
    }
    else return res.status(403);
    next();
  } catch (err) {
    console.log("eror in auth" + err);
    res.status(403);
  }
}
