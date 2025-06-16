import jwt from "jsonwebtoken";
export const verifyToken = async (req, res, next) => {
  const { token } = req.cookies;
  console.log("verifyToken" + token);
  if (!token) {
    console.log("Token is not provided");
    return res
      .status(400)
      .json({ success: false, message: "Unauthorized - no token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.json({
        success: false,
        message: "Unauthorized - Invalid token",
      });
    }
    req.userId = decoded.userId;
    console.log("decoded userid" + decoded.userId);
    next();
  } catch (error) {
    console.log("Error in verifyToken: " + error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
