import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import CustomError from '../utils/CustomError.js';

const verifyJwt = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(new CustomError('Unauthorized: No token provided', 401));
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decoded) => {
    if (err) {
      return next(new CustomError('Unauthorized: Invalid or expired token', 401));
    }

    try {
      // Ensure the user still exists
      const user = await User.findById(decoded._id);
      if (!user) {
        return next(new CustomError('Unauthorized: User not found', 401));
      }

      req.user = decoded; // Attach decoded token (no extra user data)

      next();
    } catch (error) {
      return next(new CustomError('Internal Server Error', 500));
    }
  });
};

export default verifyJwt;
