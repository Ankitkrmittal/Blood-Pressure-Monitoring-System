import "dotenv/config";
import cors from "cors";
import express from "express";

import authRoutes from "./http/routes/auth.routes.js";
import bpRoutes from "./http/routes/bp.routes.js";
import consultationRoutes from "./http/routes/consultation.routes.js";
import requireAuth from "./http/middlewares/requireAuth.js";
import medicationRoutes from "./http/routes/medication.routes.js";
import profileRoutes from "./http/routes/profile.routes.js";
import userRoutes from "./http/routes/users.routes.js";
import "./http/jobs/medicationJob.js";

const PORT = Number(process.env.PORT || 4444);
const app = express();

function getAllowedOrigins() {
  return `${process.env.CORS_ORIGIN || ""}`
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const allowedOrigins = getAllowedOrigins();

app.disable("x-powered-by");
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "backend",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", requireAuth, userRoutes);
app.use("/api/bp", requireAuth, bpRoutes);
app.use("/api/medication", requireAuth, medicationRoutes);
app.use("/api/profile", requireAuth, profileRoutes);
app.use("/api/consultations", requireAuth, consultationRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unhandled backend error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
