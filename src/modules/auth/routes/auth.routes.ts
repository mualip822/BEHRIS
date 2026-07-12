import { Router } from "express";

import * as controller from "../controllers/auth.controller";

const router = Router();

// =====================================
// REGISTER
// =====================================
router.post("/register", controller.register);

// =====================================
// LOGIN
// =====================================
router.post("/login", controller.login);

// =====================================
// LOGIN WITH GOOGLE
// =====================================
router.post("/google", controller.googleLogin);

// =====================================
// VERIFY OTP
// =====================================
router.post("/verify-otp", controller.verifyOTP);

export default router;