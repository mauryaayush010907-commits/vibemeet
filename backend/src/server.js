
// VibeMeet backend entrypoint
// Express + Socket.IO

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


// --------------------------------------------------
// Configuration
// --------------------------------------------------

const PORT = process.env.PORT || 3000;

const normalizeOrigin = (value) => {
  if (!value) return "";

  try {
    return new URL(value).origin;
  } catch {
    return value.replace(/\/+$/, "");
  }
};


// --------------------------------------------------
// Allowed CORS origins
// --------------------------------------------------

const configuredOrigins = (
  process.env.CLIENT_ORIGIN ||
  "https://vibemeet-delta.vercel.app"
)
  .split(",")
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean);


// Always allow local development
const allowedOrigins = [
  ...new Set([
    ...configuredOrigins,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ]),
];


// --------------------------------------------------
// CORS checker
// --------------------------------------------------

const checkCorsOrigin = (origin, callback) => {
  // Requests without an Origin header
  // such as health checks / server-to-server requests
  if (!origin) {
    return callback(null, true);
  }

  const normalizedOrigin = normalizeOrigin(origin);

  if (allowedOrigins.includes(normalizedOrigin)) {
    return callback(null, true);
  }

  logger.error(
    `CORS blocked origin: ${normalizedOrigin}. Allowed origins: ${allowedOrigins.join(", ")}`
  );

  return callback(new Error("CORS origin not allowed"));
};


// --------------------------------------------------
// Express application
// --------------------------------------------------

const app = express();


// --------------------------------------------------
// HTTP server
// --------------------------------------------------

const server = http.createServer(app);


// --------------------------------------------------
// Express CORS
// --------------------------------------------------

app.use(
  cors({
    origin: checkCorsOrigin,
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
      "X-Requested-With",
    ],
  })
);


// --------------------------------------------------
// Body parser
// --------------------------------------------------

app.use(
  express.json({
    limit: "256kb",
  })
);


// --------------------------------------------------
// Health check
// --------------------------------------------------

app.get("/api/healthz", (_req, res) => {
  res.json({
    ok: true,
    ts: Date.now(),
  });
});


// --------------------------------------------------
// API routes
// --------------------------------------------------

app.all("/api/match", matchHandler);

app.all("/api/presence", presenceHandler);

app.all("/api/report", reportHandler);

app.all("/api/block", blockHandler);


// --------------------------------------------------
// Report routes
// --------------------------------------------------

app.use("/api/reports", reportRoutes);


// --------------------------------------------------
// Socket.IO
// --------------------------------------------------

const io = new SocketIOServer(server, {
  cors: {
    origin: checkCorsOrigin,
    credentials: true,

    methods: [
      "GET",
      "POST",
    ],
  },
});


// --------------------------------------------------
// Register Socket.IO handlers
// --------------------------------------------------

registerSocket(io);


// --------------------------------------------------
// Error handler
// --------------------------------------------------

app.use(errorHandler);


// --------------------------------------------------
// Start server
// --------------------------------------------------

server.listen(PORT, () => {
  logger.info(
    `VibeMeet backend listening on port ${PORT}`
  );

  logger.info(
    `Allowed CORS origins: ${allowedOrigins.join(", ")}`
  );
});
