import { Router } from "express";
import { LamaranController } from "../controllers/lamaran.controller";

// middleware auth kamu (sesuaikan nama kalau beda)
import { authMiddleware } from "../../../core/middlewares/auth.middleware";

const router = Router();

// ===========================
// LIST LAMARAN SAYA
// ===========================
router.get(
  "/me/lamaran",
  authMiddleware,
  LamaranController.myApplications
);

// ===========================
// DETAIL LAMARAN
// ===========================
router.get(
  "/lamaran/:id",
  authMiddleware,
  LamaranController.detail
);

export default router;