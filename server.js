import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow all origins
app.use(cors());

// 🔹 Download route must come BEFORE static serve
app.get("/download", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send("No URL provided");

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch image");

        const contentType = response.headers.get("content-type") || "image/jpeg";
        const buffer = await response.arrayBuffer();

        res.set({
            "Content-Type": contentType,
            "Content-Disposition": "attachment; filename=image.jpg"
        });

        res.send(Buffer.from(buffer));
    } catch (err) {
        console.error("Download error:", err);
        res.status(500).send("Failed to download image");
    }
});

// Serve frontend
app.use(express.static("public"));

// API proxy route for Google Custom Search
app.get("/search", async (req, res) => {
    const { q, start } = req.query;
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(q)}&cx=${process.env.SEARCH_ENGINE_ID}&searchType=image&key=${process.env.API_KEY}&start=${start}&num=10`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch images" });
    }
});

//app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));