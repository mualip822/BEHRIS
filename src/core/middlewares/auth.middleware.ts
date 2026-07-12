import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

/**
 * MAIN AUTH MIDDLEWARE
 */
export const authMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = verifyToken(token);

    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    req.user = {
  id: decoded.id,
  role: decoded.role,
};

console.log("=== AUTH USER ===");
console.log(req.user);

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

/**
 * ALIAS (biar cocok dengan import lama kamu)
 */
export const authenticate = authMiddleware;

/**
 * ROLE GUARD: HR ONLY
 */
export const hrOnly = (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

   if (
  user.role !== "rekrutmen_admin" &&
  user.role !== "admin"
) {
  return res.status(403).json({
    message: "Forbidden",
  });
}

    next();
  } catch (err) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }
};
