## Relacionamento N:N passo a passo (Filme - Artista)


### Passo 1 - Criar o model Artista

Crie o arquivo **models/artista.model.js**:

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Artista = sequelize.define(
  'Artista',
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    anoNascimento: {
      type: DataTypes.INTEGER
    },
    nomeArtistico: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'Artistas',
    timestamps: true
  }
);

module.exports = Artista;
```

---

### Passo 2 - Configurar a associação N:N

No arquivo **models/relacionamentosModels.js**, importe os dois models e defina a associação nos dois sentidos, usando `through` para indicar a tabela intermediária:

```javascript
const sequelize = require('../config/bd');
const Filme = require('./filme.model');
const Artista = require('./artista.model');

Filme.belongsToMany(Artista, {
  through: 'FilmeArtista',
  foreignKey: 'filmeId',
  as: 'artistas'
});

Artista.belongsToMany(Filme, {
  through: 'FilmeArtista',
  foreignKey: 'artistaId',
  as: 'filmes'
});
```

O Sequelize cria e gerencia a tabela `FilmeArtista` automaticamente - não é necessário criar um model para ela.

No **app.js**, garanta que esse arquivo é importado depois dos models e antes do `sequelize.sync()`:

```javascript
require('./models/relacionamentosModels');
```

---

### Passo 3 - CRUD de Artista: listar e cadastrar

**Rota para listar:**

```javascript
app.get('/artistas', async (req, res) => {
  const artistas = await Artista.findAll({ raw: true });
  res.render('artistas', { artistas });
});
```

**View artistas.handlebars:**

{% raw %}
```handlebars
<h1>Artistas</h1>

<a href="/artistas/cadastrar">Cadastrar novo artista</a>

<ul>
  {{#each artistas}}
    <li>
      <a href="/artistas/{{this.id}}">{{this.nome}}</a>
    </li>
  {{/each}}
</ul>
```
{% endraw %}

**Rota para exibir o formulário de cadastro:**

```javascript
app.get('/artistas/cadastrar', (req, res) => {
  res.render('cadastrarArtista');
});
```

**View cadastrarArtista.handlebars:**

{% raw %}
```handlebars
<h1>Cadastrar Artista</h1>

<form action="/artistas" method="POST">

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
    <label>Nome artístico:</label>
    <input type="text" name="nomeArtistico">
  </div>

  <br>

  <button type="submit">Salvar</button>

</form>
```
{% endraw %}

**Rota para salvar:**

```javascript
app.post('/artistas', async (req, res) => {
  const nome = req.body.nome;
  const anoNascimento = req.body.anoNascimento;
  const nomeArtistico = req.body.nomeArtistico;

  await Artista.create({
    nome: nome,
    anoNascimento: anoNascimento,
    nomeArtistico: nomeArtistico
  });

  res.redirect('/artistas');
});
```

---

### Passo 4 - Adaptar o cadastro de Filme para escolher os artistas

**Rota para exibir o formulário de cadastro de filme**, agora buscando também os artistas:

```javascript
app.get('/filmes/cadastrar', async (req, res) => {
  const artistas = await Artista.findAll({ raw: true });
  res.render('cadastrarFilme', { artistas });
});
```

**View cadastrarFilme.handlebars**, com um `<select multiple>` para os artistas:

{% raw %}
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
    <label>Artistas:</label>
    <select name="artistas" multiple>
      {{#each artistas}}
        <option value="{{this.id}}">{{this.nome}}</option>
      {{/each}}
    </select>
  </div>

  <br>

  <button type="submit">Salvar</button>

</form>
```
{% endraw %}

**Rota para salvar o filme**, agora associando os artistas escolhidos com o método `setArtistas()`, gerado pelo `belongsToMany`:

```javascript
app.post('/filmes', async (req, res) => {
  const nome = req.body.nome;
  const ano = req.body.ano;
  const artistas = req.body.artistas; // array com os ids selecionados

  const filme = await Filme.create({
    nome: nome,
    ano: ano
  });

  await filme.setArtistas(artistas);

  res.redirect('/filmes');
});
```

> Observação: como o campo `artistas` é um `<select multiple>`, o Express entrega os valores selecionados como um **array** de ids. O `setArtistas()` aceita esse array diretamente e cria os registros correspondentes na tabela `FilmeArtista`.

---

### Passo 5 - Exibir os artistas no detalhamento do filme

**Rota de detalhamento**, usando `include` para trazer os artistas junto:

```javascript
app.get('/filmes/:id', async (req, res) => {
  const id = req.params.id;

  const filme = await Filme.findByPk(id, {
    include: [{ model: Artista, as: 'artistas' }]
  });

  res.render('detalharFilme', { filme: filme.toJSON() });
});
```

**View detalharFilme.handlebars:**

{% raw %}
```handlebars
<h1>{{filme.nome}} ({{filme.ano}})</h1>

<label>Elenco:</label>
<ul>
  {{#each filme.artistas}}
    <li><a href="/artistas/{{this.id}}">{{this.nome}}</a></li>
  {{/each}}
</ul>
```
{% endraw %}

---

### Passo 6 - Exibir os filmes na página do artista

**Rota de detalhamento do artista**, usando `include` para trazer a lista de filmes:

```javascript
app.get('/artistas/:id', async (req, res) => {
  const id = req.params.id;

  const artista = await Artista.findByPk(id, {
    include: [{ model: Filme, as: 'filmes' }]
  });

  res.render('detalharArtista', { artista: artista.toJSON() });
});
```

**View detalharArtista.handlebars:**

{% raw %}
```handlebars
<h1>{{artista.nome}}</h1>

<p>Nome artístico: {{artista.nomeArtistico}}</p>
<p>Ano de nascimento: {{artista.anoNascimento}}</p>

<label>Filmes:</label>
<ul>
  {{#each artista.filmes}}
    <li><a href="/filmes/{{this.id}}">{{this.nome}} ({{this.ano}})</a></li>
  {{/each}}
</ul>
```
{% endraw %}

---

### Resultado

Com esses 6 passos, o relacionamento N:N entre `Filme` e `Artista` está funcionando:

| Onde | O que acontece |
|---|---|
| Cadastro de Filme | `<select multiple>` escolhe os `artistas`, salvos via `setArtistas()` |
| Detalhamento de Filme | mostra a lista de artistas do elenco, com link |
| Detalhamento de Artista | mostra a lista de filmes em que ele participou |

---
---
⬅️ **[Voltar ao índice](index.md)**
