import jwt from "jsonwebtoken";
export const generateTokenAndSetCookies = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true, // cookie can only be accessed by the server and not by the client
    secure: process.env.NODE_ENV === "production", // cookie can be accessed only in production environment and not in development environment
    sameSite: "strict", // prevent CSRF attacks Cross-Site Request Forgery
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
};

//Cookies are small pieces of data that a website stores on a user's browser to remember information across sessions.
