
import "dotenv/config";

import express from "express";
import http from "node:http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";

import reportRoutes from "./routes/reportRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { registerSocket } from "./socket/socketHandler.js";
import logger from "./utils/logger.js";

import matchHandler from "../../api/match.js";
import presenceHandler from "../../api/presence.js";
import reportHandler from "../../api/report.js";
import blockHandler from "../../api/block.js";

// ============================================================
// CONFIG
// ============================================================

const PORT = process.env.PORT || 3000;

const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN ||
  "https://vibemeet-delta.vercel.app";

// ============================================================
// NORMALIZE ORIGIN
// ============================================================

const normalizeOrigin = (value) => {
  if (!value) {
    return "";
  }

  try {
    return new URL(value).origin;
  } catch {
    return value
      .trim()
      .replace(/\/+$/, "");
  }
};

// ============================================================
// ALLOWED CORS ORIGINS
// ============================================================

// CLIENT_ORIGIN can contain multiple comma-separated URLs.
//
// Example:
//
// CLIENT_ORIGIN=https://vibemeet-delta.vercel.app,http://localhost:5173
//
const allowedOrigins = CLIENT_ORIGIN
  .split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

// Always allow these local development origins.
const developmentOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
];

// Combine and remove duplicates.
const allAllowedOrigins = [
  ...new Set([
    ...allowedOrigins,
    ...developmentOrigins,
  ]),
];

console.log(
  "Allowed CORS origins:",
  allAllowedOrigins
);

// ============================================================
// CORS CHECK
// ============================================================

const corsOrigin = (origin, callback) => {
  // Requests without Origin are normally server-to-server,
  // health checks, curl requests, etc.
  if (!origin) {
    return callback(null, true);
  }

  const normalizedOrigin = normalizeOrigin(origin);

  if (allAllowedOrigins.includes(normalizedOrigin)) {
    return callback(null, true);
  }

  console.error(
    `CORS blocked origin: ${normalizedOrigin}`
  );

  return callback(
    new Error(
      `CORS origin not allowed: ${normalizedOrigin}`
    )
  );
};

// ============================================================
// EXPRESS
// ============================================================

const app = express();

// ============================================================
// HTTP SERVER
// ============================================================

const server = http.createServer(app);

// ============================================================
// EXPRESS CORS
// ============================================================

app.use(
  cors({
    origin: corsOrigin,
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
  })
);

// ============================================================
// BODY PARSER
// ============================================================

app.use(
  express.json({
    limit: "256kb",
  })
);

// ============================================================
// HEALTH CHECK
// ============================================================

app.get(
  "/api/healthz",
  (_req, res) => {
    res.json({
      ok: true,
      ts: Date.now(),
    });
  }
);

// ============================================================
// API ROUTES
// ============================================================

app.all(
  "/api/match",
  matchHandler
);

app.all(
  "/api/presence",
  presenceHandler
);

app.all(
  "/api/report",
  reportHandler
);

app.all(
  "/api/block",
  blockHandler
);

// ============================================================
// REPORT ROUTES
// ============================================================

app.use(
  "/api/reports",
  reportRoutes
);

// ============================================================
// ERROR HANDLER
// ============================================================

app.use(errorHandler);

// ============================================================
// SOCKET.IO
// ============================================================

const io = new SocketIOServer(server, {
  cors: {
    origin: corsOrigin,

    credentials: true,

    methods: [
      "GET",
      "POST",
    ],
  },
});

// ============================================================
// REGISTER SOCKET HANDLERS
// ============================================================

registerSocket(io);

// ============================================================
// START SERVER
// ============================================================

server.listen(
  PORT,
  () => {
    logger.info(
      `VibeMeet backend listening on :${PORT}`
    );

    console.log(
      `VibeMeet backend running on port ${PORT}`
    );

    console.log(
      `Allowed frontend origins: ${allAllowedOrigins.join(", ")}`
    );
  }
);
```
