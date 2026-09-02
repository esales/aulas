## Relacionamento 1:1 passo a passo (Filme - FichaTecnica)

---

### Passo 1 - Criar o model FichaTecnica

Crie o arquivo **models/fichaTecnica.model.js**:

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const FichaTecnica = sequelize.define(
  'FichaTecnica',
  {
    duracaoMinutos: {
      type: DataTypes.INTEGER
    },
    orcamento: {
      type: DataTypes.FLOAT
    },
    bilheteria: {
      type: DataTypes.FLOAT
    }
  },
  {
    tableName: 'FichasTecnicas',
    timestamps: true
  }
);

module.exports = FichaTecnica;
```

---

### Passo 2 - Configurar a associação 1:1

No arquivo **models/relacionamentosModels.js**, importe os dois models e defina a associação:

```javascript
const sequelize = require('../config/bd');
const Filme = require('./filme.model');
const FichaTecnica = require('./fichaTecnica.model');

Filme.hasOne(FichaTecnica, {
  foreignKey: 'filmeId',
  as: 'fichaTecnica'
});

FichaTecnica.belongsTo(Filme, {
  foreignKey: 'filmeId',
  as: 'filme'
});
```

O `Filme.hasOne()` diz que um filme possui uma única ficha técnica. O `FichaTecnica.belongsTo()` diz que a ficha técnica pertence a um filme - é a tabela `FichasTecnicas` que recebe a coluna `filmeId`.

No **app.js**, garanta que esse arquivo é importado depois dos models e antes do `sequelize.sync()`:

```javascript
require('./models/relacionamentosModels');
```

---

### Passo 3 - Rota para exibir o formulário de cadastro

Diferente de `Diretor` e `Artista`, a `FichaTecnica` não tem uma listagem própria - ela sempre parte de um filme específico. Por isso, a rota recebe o `id` do filme:

```javascript
app.get('/filmes/:id/ficha-tecnica/cadastrar', async (req, res) => {
  const id = req.params.id;

  const filme = await Filme.findByPk(id, { raw: true });

  res.render('cadastrarFichaTecnica', { filme });
});
```

---

### Passo 4 - View cadastrarFichaTecnica.handlebars

{% raw %}
```handlebars
<h1>Ficha Técnica - {{filme.nome}}</h1>

<form action="/filmes/{{filme.id}}/ficha-tecnica" method="POST">

  <div>
    <label>Duração (minutos):</label>
    <input type="number" name="duracaoMinutos">
  </div>

  <br>

  <div>
    <label>Orçamento:</label>
    <input type="number" step="0.01" name="orcamento">
  </div>

  <br>

  <div>
    <label>Bilheteria:</label>
    <input type="number" step="0.01" name="bilheteria">
  </div>

  <br>

  <button type="submit">Salvar</button>

</form>
```
{% endraw %}

---

### Passo 5 - Rota para salvar a ficha técnica

Aqui usamos o método mágico `createFichaTecnica()`, gerado pela associação `hasOne`:

```javascript
app.post('/filmes/:id/ficha-tecnica', async (req, res) => {
  const id = req.params.id;
  const duracaoMinutos = req.body.duracaoMinutos;
  const orcamento = req.body.orcamento;
  const bilheteria = req.body.bilheteria;

  const filme = await Filme.findByPk(id);

  await filme.createFichaTecnica({
    duracaoMinutos: duracaoMinutos,
    orcamento: orcamento,
    bilheteria: bilheteria
  });

  res.redirect(`/filmes/${id}`);
});
```

O `createFichaTecnica()` já cria o registro na tabela `FichasTecnicas` preenchendo automaticamente o `filmeId` - não é necessário informá-lo manualmente.

---

### Passo 6 - Exibir a ficha técnica no detalhamento do filme

**Rota de detalhamento**, usando `include` para trazer a ficha técnica junto:

```javascript
app.get('/filmes/:id', async (req, res) => {
  const id = req.params.id;

  const filme = await Filme.findByPk(id, {
    include: [{ model: FichaTecnica, as: 'fichaTecnica' }]
  });

  res.render('detalharFilme', { filme: filme.toJSON() });
});
```

**View detalharFilme.handlebars:**

{% raw %}
```handlebars
<h1>{{filme.nome}} ({{filme.ano}})</h1>

<label>Ficha Técnica:</label>
{{#if filme.fichaTecnica}}
  <ul>
    <li>Duração: {{filme.fichaTecnica.duracaoMinutos}} minutos</li>
    <li>Orçamento: {{filme.fichaTecnica.orcamento}}</li>
    <li>Bilheteria: {{filme.fichaTecnica.bilheteria}}</li>
  </ul>
{{else}}
  <a href="/filmes/{{filme.id}}/ficha-tecnica/cadastrar">Cadastrar ficha técnica</a>
{{/if}}
```
{% endraw %}

---

### Resultado

Com esses 6 passos, o relacionamento 1:1 entre `Filme` e `FichaTecnica` está funcionando de ponta a ponta:

| Onde | O que acontece |
|---|---|
| Detalhamento de Filme (sem ficha técnica) | mostra um link para cadastrar |
| Cadastro de Ficha Técnica | formulário próprio, vinculado ao filme via `createFichaTecnica()` |
| Detalhamento de Filme (com ficha técnica) | mostra duração, orçamento e bilheteria |

---
---
⬅️ **[Voltar ao índice](index.md)**
