const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const port = 5000;

// Configuração do Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do EJS como engine de views
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// Configuração do diretório de arquivos estáticos
app.use("/public", express.static(path.join(__dirname, "public")));

// Configuração do diretório de views
app.set("views", path.join(__dirname, "/views"));

// Definição do modelo de tarefas
const tarefaSchema = new mongoose.Schema({
  descricao: String,
  dataCriacao: { type: Date, default: Date.now },
});

const TarefaModel = mongoose.model("Tarefa", tarefaSchema);

// Conexão com o MongoDB
mongoose.connect("mongodb://localhost:27017/bancolista", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", async () => {
  console.log("Conexão estabelecida com o MongoDB");
  const tarefas = await TarefaModel.find().maxTimeMS(120000).sort({ dataCriacao: "desc" });
  console.log(`Encontradas ${tarefas.length} tarefas no banco de dados`);
});

// Criação de uma nova tarefa
app.post("/tarefa", async (req, res) => {
  const novaTarefa = new TarefaModel({ descricao: req.body.descricao });
  await novaTarefa.save();
  res.redirect("/");
});

// Listagem de tarefas
app.get("/", async (req, res) => {
  const tarefas = await TarefaModel.find().sort({ dataCriacao: "desc" });
  res.render("index", { tarefasList: tarefas });
});

// Exclusão de tarefa
app.get("/tarefa/:id/excluir", async (req, res) => {
  await TarefaModel.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Servidor Node.js executando na porta ${port}`);
});
