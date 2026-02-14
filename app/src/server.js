import express from "express";
import { healthRoute } from "./routes/health.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", healthRoute);

// graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down...");
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
