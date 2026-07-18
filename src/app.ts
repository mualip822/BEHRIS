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
// DEBUG REQUEST
// ===================================

app.use((req, _res, next) => {
  console.log(
    "REQUEST:",
    req.method,
    req.originalUrl,
    "ORIGIN:",
    req.headers.origin
  );

  next();
});


// ===================================
// CORS
// ===================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://kariryadin.netlify.app",
];


const corsOptions = {
  origin: function (
    origin: any,
    callback: any
  ) {

    console.log(
      "CORS CHECK ORIGIN:",
      origin
    );


    // allow request tanpa origin
    if (!origin) {
      return callback(null, true);
    }


    if (
      allowedOrigins.includes(origin)
    ) {
      console.log(
        "CORS ALLOWED:",
        origin
      );

      return callback(null, true);
    }


    console.log(
      "CORS BLOCKED:",
      origin
    );

    return callback(null, false);
  },


  credentials: true,


  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],


  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};


app.use(
  cors(corsOptions)
);


// preflight
app.options(
  "*",
  cors(corsOptions)
);


// ===================================
// BODY PARSER
// ===================================

app.use(
  express.json()
);


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
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);


// ===================================
// ROOT
// ===================================

app.get(
  "/",
  (_req, res) => {

    res.json({
      success: true,
      service: "BEHRIS API",
      status: "Running",
      database: "Connected",
      version: "1.0.0",
    });

  }
);


// ===================================
// ROUTES
// ===================================

app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/rekrutmen",
  rekrutmenRoutes
);


app.use(
  "/api/profile",
  profileRoutes
);


app.use(
  "/api/apply",
  applyRoutes
);


app.use(
  "/api/rekrutmen/candidates",
  candidateRoutes
);


app.use(
  "/api/rekrutmen/messages",
  userMessageRoutes
);


app.use(
  "/api/tests",
  testRoutes
);


app.use(
  "/api/candidate",
  candidateTestRoutes
);


// ===================================
// TEST AUTH
// ===================================

app.get(
  "/api/test",
  authMiddleware,
  (req: any, res) => {

    res.json({
      success: true,
      message:
        "Protected route success",
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
  roleMiddleware([
    ROLES.ADMIN
  ]),
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
  roleMiddleware([
    ROLES.REKRUTMEN_ADMIN
  ]),
  (_req, res) => {

    res.json({
      success: true,
      message:
        "Rekrutmen Admin only",
    });

  }
);


// ===================================
// 404
// ===================================

app.use(
  "*",
  (_req, res) => {

    res.status(404).json({
      success: false,
      message:
        "Route tidak ditemukan",
    });

  }
);


export default app;