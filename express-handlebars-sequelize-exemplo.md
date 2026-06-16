## Atualização do Exemplo Completo - Express + Handlebars + Sequelize + SQLite3

Agora, vamos adaptar nosso projeto para utilizar *Sequelize* e *SQLite*.

### Estrutura do Projeto Atualizada

```txt
projeto/
│
├── app.js
│
└── views/
│   │
│   ├── home.handlebars
│   ├── filmes.handlebars
│   └── cadastrarFilme.handlebars
│
└── config/
│   └── bd.js
│
└── models/
    └── filme.model.js
```

Os arquivos **bd.js** e **filme.model.js** já foram criados durante a explicação do conteúdo.

As *views* não precisarão ser alteradas.

Só precisaremos alterar o **app.js**, principalmente as rotas.

---

### Adaptando o arquivo app.js

Nas linhas iniciais iremos reforçar a importação da configuração do BD (já realizada durante o conteúdo), inclusão da importação do model Filme e também retirar o array de filmes (visto que iremos utilizar um BD):

```javascript
const express = require('express');
const exphbs = require('express-handlebars');
const sequelize = require('./config/bd');
const Filme = require('./models/filme.model');

const app = express();


// Middleware para formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Configurando Handlebars
app.engine('handlebars', exphbs.engine({defaultLayout: false}));

app.set('view engine', 'handlebars');
```
---

Agora, vamos alterar cada uma das rotas. Iniciando pela listar filmes.
Utilizamos a configuração `raw: true` para retornar apenas um objeto simples contendo apenas as propriedades de Filme e não um objeto completo contendo também, por exemplo, os métodos para as operações de CRUD (save, destroy, etc...).
```javascript
// Rota GET - Listar filmes
app.get('/filmes', async (req, res) => {
  const filmes = await Filme.findAll({raw: true});

  res.render('filmes', { filmes });
});
```
Rota cadastrar filme:
```javascript
app.post('/filmes', async (req, res) => {

  const nome = req.body.nome;
  const ano = req.body.ano;

  await Filme.create({
    nome: nome, 
    ano: ano
  });

  res.redirect('/filmes');

});
```
---

Por fim, o último trecho:
```javascript
async function conectarBD() {
  try {
    await sequelize.sync();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (erro) {
    console.error('Erro ao conectar:', erro);
  }
}

conectarBD();

// Inicializando servidor
app.listen(3000, () => {

  console.log('Servidor executando em http://localhost:3000');

});
```
---
O arquivo **app.js** fica assim:
```javascript
const express = require('express');
const exphbs = require('express-handlebars');
const sequelize = require('./config/bd');
const Filme = require('./models/filme.model');

const app = express();

// Middleware para formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurando Handlebars
app.engine('handlebars', exphbs.engine({defaultLayout: false}));

app.set('view engine', 'handlebars');

// Rota GET - Página inicial
app.get('/', (req, res) => {

  res.render('home', {
    titulo: 'Página Inicial'
  });

});

// Rota GET - Listar filmes
app.get('/filmes', async (req, res) => {
  const filmes = await Filme.findAll({raw: true});
  res.render('filmes', { filmes });
});

// Rota GET - Formulário de cadastro
app.get(
  '/filmes/cadastrar', 
  (req, res) =>  res.render('cadastrarFilme')
);

// Rota POST - Cadastrar filme
app.post('/filmes', async (req, res) => {

  const nome = req.body.nome;
  const ano = req.body.ano;

  await Filme.create({
    nome: nome, 
    ano: ano
  });

  res.redirect('/filmes');
});

async function conectarBD() {
  try {
    await sequelize.sync();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (erro) {
    console.error('Erro ao conectar:', erro);
  }
}

conectarBD();

// Inicializando servidor
app.listen(3000, () => {

  console.log('Servidor executando em http://localhost:3000');

});
```
---
---
### Implementando o Editar e o Excluir
Para implementar as operações de editar e excluir iremos primeiro falar de uma limitação dos formulários HTML.

Os forms HTML por questões históricas e de compatibilidade só tem suporte para os métodos GET e POST. Então, se tentarmos utilizar algum outro método, como o DELETE, não irá funcionar.

Para resolver, iremos utilizar a biblioteca `method-override`:

```bash
npm install method-override
```
---

O próximo passo é alterar o arquivo **app.js** para carregar e utilizar como middleware a `method-override`:
```javascript
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
```
Depois disso é necessário implementar as rotas.
Uma rota abre a tela de edição:

```javascript
app.get(
  '/filmes/:id/editar', 
  async (req, res) => {
    const id = req.params.id;
    const filme = await Filme.findByPk(id, {raw: true});
    res.render('editarFilme', { filme });
  }
);
```

---

