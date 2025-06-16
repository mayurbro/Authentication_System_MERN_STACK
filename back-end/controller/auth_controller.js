import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookies } from "../utility/generateTokenAndSetCookies.js";
import {
  sendVerificationEmail,
  welcomeEmail,
  sendResetPasswordLink,
  sendResetSuccessEmail,
} from "../mailtrap/email.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
const client_url = process.env.CLIENT_URL;
// Signup function for user registration
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Check for missing fields
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Create a new user instance
    const user = new User({
      email,
      password: hashPassword,
      name,
      verificationToken,
      verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      //
      // Date.now --> current time in milliseconds
      // 24 * 60 * 60 * 1000 --> 24 hours in milliseconds

      // verificationTokenExpireAt --> time when the verification token will expire
      // Date.now() + 24 * 60 * 60 * 1000 --> current time + 24 hours
    });
    await user.save();

    // Generate a JWT and set cookies
    generateTokenAndSetCookies(res, user._id); // Ensure this function is defined
    await sendVerificationEmail(user.email, verificationToken);
    // Respond with success
    res.status(201).json({
      success: true,
      user: { ...user._doc, password: undefined }, // Omit password and sends user object with all the data
      message: "User created successfully",
    });
  } catch (err) {
    // Log the error for debugging (optional)
    console.error(err); // Log to the server console for troubleshooting

    // Respond with error
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// verify the email that were we send the token
export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpireAt: { $gt: Date.now() },
    });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expire verification code",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpireAt = undefined;

    await user.save();

    // send welcome email using mailtrap with email template
    await welcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "Welcome email sent successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error sending welcome email" + error);
  }
};

// Login and logout functions (implement as needed)
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ success: false, message: "wrong password" });
    }

    await generateTokenAndSetCookies(res, user._id);
    user.lastLogin = new Date();
    await user.save();
    console.log(user);
    console.log("login");

    res
      .status(200)
      .json({ success: true, message: "User login successfully", user });
  } catch (error) {
    console.log("Error in login ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "User logout Successfully",
  });
  res.send("log out");
};

// Password reset functionality

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    console.log("resetToken" + resetToken);
    const tokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpireAt = tokenExpiresAt;
    await user.save();

    await sendResetPasswordLink(
      user.email,
      `${client_url}/reset-password/${resetToken}`
    );
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error while setting new password" + error);
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log(`token: ${token}`);
  console.log(`password : ${password}`);
  try {
    console.log("reset password call");

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpireAt: { $gt: Date.now() },
    });
    if (!user) {
      console.log("user not found");
      return res.status(400).json({
        success: false,
        message: "Invalid or expire reset password token",
      });
    }
    const hashPassword = await bcryptjs.hash(password, 10);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);
    res.status(200).json({
      success: true,
      message: "Reset password email sent successfully",
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Checking authentication or authorizing user

export const checkAuth = async (req, res) => {
  try {
    // const{userId} = req.body;
    const user = await User.findById(req.userId).select("-password");
    console.log(user.userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in auth check: " + error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
