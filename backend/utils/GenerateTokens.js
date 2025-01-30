import jwt from "jsonwebtoken";

export const generateAccessToken = (res, user) => {
  const accessToken = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "7d",
    }
  );

  // Set cookies
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return accessToken;
};

export const generateRefreshToken = (res, user) => {
  const refreshToken = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return refreshToken;
};
