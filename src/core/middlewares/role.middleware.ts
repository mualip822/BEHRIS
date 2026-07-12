import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user;

    console.log("=== ROLE CHECK ===");
    console.log("User Role :", user?.role);
    console.log("Allowed   :", allowedRoles);

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: "Access denied 🚫",
        role: user?.role,
        allowedRoles,
      });
    }

    next();
  };
};