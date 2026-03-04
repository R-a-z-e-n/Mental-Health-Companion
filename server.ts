import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3003;

const db = new Database("mental_health.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS moods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT DEFAULT (datetime('now')),
    mood_score INTEGER,
    notes TEXT
  );
  
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    due_date TEXT,
    priority TEXT DEFAULT 'Medium',
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
  
  CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category TEXT,
    content TEXT,
    link TEXT
  );
`);

// Seed resources if empty
const resourceCount = db.prepare("SELECT COUNT(*) as count FROM resources").get() as { count: number };
if (resourceCount.count === 0) {
  const insert = db.prepare("INSERT INTO resources (title, category, content, link) VALUES (?, ?, ?, ?)");
  insert.run("Mindfulness Meditation for Beginners", "Exercise", "A simple 5-minute breathing exercise to ground yourself.", "https://www.mindful.org/meditation/mindfulness-getting-started/");
  insert.run("Understanding Anxiety", "Article", "Learn about the common symptoms and coping mechanisms for anxiety.", "https://www.nimh.nih.gov/health/topics/anxiety-disorders");
  insert.run("National Suicide Prevention Lifeline", "Helpline", "Call or text 988 in the US for 24/7 support.", "tel:988");
  insert.run("Coping with Stress", "Article", "Practical tips for managing daily stress and burnout.", "https://www.cdc.gov/violenceprevention/about/copingwith-stresstips.html");
}

async function startServer() {
  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  app.use(express.json());

  // API Routes
  app.get("/api/resources", (req, res) => {
    const resources = db.prepare("SELECT * FROM resources").all();
    res.json(resources);
  });

  app.get("/api/mood", (req, res) => {
    const moods = db.prepare("SELECT * FROM moods ORDER BY date DESC LIMIT 30").all();
    res.json(moods);
  });

  app.post("/api/mood", (req, res) => {
    const { mood_score, notes } = req.body;
    const info = db.prepare("INSERT INTO moods (mood_score, notes) VALUES (?, ?)").run(mood_score, notes);
    res.json({ id: info.lastInsertRowid, status: "success" });
  });

  // Task API
  app.get("/api/tasks", (req, res) => {
    const tasks = db.prepare("SELECT * FROM tasks ORDER BY completed ASC, created_at DESC").all();
    res.json(tasks);
  });

  app.post("/api/tasks", (req, res) => {
    const { title, due_date, priority } = req.body;
    const info = db.prepare("INSERT INTO tasks (title, due_date, priority) VALUES (?, ?, ?)").run(title, due_date, priority);
    res.json({ id: info.lastInsertRowid, status: "success" });
  });

  app.put("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { title, due_date, priority, completed } = req.body;
    db.prepare("UPDATE tasks SET title = ?, due_date = ?, priority = ?, completed = ? WHERE id = ?")
      .run(title, due_date, priority, completed ? 1 : 0, id);
    res.json({ status: "success" });
  });

  app.delete("/api/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
    res.json({ status: "success" });
  });

  // Placeholder for /chat if the user really wants a backend endpoint, 
  // but we will primarily use frontend for Gemini as per guidelines.
  app.post("/api/chat", (req, res) => {
    res.json({ message: "Chat endpoint is working" });
  });

  app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
