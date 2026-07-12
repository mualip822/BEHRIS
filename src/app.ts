import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./modules/auth/routes/auth.routes";
import rekrutmenRoutes from "./modules/rekrutmen/routes/rekrutmen.routes";
import profileRoutes from "./modules/profile/routes/profile.routes";
import applyRoutes from "./modules/rekrutmen/routes/apply.routes";

import testRoutes from "./modules/rekrutmen/test/routes/test.routes";
import candidateTestRoutes from "./modules/rekrutmen/test/routes/candidate.routes";

import { authMiddleware } from "./core/middlewares/auth.middleware";
import { roleMiddleware } from "./core/middlewares/role.middleware";

import candidateRoutes from "./modules/rekrutmen/routes/candidate.routes";
import userMessageRoutes from "./modules/rekrutmen/routes/userMessage.routes";

import { ROLES } from "./core/constants/roles";

const app = express();

// ===============================
// GLOBAL MIDDLEWARE
// ===============================
app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ===============================
// STATIC FILES
// ===============================
app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);

// ===============================
// ROUTES
// ===============================

// AUTH
app.use(
  "/api/auth",
  authRoutes
);

// REKRUTMEN
app.use(
  "/api/rekrutmen",
  rekrutmenRoutes
);

// PROFILE
app.use(
  "/api/profile",
  profileRoutes
);

// APPLY
app.use(
  "/api/apply",
  applyRoutes
);

// CANDIDATE REKRUTMEN
app.use(
  "/api/rekrutmen/candidates",
  candidateRoutes
);

// USER MESSAGE
app.use(
  "/api/rekrutmen/messages",
  userMessageRoutes
);

// TEST ADMIN
app.use(
  "/api/tests",
  testRoutes
);

// ===============================
// CANDIDATE TEST
// ===============================
app.use(
  "/api/candidate",
  candidateTestRoutes
);

// ===============================
// TEST AUTH
// ===============================
app.get(
  "/api/test",
  authMiddleware,
  (req: any, res) => {
    res.json({
      success: true,
      message: "Protected route success 🔥",
      user: req.user,
    });
  }
);

// ===============================
// ADMIN ONLY
// ===============================
app.get(
  "/api/admin",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN]),
  (_req, res) => {
    res.json({
      success: true,
      message: "Admin only 🔥",
    });
  }
);

// ===============================
// REKRUTMEN ADMIN ONLY
// ===============================
app.get(
  "/api/hr",
  authMiddleware,
  roleMiddleware([ROLES.REKRUTMEN_ADMIN]),
  (_req, res) => {
    res.json({
      success: true,
      message: "Rekrutmen Admin only 🔥",
    });
  }
);

// ===============================
// NOT FOUND HANDLER
// ===============================
app.use("*", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route tidak ditemukan",
  });
});

export default app;