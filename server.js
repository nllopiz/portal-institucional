import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API API endpoints to read/write JSON files
  app.get("/api/data/:file", async (req, res) => {
    try {
      const fileName = req.params.file;
      // Safety check to prevent directory traversal
      if (!["procedures", "faq", "siteConfig", "services"].includes(fileName)) {
        return res.status(400).json({ error: "Invalid file name" });
      }
      const filePath = path.join(process.cwd(), "public", "data", `${fileName}.json`);
      const data = await fs.readFile(filePath, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  app.post("/api/data/:file", async (req, res) => {
    try {
      const fileName = req.params.file;
      if (!["procedures", "faq", "siteConfig", "services"].includes(fileName)) {
        return res.status(400).json({ error: "Invalid file name" });
      }
      const filePath = path.join(process.cwd(), "public", "data", `${fileName}.json`);
      await fs.writeFile(filePath, JSON.stringify(req.body, null, 2), "utf-8");
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
