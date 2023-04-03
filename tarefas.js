const mongoose = require('mongoose');

const tarefaSchema = new mongoose.Schema({
  descricao: {
    type: String,
    required: true
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
});

const Tarefa = mongoose.model('Tarefa', tarefaSchema);

module.exports = Tarefa;
