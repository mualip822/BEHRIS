import { Router } from "express";

import { LowonganController } from "../controllers/lowongan.controller";
import { MasterDataController } from "../controllers/masterData.controller";

import { authMiddleware } from "../../../core/middlewares/auth.middleware";
import { roleMiddleware } from "../../../core/middlewares/role.middleware";

import testRoutes from "../test/routes/test.routes";
import candidateRoutes from "./candidate.routes";
import userMessageRoutes from "./userMessage.routes";

const router = Router();

const controller = new LowonganController();


// =====================================================
// TEST ROUTE
// =====================================================

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Route rekrutmen aktif 🔥",
  });
});


// =====================================================
// TEST MODULE
// =====================================================

router.use("/tests", testRoutes);


// =====================================================
// MESSAGE ROUTES
// HARUS DI ATAS "/:id"
// =====================================================

router.use("/messages", userMessageRoutes);


// =====================================================
// CANDIDATE ROUTES
// =====================================================

router.use("/candidates", candidateRoutes);


// =====================================================
// CATEGORY ROUTES
// =====================================================

router.get("/categories", MasterDataController.getCategories);

router.get(
  "/categories/:id",
  MasterDataController.getCategoryById
);

router.post(
  "/categories",
  authMiddleware,
  roleMiddleware(["rekrutmen_admin"]),
  MasterDataController.createCategory
);

router.put(
  "/categories/:id",
  authMiddleware,
  roleMiddleware(["rekrutmen_admin"]),
  MasterDataController.updateCategory
);

router.delete(
  "/categories/:id",
  authMiddleware,
  roleMiddleware(["rekrutmen_admin"]),
  MasterDataController.deleteCategory
);


// =====================================================
// JOB TYPES ROUTES
// =====================================================

router.get("/job-types", MasterDataController.getJobTypes);

router.get(
  "/job-types/:id",
  MasterDataController.getJobTypeById
);

router.post(
  "/job-types",
  authMiddleware,
  roleMiddleware(["rekrutmen_admin"]),
  MasterDataController.createJobType
);

router.put(
  "/job-types/:id",
  authMiddleware,
  roleMiddleware(["rekrutmen_admin"]),
  MasterDataController.updateJobType
);

router.delete(
  "/job-types/:id",
  authMiddleware,
  roleMiddleware(["rekrutmen_admin"]),
  MasterDataController.deleteJobType
);


// =====================================================
// LOWONGAN PUBLIC ROUTES
// =====================================================

router.get("/", controller.getAll.bind(controller));

router.get(
  "/:id",
  controller.getById.bind(controller)
);


// =====================================================
// ADMIN LOWONGAN ROUTES
// =====================================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["rekrutmen_admin"]),
  controller.create.bind(controller)
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["rekrutmen_admin"]),
  controller.update.bind(controller)
);

router.patch(
  "/:id/toggle-active",
  authMiddleware,
  roleMiddleware(["rekrutmen_admin"]),
  controller.toggleActive.bind(controller)
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["rekrutmen_admin"]),
  controller.delete.bind(controller)
);

export default router;