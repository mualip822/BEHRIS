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

// ===================================
// CORS
// ===================================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL || "",
    ],
    credentials: true,
  })
);

// ===================================
// BODY PARSER
// ===================================
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ===================================
// STATIC FILE
// ===================================
app.use(
  "/uploads",
  express.static(
    path.join(process.cwd(), "uploads")
  )
);

// ===================================
// ROOT
// ===================================
app.get("/", (_req, res) => {
  res.json({
    success: true,
    service: "BEHRIS API",
    status: "Running",
    database: "Connected",
    version: "1.0.0",
  });
});

// ===================================
// AUTH
// ===================================
app.use("/api/auth", authRoutes);

// ===================================
// REKRUTMEN
// ===================================
app.use("/api/rekrutmen", rekrutmenRoutes);

// ===================================
// PROFILE
// ===================================
app.use("/api/profile", profileRoutes);

// ===================================
// APPLY
// ===================================
app.use("/api/apply", applyRoutes);

// ===================================
// CANDIDATE
// ===================================
app.use(
  "/api/rekrutmen/candidates",
  candidateRoutes
);

// ===================================
// MESSAGE
// ===================================
app.use(
  "/api/rekrutmen/messages",
  userMessageRoutes
);

// ===================================
// TEST ADMIN
// ===================================
app.use("/api/tests", testRoutes);

// ===================================
// CANDIDATE TEST
// ===================================
app.use("/api/candidate", candidateTestRoutes);

// ===================================
// TEST AUTH
// ===================================
app.get(
  "/api/test",
  authMiddleware,
  (req: any, res) => {
    res.json({
      success: true,
      message: "Protected route success",
      user: req.user,
    });
  }
);

// ===================================
// ADMIN
// ===================================
app.get(
  "/api/admin",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN]),
  (_req, res) => {
    res.json({
      success: true,
      message: "Admin only",
    });
  }
);

// ===================================
// HR
// ===================================
app.get(
  "/api/hr",
  authMiddleware,
  roleMiddleware([ROLES.REKRUTMEN_ADMIN]),
  (_req, res) => {
    res.json({
      success: true,
      message: "Rekrutmen Admin only",
    });
  }
);

// ===================================
// 404
// ===================================
app.use("*", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route tidak ditemukan",
  });
});

export default app;