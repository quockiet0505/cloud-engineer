import express from "express";
import { healthRoute } from "./routes/health.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", healthRoute);

app.get("/status", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cloud Engineer Status</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body class="bg-dark text-white">
        <div class="container text-center mt-5">
          <h1 class="display-4"> Cloud Engineer App</h1>
          <div class="card bg-secondary text-white shadow mt-4">
            <div class="card-body">
              <h2>Service Status</h2>
              <span class="badge bg-success fs-5">Running</span>
              <p class="mt-3">Updated at:</p>
              <code>${new Date().toISOString()}</code>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
});

// graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down...");
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});