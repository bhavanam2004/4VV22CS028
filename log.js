const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Simple user store (for demo)
const users = { user1: "password123" };

// Login endpoint
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        return res.json({ message: "Login successful" });
    }
    res.status(401).json({ error: "Invalid credentials" });
});
// ...existing code...

app.get("/", (req, res) => {
    res.send("Login service is running!");
});

// ...existing code...

app.listen(PORT, () => {
    console.log(`Login service running on http://localhost:${PORT}`);
});