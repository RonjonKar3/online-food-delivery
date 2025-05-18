import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized. Login Again" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // safer and clearer
    next();
  } catch (error) {
    console.log("JWT Verification Error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized. Login Again" });
  }
};

export default authMiddleware; 