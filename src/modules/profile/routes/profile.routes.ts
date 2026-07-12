import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { lamaranController } from "../controllers/lamaran.controller";
import { authMiddleware } from "../../../core/middlewares/auth.middleware";
import { uploadAvatar } from "../config/multer";

const router = Router();

// PROFILE
router.get("/", authMiddleware, ProfileController.getProfile);
router.post("/", authMiddleware, uploadAvatar.single("avatar"), ProfileController.saveProfile);
router.put("/", authMiddleware, uploadAvatar.single("avatar"), ProfileController.saveProfile);
router.delete("/", authMiddleware, ProfileController.deleteProfile);

// LAMARAN SAYA
router.get('/lamaran-saya', authMiddleware, lamaranController.getLamaranSaya.bind(lamaranController));
router.get('/lamaran-saya/:id', authMiddleware, lamaranController.getDetailLamaran.bind(lamaranController));

export default router;