import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const STOCK_FILE_PATH = path.join(process.cwd(), "data", "stock.json");

const defaultStock = {
  lite: { inStock: true, totalRamGb: 16, stockCount: 16, lastUpdated: new Date().toISOString() },
  basic: { inStock: true, totalRamGb: 32, stockCount: 32, lastUpdated: new Date().toISOString() },
  prime: { inStock: true, totalRamGb: 16, stockCount: 16, lastUpdated: new Date().toISOString() }
};

function readStockFromFile() {
  try {
    if (!fs.existsSync(STOCK_FILE_PATH)) {
      const dir = path.dirname(STOCK_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(STOCK_FILE_PATH, JSON.stringify(defaultStock, null, 2), "utf-8");
      return defaultStock;
    }
    const data = fs.readFileSync(STOCK_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading stock file, using default:", err);
    return defaultStock;
  }
}

function writeStockToFile(stockData: any) {
  try {
    const dir = path.dirname(STOCK_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STOCK_FILE_PATH, JSON.stringify(stockData, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing stock file:", err);
    return false;
  }
}

async function startServer() {
  const app = express();

  app.use(express.json());

  // API Routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // GET Current Stock for all visitors
  app.get("/api/stock", (req, res) => {
    const stock = readStockFromFile();
    res.json({ success: true, stock });
  });

  // Admin Login Endpoint
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body || {};
    if (username === "admin" && password === "11101321") {
      res.json({
        success: true,
        token: "admin-mavix-auth-session-key",
        message: "Login berhasil!"
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Username atau Password salah!"
      });
    }
  });

  // POST Update Stock (Admin only)
  const handleStockUpdate = (req: express.Request, res: express.Response) => {
    const { stock, token } = req.body || {};
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const resolvedToken = token || bearerToken;
    
    // Check credentials or token
    if (resolvedToken !== "admin-mavix-auth-session-key") {
      return res.status(403).json({ success: false, message: "Akses tidak diizinkan." });
    }

    if (!stock || typeof stock !== "object") {
      return res.status(400).json({ success: false, message: "Format data stok tidak valid." });
    }

    const current = readStockFromFile();
    const updated = {
      lite: {
        inStock: stock.lite?.inStock ?? current.lite?.inStock ?? true,
        totalRamGb: Math.max(0, Number(stock.lite?.totalRamGb ?? stock.lite?.stockCount ?? current.lite?.totalRamGb ?? current.lite?.stockCount ?? 16)),
        stockCount: Math.max(0, Number(stock.lite?.totalRamGb ?? stock.lite?.stockCount ?? current.lite?.totalRamGb ?? current.lite?.stockCount ?? 16)),
        lastUpdated: new Date().toISOString()
      },
      basic: {
        inStock: stock.basic?.inStock ?? current.basic?.inStock ?? true,
        totalRamGb: Math.max(0, Number(stock.basic?.totalRamGb ?? stock.basic?.stockCount ?? current.basic?.totalRamGb ?? current.basic?.stockCount ?? 32)),
        stockCount: Math.max(0, Number(stock.basic?.totalRamGb ?? stock.basic?.stockCount ?? current.basic?.totalRamGb ?? current.basic?.stockCount ?? 32)),
        lastUpdated: new Date().toISOString()
      },
      prime: {
        inStock: stock.prime?.inStock ?? current.prime?.inStock ?? true,
        totalRamGb: Math.max(0, Number(stock.prime?.totalRamGb ?? stock.prime?.stockCount ?? current.prime?.totalRamGb ?? current.prime?.stockCount ?? 16)),
        stockCount: Math.max(0, Number(stock.prime?.totalRamGb ?? stock.prime?.stockCount ?? current.prime?.totalRamGb ?? current.prime?.stockCount ?? 16)),
        lastUpdated: new Date().toISOString()
      }
    };

    const saved = writeStockToFile(updated);
    if (saved) {
      res.json({ success: true, stock: updated });
    } else {
      res.status(500).json({ success: false, message: "Gagal menyimpan stok ke server." });
    }
  };

  app.post("/api/stock", handleStockUpdate);
  app.post("/api/admin/stock", handleStockUpdate);

  // Vite Middleware for Development / Static for Production
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
