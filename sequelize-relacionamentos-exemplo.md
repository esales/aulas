## Exemplo - Sequelize e Relacionamentos

Vamos aplicar os três tipos de relacionamento (1:1, 1:N e N:N) no projeto de filmes.

Os relacionamentos **1:N** (Diretor → Filme) e **N:N** (Filme ↔ Artista) já estão implementados no projeto completo: https://github.com/esales/aulas/tree/main/exemplos/filmes

Neste exemplo vamos revisar como eles foram implementados e adicionar o relacionamento **1:1**, entre Filme e FichaTecnica.

### Estrutura do Projeto Atualizada

```txt
projeto/
│
├── app.js
│
└── views/
│   ├── home.handlebars
│   ├── filmes.handlebars
│   ├── cadastrarFilme.handlebars
│   ├── editarFilme.handlebars
│   ├── detalharFilme.handlebars
│   ├── cadastrarFichaTecnica.handlebars   <- novo
│   ├── diretores.handlebars
│   ├── (...)
│   └── artistas.handlebars
│
└── config/
│   └── bd.js
│
└── models/
    ├── filme.model.js
    ├── diretor.model.js
    ├── artista.model.js
    ├── fichaTecnica.model.js              <- novo
    └── relacionamentosModels.js
```

---

### Revisão: relacionamento 1:N (Diretor → Filme)

O model **Diretor**:
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Diretor = sequelize.define(
  'Diretor',
  {
    nome: { type: DataTypes.STRING, allowNull: false },
    anoNascimento: { type: DataTypes.INTEGER },
    nacionalidade: { type: DataTypes.STRING }
  },
  { tableName: 'Diretores', timestamps: true }
);

module.exports = Diretor;
```

---

### Revisão: relacionamento N:N (Filme ↔ Artista)

O model **Artista**:
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Artista = sequelize.define(
  'Artista',
  {
    nome: { type: DataTypes.STRING, allowNull: false },
    anoNascimento: { type: DataTypes.INTEGER },
    emAtividade: { type: DataTypes.BOOLEAN },
    foto: { type: DataTypes.STRING },
    nomeArtistico: { type: DataTypes.STRING }
  },
  { tableName: 'Artistas', timestamps: true }
);

module.exports = Artista;
```

---

### Novo: relacionamento 1:1 (Filme ⟷ FichaTecnica)

Crie o arquivo **models/fichaTecnica.model.js**:

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const FichaTecnica = sequelize.define(
  'FichaTecnica',
  {
    duracaoMinutos: { type: DataTypes.INTEGER },
    orcamento: { type: DataTypes.FLOAT },
    bilheteria: { type: DataTypes.FLOAT }
  },
  { tableName: 'FichasTecnicas', timestamps: true }
);

module.exports = FichaTecnica;
```

---

### Arquivo relacionamentosModels.js completo

```javascript
const sequelize = require('../config/bd');
const Filme = require('./filme.model');
const Diretor = require('./diretor.model');
const Artista = require('./artista.model');
const FichaTecnica = require('./fichaTecnica.model');

// 1:1 - Filme e FichaTecnica
Filme.hasOne(FichaTecnica, { foreignKey: 'filmeId', as: 'fichaTecnica' });
FichaTecnica.belongsTo(Filme, { foreignKey: 'filmeId', as: 'filme' });

// 1:N - Diretor e Filme
Diretor.hasMany(Filme, { foreignKey: 'diretorId', as: 'filmes' });
Filme.belongsTo(Diretor, { foreignKey: 'diretorId', as: 'diretor' });

// N:N - Filme e Artista
Artista.belongsToMany(Filme, { through: 'FilmeArtista', foreignKey: 'artistaId', as: 'filmes' });
Filme.belongsToMany(Artista, { through: 'FilmeArtista', foreignKey: 'filmeId', as: 'artistas' });
```

---

### Adaptando o app.js

Importar o novo model:
```javascript
const FichaTecnica = require('./models/fichaTecnica.model');
```

Rota para exibir o formulário de cadastro da ficha técnica de um filme:
```javascript
app.get('/filmes/:id/ficha-tecnica/cadastrar', async (req, res) => {
  const id = req.params.id;
  const filme = await Filme.findByPk(id, { raw: true });
  res.render('cadastrarFichaTecnica', { filme });
});
```

Rota para salvar a ficha técnica, utilizando o método mágico `createFichaTecnica`, gerado pelo `hasOne`:
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

Atualizando a rota de detalhamento do filme para incluir a ficha técnica:
```javascript
app.get('/filmes/:id', async (req, res) => {
  const id = req.params.id;
  const filme = await Filme.findByPk(id, {
    include: [
      { model: Diretor, as: 'diretor' },
      { model: Artista, as: 'artistas' },
      { model: FichaTecnica, as: 'fichaTecnica' }
    ]
  });
  res.render('detalharFilme', { filme: filme.toJSON() });
});
```

---

### View cadastrarFichaTecnica.handlebars

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

  <button type="submit">
    Salvar
  </button>

</form>
```
{% endraw %}

---

### View detalharFilme.handlebars atualizada

{% raw %}
```handlebars
<label>Ficha Técnica</label>
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

O projeto completo com os relacionamentos 1:N e N:N está em: https://github.com/esales/aulas/tree/main/exemplos/filmes

---
---
⬅️ **[Voltar ao índice](index.md)**
