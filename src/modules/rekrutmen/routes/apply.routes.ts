import { Router } from "express";

import { authMiddleware } from "../../../core/middlewares/auth.middleware";

import { uploadApply } from "../config/multer";

import { validateApply } from "../validations/apply.validation";

import { ApplyController } from "../controllers/apply.controller";

const router = Router();

// =====================================
// CREATE APPLY
// =====================================

router.post(
  "/",

  authMiddleware,

  uploadApply.fields([
    {
      name: "cv",
      maxCount: 1,
    },
    {
      name: "ijazah",
      maxCount: 1,
    },
    {
      name: "transkrip",
      maxCount: 1,
    },
    {
      name: "pendukung",
      maxCount: 1,
    },
  ]),

  validateApply,

  ApplyController.create
);

// =====================================
// MY APPLICATIONS
// =====================================

router.get(
  "/my-applications",

  authMiddleware,

  ApplyController.myApplications
);

// =====================================
// DETAIL APPLICATION
// =====================================

router.get(
  "/:id",

  authMiddleware,

  ApplyController.detail
);

export default router;