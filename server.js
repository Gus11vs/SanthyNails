const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Criar / conectar banco
const db = new sqlite3.Database("./banco.db", (err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err.message);
  } else {
    console.log("Banco conectado com sucesso!");
  }
});

// Criar tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    nota INTEGER NOT NULL,
    comentario TEXT NOT NULL,
    dataEnvio DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// =======================
// ROTA POST
// =======================
app.post("/feedbacks", (req, res) => {
  const { nome, nota, comentario } = req.body;

  if (!nome || !nota || !comentario) {
    return res.status(400).json({ erro: "Campos obrigatórios faltando" });
  }

  const sql = `INSERT INTO feedbacks (nome, nota, comentario) VALUES (?, ?, ?)`;

  db.run(sql, [nome, nota, comentario], function(err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      nome,
      nota,
      comentario
    });
  });
});

// =======================
// ROTA GET
// =======================
app.get("/feedbacks", (req, res) => {
  const sql = `SELECT * FROM feedbacks ORDER BY dataEnvio DESC`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    res.json(rows);
  });
});

// Buscar todas as alunas
app.get("/alunas", (req, res) => {
    db.all("SELECT * FROM alunas", [], (err, rows) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(rows);
    });
});

// Deletar aluna
app.delete("/alunas/:id", (req, res) => {
    db.run("DELETE FROM alunas WHERE id = ?", [req.params.id], function(err) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: "Aluna deletada com sucesso" });
    });
});

app.delete("/feedbacks/:id", (req, res) => {
  db.run("DELETE FROM feedbacks WHERE id = ?", [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    res.json({ message: "Feedback deletado com sucesso" });
  });
});

// =======================
// LOGIN ADMIN
// =======================

// Defina aqui seu usuário e senha de administrador
const ADMIN_USER = "GusAdmin";
const ADMIN_PASS = "110822"; // Recomendo mudar para uma senha mais forte depois!

app.post("/login", (req, res) => {
  // Agora recebemos 'usuario' e 'senha' do frontend
  const { usuario, senha } = req.body;

  // Verifica se AMBOS batem com as credenciais
  if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
    res.json({ sucesso: true });
  } else {
    // Retorna falso se qualquer um dos dois estiver errado
    res.json({ sucesso: false, mensagem: "Usuário ou senha incorretos." });
  }
});

// =======================
// INICIAR SERVIDOR
// =======================
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
