const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database(path.join(__dirname, "xss.db"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// Crear tabla simple
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL
  )`);
});

app.get("/", (req, res) => {
  db.all("SELECT id, content FROM comments ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).send("DB error");
    res.render("index-vulnerable", { comments: rows });
  });
});

app.post("/comment", (req, res) => {
  const { content } = req.body; // Sin sanitizar
  db.run("INSERT INTO comments (content) VALUES (?)", [content], (err) => {
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

app.listen(3000, () => console.log("VULN: http://localhost:3000"));
