import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";
import User from "../models/UserModel.js";
import Department from "../models/DepartmentModel.js";

import {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendRestSuccessEmail,
} from "../utils/SendEmail.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/GenerateTokens.js";

// @desc Signup
// @route POST /api/auth/signup
// @access Public
const signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, position, departmentId } = req.body;

  const department = await Department.findById(departmentId);
  if (!department) {
    return next(new CustomError("Department not found", 404));
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new CustomError("User already exists", 400));
  }

  // Generate verification token (with expiration)
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Create new user
  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    position,
    department: department._id,
    verificationToken,
    verificationTokenExpiry: Date.now() + 3600000, // 1 hour expiration
  });

  // Save user
  await newUser.save();

  // Generate access and refresh tokens
  // generateAccessToken(res, newUser);
  // generateRefreshToken(res, newUser);

  // Send verification email
  await sendVerificationEmail(newUser.email, verificationToken);

  res.status(201).json({
    message: "User created successfully. Please verify your email",
  });
});

// @desc Verify email
// @route GET /api/auth/verify-email
// @access Public
const verifyEmail = asyncHandler(async (req, res, next) => {
  const { code } = req.body;

  // Find user with token
  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpiry: { $gt: Date.now() },
  });

  // If user not found
  if (!user) {
    return next(new CustomError("Invalid or expired verification token", 400));
  }

  // Update user to verified
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();

  // Prepare response
  const response = await User.findById(user._id).select("-password");

  // Send response
  res.status(200).json(response);
});

// @desc Login
// @route POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new CustomError("No account found. Please sign up.", 404));
  } else if (!(await user.matchPassword(password))) {
    return next(new CustomError("Invalid email or password", 403));
  }

  // Check if user is verified
  if (!user.isVerified) {
    return next(new CustomError("Please verify your email", 400));
  }

  // Generate JWT tokens
  generateAccessToken(res, user);
  generateRefreshToken(res, user);

  // Prepare response
  const response = await User.findById(user._id).select("-password").populate("department", "name");
  const departments = await Department.find({});
  // Send response
  res.status(200).json({
    currentUser: response,
    departments,
    selectedDepartment: response?.department?._id
  });
});

// @desc Logout
// @route POST /api/auth/logout
// @access Private
const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res.status(200).json({
    message: "Logout successful",
  });
});

// @desc Forgot password
// @route POST /api/auth/forgot-password
// @access Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomError("No account found. Please sign up.", 404));
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiry = Date.now() + 3600000; // 1 hour

  // Save user
  await user.save();

  // Send email
  await sendResetPasswordEmail(
    user.email,
    `${process.env.CLIENT_URL}/reset-password/${resetToken}`
  );

  res.status(200).json({
    message: "Reset password email sent. Please check your email.",
  });
});

// @desc Reset password
// @route POST /api/auth/reset-password/:resetToken
// @access Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  // Find user with token
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  // If user not found
  if (!user) {
    return next(new CustomError("Invalid or expired reset token", 400));
  }

  // Update user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const updateUser = await User.findOneAndUpdate(
    { _id: user._id },
    {
      password: hashedPassword,
      isVerified: true,
    },
    { new: true }
  );

  updateUser.resetPasswordToken = undefined;
  updateUser.resetPasswordExpiry = undefined;
  await updateUser.save();

  // Send email
  await sendRestSuccessEmail(updateUser.email);

  // Send response
  res.status(200).json({
    message: "Password reset successful. Please login.",
  });
});

// @desc Get refresh token
// @route GET /api/auth/refresh
// @access Public
const getRefreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refresh_token; // Get refresh token from cookies

  if (!refreshToken) {
    return next(new CustomError('Forbidden: No refresh token provided', 403));
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await User.findById(decoded._id);
    if (!user) {
      return next(new CustomError('Forbidden: Invalid or expired refresh token', 403));
    }

    // Generate new access token
    generateAccessToken(res, user);

    res.status(200).json({ message: 'Access token refreshed' });
  } catch (error) {
    next(error);
  }
})

export { signup, verifyEmail, login, logout, forgotPassword, resetPassword, getRefreshToken };