Esta segunda rota é acionada a partir da tela de edição para efetivar a operação:
```javascript
app.put(
  '/filmes/:id', 
  async (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;
    const ano = req.body.ano;
    
    const filme = await Filme.findByPk(id);
    
    filme.nome = nome;
    filme.ano = ano;
    await filme.save();

    res.redirect('/filmes');
  }
);
```
---

Para excluir, temos a rota:
```javascript
app.delete(
  '/filmes/:id', 
  async (req, res) => {
    const id = req.params.id;
    const filme = await Filme.findByPk(id);
    await filme.destroy();
    res.redirect('/filmes');
  }
);
```

---

O arquivo **app.js** deverá ficar assim:
```javascript
const express = require('express');
const exphbs = require('express-handlebars');
const sequelize = require('./config/bd');
const Filme = require('./models/filme.model');
const methodOverride = require('method-override');

const app = express();

app.use(methodOverride('_method'));

// Middleware para formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurando Handlebars
app.engine('handlebars', exphbs.engine({defaultLayout: false}));

app.set('view engine', 'handlebars');

// Rota GET - Página inicial
app.get('/', (req, res) => {

  res.render('home', {
    titulo: 'Página Inicial'
  });

});

// Rota GET - Listar filmes
app.get('/filmes', async (req, res) => {
  const filmes = await Filme.findAll({raw: true});
  res.render('filmes', { filmes });
});

// Rota GET - Formulário de cadastro
app.get(
  '/filmes/cadastrar', 
  (req, res) => res.render('cadastrarFilme')
);

// Rota POST - Cadastrar filme
app.post('/filmes', async (req, res) => {

  const nome = req.body.nome;
  const ano = req.body.ano;

  await Filme.create({
    nome: nome, 
    ano: ano
  });

  res.redirect('/filmes');
});

app.get(
  '/filmes/:id/editar', 
  async (req, res) => {
    const id = req.params.id;
    const filme = await Filme.findByPk(id, {raw: true});
    res.render('editarFilme', { filme });
  }
);

app.put(
  '/filmes/:id', 
  async (req, res) => {
    const id = req.params.id;
    const nome = req.body.nome;
    const ano = req.body.ano;
    
    const filme = await Filme.findByPk(id);
    
    filme.nome = nome;
    filme.ano = ano;
    await filme.save();

    res.redirect('/filmes');
  }
);

app.delete(
  '/filmes/:id', 
  async (req, res) => {
    const id = req.params.id;
    const filme = await Filme.findByPk(id);
    await filme.destroy();
    res.redirect('/filmes');
  }
);


async function conectarBD() {
  try {
    await sequelize.sync();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (erro) {
    console.error('Erro ao conectar:', erro);
  }
}

conectarBD();

// Inicializando servidor
app.listen(3000, () => {

  console.log('Servidor executando em http://localhost:3000');

});
```
---

Deve ser criado a view editarFilme.handlebars. Ela é basicamente a tela de cadastrar porém com os atributos *value* já preenchidos e submete uma requisição do tipo **PUT**:
```handlebars
<h1>Editar Filme</h1>

<form action="/filmes/{{filme.id}}?_method=PUT" method="POST">

  <div>
    <label>Nome do Filme:</label>
    <input type="text" name="nome" value="{{filme.nome}}">
  </div>

  <br>

  <div>
    <label>Ano:</label>
    <input type="number" name="ano" value="{{filme.ano}}">
  </div>

  <br>

  <button type="submit">
    Editar
  </button>

</form>
```

---

No arquivo **filmes.handlebars**, cada filme da lista deve vir acompanhado de 2 botões: editar e excluir. Para isso, utilizaremos a biblioteca de ícones `Font Awesome`.
O "botão" de editar será um elemento `a` realizando uma requisição **GET**.
Já o de excluir terá um `form` com um `button` e submete uma requisição do tipo **DELETE**.
Ambos têm um elemento `i` ligado a uma determinada classe do `Font Awesome`.
```handlebars
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

<h1>Lista de Filmes</h1>

<a href="/filmes/cadastrar">
  Cadastrar Filme
</a>

<hr>

<ul>

  {{#each filmes}}

    <li>
      {{this.nome}} - {{this.ano}} 

      <a href="/filmes/{{this.id}}/editar"><i class="fa-solid fa-pen-to-square"></i></a>
      
      <form action="/filmes/{{this.id}}?_method=DELETE" method="POST" style="display: inline;">
        <button type="submit"><i class="fa-solid fa-trash-can"></i></button>
      </form>
    </li>

  {{/each}}

</ul>
```

O projeto completo está em: https://github.com/esales/aulas/tree/main/exemplos/filmes

---
---
⬅️ **[Voltar ao índice](index.md)**