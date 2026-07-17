import { Router } from "express";
import { lamaranController } from "../controllers/lamaran.controller";
import { authMiddleware } from "../../../core/middlewares/auth.middleware";

const router = Router();

// LIST LAMARAN SAYA
router.get(
  "/me/lamaran",
  authMiddleware,
  lamaranController.getLamaranSaya.bind(lamaranController)
);

// DETAIL LAMARAN
router.get(
  "/lamaran/:id",
  authMiddleware,
  lamaranController.getDetailLamaran.bind(lamaranController)
);

export default router;