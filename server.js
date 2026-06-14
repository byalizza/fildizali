const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const MOVIES_FILE = path.join(__dirname, "movies.json");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(__dirname));

function readMovies() {
    try {
        const data = fs.readFileSync(MOVIES_FILE, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function writeMovies(movies) {
    fs.writeFileSync(MOVIES_FILE, JSON.stringify(movies, null, 2), "utf-8");
}

app.get("/api/movies", (req, res) => {
    const movies = readMovies();
    res.json(movies);
});

app.post("/api/movies", (req, res) => {
    const movies = readMovies();
    const movie = { id: Date.now(), ...req.body, addedAt: new Date().toISOString() };
    movies.push(movie);
    writeMovies(movies);
    res.json({ success: true, movie });
});

app.post("/api/movies/bulk", (req, res) => {
    const movies = readMovies();
    const newMovies = req.body;
    newMovies.forEach(m => { m.id = Date.now() + Math.floor(Math.random() * 10000); m.addedAt = new Date().toISOString(); });
    movies.push(...newMovies);
    writeMovies(movies);
    res.json({ success: true, count: newMovies.length });
});

app.put("/api/movies/:id", (req, res) => {
    const movies = readMovies();
    const idx = movies.findIndex(m => m.id == req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Bulunamadı" });
    movies[idx] = { ...movies[idx], ...req.body, id: movies[idx].id };
    writeMovies(movies);
    res.json({ success: true, movie: movies[idx] });
});

app.delete("/api/movies/:id", (req, res) => {
    let movies = readMovies();
    movies = movies.filter(m => m.id != req.params.id);
    writeMovies(movies);
    res.json({ success: true });
});

app.delete("/api/movies", (req, res) => {
    writeMovies([]);
    res.json({ success: true });
});

app.put("/api/movies", (req, res) => {
    const movies = req.body;
    if (!Array.isArray(movies)) return res.status(400).json({ error: "Dizi olmalı" });
    writeMovies(movies);
    res.json({ success: true, count: movies.length });
});

app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
