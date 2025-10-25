const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const helmet = require("helmet");
const sanitizeHtml = require("sanitize-html");

const app = express();
const db = new sqlite3.Database(path.join(__dirname, "xss.db"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// Cabeceras seguras + CSP estricta
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"],
      "style-src": ["'self'", "'unsafe-inline'"],
    }
  }
}));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL
  )`);
});

app.get("/", (req, res) => {
  db.all("SELECT id, content FROM comments ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).send("DB error");
    res.render("index-safe", { comments: rows });
  });
});

app.post("/comment", (req, res) => {
  // Limita las tags permitidas
  const cleaned = sanitizeHtml(req.body.content || "", {
    allowedTags: ["b", "i", "em", "strong", "u", "br"],
    allowedAttributes: {}
  });
  db.run("INSERT INTO comments (content) VALUES (?)", [cleaned], (err) => {
    if (err) return res.status(500).send("DB error");
    res.redirect("/");
  });
});

// Solo para reiniciar la demo!
app.get("/reiniciar", (req, res) => {
  db.serialize(() => {
    db.run("DELETE FROM comments", (err) => {
      if (err) return res.status(500).send("DB error al limpiar comments");
      db.run(`DELETE FROM sqlite_sequence WHERE name = 'comments'`, (err2) => {
        if (err2) {
          console.warn("No se pudo resetear sqlite_sequence:", err2.message);
        }
        res.redirect("/");
      });
    });
  });
});

app.listen(3001, () => console.log("SAFE: http://localhost:3001"));
