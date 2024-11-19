const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();
const PORT = 3000;

// Configurações de middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/node_crud_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
db.once('open', () => {
  console.log('Conectado ao MongoDB');
});

// Definição do esquema do Mongoose
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

// Rota principal para listar os itens
app.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.render('index', { items });
  } catch (error) {
    res.status(500).send('Erro ao buscar itens');
  }
});

// Rota para criar um novo item
app.post('/items', async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.redirect('/');
  } catch (error) {
    res.status(400).send('Erro ao criar item');
  }
});

// Rota para editar um item (exibe o formulário de edição)
app.get('/items/:id/edit', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    res.render('edit', { item });
  } catch (error) {
    res.status(404).send('Item não encontrado');
  }
});

// Rota para atualizar um item
app.put('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/');
  } catch (error) {
    res.status(400).send('Erro ao atualizar item');
  }
});

// Rota para deletar um item
app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Erro ao deletar item');
  }
});

// Inicializar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
