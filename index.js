const express = require("express");
const crypto = require("crypto");
const app = express();
const PORT = 5000;

app.use(express.json());


const urlDatabase = {};


app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


const DEFAULT_VALIDITY = 24 * 60 * 60 * 1000;


app.post("/shorten", (req, res) => {
    const { url, validity } = req.body;
    if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "Valid 'url' is required." });
    }
    const code = crypto.randomBytes(4).toString("hex");
    const expiresAt = Date.now() + (validity ? Number(validity) : DEFAULT_VALIDITY);
    urlDatabase[code] = { url, expiresAt };
    res.status(201).json({ shortUrl: `http://localhost:${PORT}/${code}`, expiresAt });
});


app.get("/:code", (req, res) => {
    const { code } = req.params;
    const entry = urlDatabase[code];
    if (!entry) {
        return res.status(404).json({ error: "Short URL not found." });
    }
    if (Date.now() > entry.expiresAt) {
        delete urlDatabase[code];
        return res.status(410).json({ error: "Short URL has expired." });
    }
    res.redirect(entry.url);
});

app.get("/", (req, res) => {
    res.send("URL Shortener Service is running!");
});

app.listen(PORT, () => {
    console.log(`URL Shortener running on http://localhost:${PORT}`);
});