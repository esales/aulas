## Relacionamento 1:N passo a passo (Diretor - Filme)

---

### Passo 1 - Criar o model Diretor

Crie o arquivo **models/diretor.model.js**:

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Diretor = sequelize.define(
  'Diretor',
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    anoNascimento: {
      type: DataTypes.INTEGER
    },
    nacionalidade: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'Diretores',
    timestamps: true
  }
);

module.exports = Diretor;
```

---

### Passo 2 - Configurar a associação 1:N

No arquivo **models/relacionamentosModels.js**, importe os dois models e defina a associação:

```javascript
const sequelize = require('../config/bd');
const Filme = require('./filme.model');
const Diretor = require('./diretor.model');

Diretor.hasMany(Filme, {
  foreignKey: 'diretorId',
  as: 'filmes'
});

Filme.belongsTo(Diretor, {
  foreignKey: 'diretorId',
  as: 'diretor'
});
```

O `Diretor.hasMany()` diz que um diretor pode ter vários filmes. O `Filme.belongsTo()` diz que cada filme pertence a um único diretor - é a tabela `Filmes` que recebe a coluna `diretorId`.

No **app.js**, garanta que esse arquivo é importado depois dos models e antes do `sequelize.sync()`:

```javascript
require('./models/relacionamentosModels');
```

---

### Passo 3 - CRUD de Diretor: listar e cadastrar

**Rota para listar:**

```javascript
app.get('/diretores', async (req, res) => {
  const diretores = await Diretor.findAll({ raw: true });
  res.render('diretores', { diretores });
});
```

**View diretores.handlebars:**

```handlebars
<h1>Diretores</h1>

<a href="/diretores/cadastrar">Cadastrar novo diretor</a>

<ul>
  {{#each diretores}}
    <li>
      <a href="/diretores/{{this.id}}">{{this.nome}} ({{this.nacionalidade}})</a>
    </li>
  {{/each}}
</ul>
```

**Rota para exibir o formulário de cadastro:**

```javascript
app.get('/diretores/cadastrar', (req, res) => {
  res.render('cadastrarDiretor');
});
```

**View cadastrarDiretor.handlebars:**

```handlebars
<h1>Cadastrar Diretor</h1>

<form action="/diretores" method="POST">

  <div>
    <label>Nome:</label>
    <input type="text" name="nome">
  </div>

  <br>

  <div>
    <label>Ano de nascimento:</label>
    <input type="number" name="anoNascimento">
  </div>

  <br>

  <div>
    <label>Nacionalidade:</label>
    <input type="text" name="nacionalidade">
  </div>

  <br>

  <button type="submit">Salvar</button>

</form>
```

**Rota para salvar:**

```javascript
app.post('/diretores', async (req, res) => {
  const nome = req.body.nome;
  const anoNascimento = req.body.anoNascimento;
  const nacionalidade = req.body.nacionalidade;

  await Diretor.create({
    nome: nome,
    anoNascimento: anoNascimento,
    nacionalidade: nacionalidade
  });

  res.redirect('/diretores');
});
```

---

### Passo 4 - Adaptar o cadastro de Filme para escolher o diretor

**Rota para exibir o formulário de cadastro de filme**, agora buscando também os diretores:

```javascript
app.get('/filmes/cadastrar', async (req, res) => {
  const diretores = await Diretor.findAll({ raw: true });
  res.render('cadastrarFilme', { diretores });
});
```

**View cadastrarFilme.handlebars**, com um `<select>` para o diretor:

```handlebars
<h1>Cadastrar Filme</h1>

<form action="/filmes" method="POST">

  <div>
    <label>Nome:</label>
    <input type="text" name="nome">
  </div>

  <br>

  <div>
    <label>Ano:</label>
    <input type="number" name="ano">
  </div>

  <br>

  <div>
    <label>Diretor:</label>
    <select name="diretorId">
      {{#each diretores}}
        <option value="{{this.id}}">{{this.nome}}</option>
      {{/each}}
    </select>
  </div>

  <br>

  <button type="submit">Salvar</button>

</form>
```

**Rota para salvar o filme**, agora recebendo o `diretorId`:

```javascript
app.post('/filmes', async (req, res) => {
  const nome = req.body.nome;
  const ano = req.body.ano;
  const diretorId = req.body.diretorId;

  await Filme.create({
    nome: nome,
    ano: ano,
    diretorId: diretorId
  });

  res.redirect('/filmes');
});
```

---

### Passo 5 - Exibir o diretor no detalhamento do filme

**Rota de detalhamento**, usando `include` para trazer o diretor junto:

```javascript
app.get('/filmes/:id', async (req, res) => {
  const id = req.params.id;

  const filme = await Filme.findByPk(id, {
    include: [{ model: Diretor, as: 'diretor' }]
  });

  res.render('detalharFilme', { filme: filme.toJSON() });
});
```

**View detalharFilme.handlebars:**

```handlebars
<h1>{{filme.nome}} ({{filme.ano}})</h1>

<label>Diretor:</label>
{{#if filme.diretor}}
  <a href="/diretores/{{filme.diretor.id}}">{{filme.diretor.nome}}</a>
{{/if}}
```

---

### Passo 6 - Exibir os filmes na página do diretor

**Rota de detalhamento do diretor**, usando `include` para trazer a lista de filmes:

```javascript
app.get('/diretores/:id', async (req, res) => {
  const id = req.params.id;

  const diretor = await Diretor.findByPk(id, {
    include: [{ model: Filme, as: 'filmes' }]
  });

  res.render('detalharDiretor', { diretor: diretor.toJSON() });
});
```

**View detalharDiretor.handlebars:**

```handlebars
<h1>{{diretor.nome}}</h1>

<p>Ano de nascimento: {{diretor.anoNascimento}}</p>
<p>Nacionalidade: {{diretor.nacionalidade}}</p>

<label>Filmes dirigidos:</label>
<ul>
  {{#each diretor.filmes}}
    <li><a href="/filmes/{{this.id}}">{{this.nome}} ({{this.ano}})</a></li>
  {{/each}}
</ul>
```

---

### Resultado

Com esses 6 passos, o relacionamento 1:N entre `Diretor` e `Filme` está funcionando:

| Onde | O que acontece |
|---|---|
| Cadastro de Filme | `<select>` escolhe o `diretorId` |
| Detalhamento de Filme | mostra o nome do diretor, com link |
| Detalhamento de Diretor | mostra a lista de filmes dirigidos por ele |

---
---
⬅️ **[Voltar ao índice](index.md)**
