## Exemplo Completo - Express + Handlebars

### Instalando as dependências

```bash
npm init -y

npm install express express-handlebars
```

---

### Estrutura do Projeto

```txt
projeto/
│
├── app.js
│
└── views/
    │
    ├── home.handlebars
    ├── filmes.handlebars
    └── cadastrarFilme.handlebars
```

---

### app.js

```javascript
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();


// Middleware para formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Configurando Handlebars
app.engine('handlebars', exphbs.engine({defaultLayout: false}));

app.set('view engine', 'handlebars');


// Banco fake
const filmes = [
  { id: 1, nome: 'Matrix', ano: 1999 },
  { id: 2, nome: 'Interestelar', ano: 2014 }
];


// Rota GET - Página inicial
app.get('/', (req, res) => {

  res.render('home', {
    titulo: 'Página Inicial'
  });

});


// Rota GET - Listar filmes
app.get('/filmes', (req, res) => {

  res.render('filmes', {
    filmes
  });

});


// Rota GET - Formulário de cadastro
app.get(
  '/filmes/cadastrar', 
  (req, res) => res.render('cadastrarFilme')
);


// Rota POST - Cadastrar filme
app.post('/filmes', (req, res) => {

  const nome = req.body.nome;
  const ano = req.body.ano;

  const novoFilme = {
    id: filmes.length + 1,
    nome,
    ano
  };

  filmes.push(novoFilme);

  res.redirect('/filmes');

});

// Inicializando servidor
app.listen(3000, () => {

  console.log('Servidor executando em http://localhost:3000');

});
```

---

### views/home.handlebars
{% raw %}
```handlebars
<h1>{{titulo}}</h1>

<p>Bem-vindo ao sistema de filmes.</p>

<a href="/filmes">
  Ver filmes
</a>
```
{% endraw %}
---

### views/filmes.handlebars
{% raw %}
```handlebars
<h1>Lista de Filmes</h1>

<a href="/filmes/cadastrar">
  Cadastrar Filme
</a>

<hr>

<ul>

  {{#each filmes}}

    <li>
      {{this.nome}} - {{this.ano}}
    </li>

  {{/each}}

</ul>
```
{% endraw %}
---

### views/cadastrarFilme.handlebars

```handlebars
<h1>Cadastrar Filme</h1>

<form action="/filmes" method="POST">

  <div>
    <label>Nome do Filme:</label>
    <input type="text" name="nome">
  </div>

  <br>

  <div>
    <label>Ano:</label>
    <input type="number" name="ano">
  </div>

  <br>

  <button type="submit">
    Cadastrar
  </button>

</form>
```

Execute, no terminal, com:

```bash
node --watch index.js
```

Acesse `http://localhost:3000` no navegador (Chrome, Firefox, Safari, etc) e você verá "Testando o express!".

Se precisar parar a execução da aplicação, vá no terminal e aperte as teclas:

```bash
Control (ctrl) + c
```

---
---

⬅️ **[Voltar ao índice](index.md)**