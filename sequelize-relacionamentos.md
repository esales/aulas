## Sequelize - Relacionamentos

### Por que relacionar tabelas?

Até agora, cada model (`Filme`, por exemplo) funcionava de forma isolada. Mas, no mundo real, os dados costumam estar conectados: um filme tem um diretor, um diretor pode ter vários filmes, um filme pode ter vários artistas no elenco...

Relacionar tabelas evita duplicação de dados e permite representar essas conexões no banco de dados.

---

### Tipos de relacionamento

| Tipo | Exemplo | Descrição |
|---|---|---|
| **1:1** (um para um) | Filme ⟷ FichaTecnica | Cada filme tem exatamente uma ficha técnica, e cada ficha técnica pertence a exatamente um filme |
| **1:N** (um para muitos) | Diretor → Filme | Um diretor pode dirigir vários filmes, mas cada filme tem um único diretor |
| **N:N** (muitos para muitos) | Filme ⟷ Artista | Um filme tem vários artistas no elenco, e um artista pode participar de vários filmes |

---

### As associações do Sequelize

O Sequelize representa esses relacionamentos através de 4 métodos:

| Método | Relacionamento | Quem guarda a chave estrangeira (FK) |
|---|---|---|
| `hasOne` | 1:1 | O outro model |
| `belongsTo` | 1:1 ou 1:N | O próprio model |
| `hasMany` | 1:N | O outro model |
| `belongsToMany` | N:N | Uma tabela intermediária (`through`) |


---

### Relacionamento 1:1 — Filme e FichaTecnica

Vamos imaginar que cada filme tenha uma ficha técnica, com duração, orçamento e bilheteria.

#### Model FichaTecnica

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const FichaTecnica = sequelize.define(
  'FichaTecnica',
  {
    duracaoMinutos: {
      type: DataTypes.INTEGER,
    },
    orcamento: {
      type: DataTypes.FLOAT,
    },
    bilheteria: {
      type: DataTypes.FLOAT,
    }
  },
  {
    tableName: 'FichasTecnicas',
    timestamps: true
  }
);

module.exports = FichaTecnica;
```

#### Configurando a associação

```javascript
Filme.hasOne(FichaTecnica, {
  foreignKey: 'filmeId',
  as: 'fichaTecnica'
});

FichaTecnica.belongsTo(Filme, {
  foreignKey: 'filmeId',
  as: 'filme'
});
```

O `Filme.hasOne()` indica que um filme possui uma ficha técnica. Já o `FichaTecnica.belongsTo()` indica que a ficha técnica pertence a um filme — e é a tabela `FichasTecnicas` que vai guardar a coluna `filmeId`.

---

### Relacionamento 1:N — Diretor e Filme

Um diretor pode dirigir vários filmes.

```javascript
Diretor.hasMany(Filme, {
  foreignKey: 'diretorId',
  as: 'filmes'
});

Filme.belongsTo(Diretor, {
  foreignKey: 'diretorId',
  as: 'diretor'
});
```

O `Diretor.hasMany()` indica que um diretor tem vários filmes. Já o `Filme.belongsTo()` indica que cada filme pertence a um único diretor — e é a tabela `Filmes` que vai guardar a coluna `diretorId`.

---

### Relacionamento N:N — Filme e Artista

Um filme pode ter vários artistas, e um artista pode participar de vários filmes. Nesse caso, nenhuma das duas tabelas consegue guardar a informação sozinha — é necessária uma **tabela intermediária** (tabela associativa), que guarda os pares `filmeId` e `artistaId`.

```javascript
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

O parâmetro `through` define o nome da tabela intermediária. O Sequelize cria e gerencia essa tabela automaticamente — não é necessário criar um model para ela.

---

### Organizando as associações em um arquivo separado

É uma boa prática manter todas as associações em um único arquivo, por exemplo `relacionamentosModels.js`, ao invés de espalhar `hasMany`/`belongsTo` dentro de cada model. Isso facilita encontrar e entender como as tabelas se conectam.

```javascript
const sequelize = require('../config/bd');
const Filme = require('./filme.model');
const Diretor = require('./diretor.model');
const Artista = require('./artista.model');
const FichaTecnica = require('./fichaTecnica.model');

// 1:1
Filme.hasOne(FichaTecnica, { foreignKey: 'filmeId', as: 'fichaTecnica' });
FichaTecnica.belongsTo(Filme, { foreignKey: 'filmeId', as: 'filme' });

// 1:N
Diretor.hasMany(Filme, { foreignKey: 'diretorId', as: 'filmes' });
Filme.belongsTo(Diretor, { foreignKey: 'diretorId', as: 'diretor' });

// N:N
Filme.belongsToMany(Artista, { through: 'FilmeArtista', foreignKey: 'filmeId', as: 'artistas' });
Artista.belongsToMany(Filme, { through: 'FilmeArtista', foreignKey: 'artistaId', as: 'filmes' });
```

Esse arquivo deve ser importado no **app.js**, depois de todos os models, para que as associações sejam registradas antes do `sequelize.sync()`:

```javascript
require('./models/relacionamentosModels');
```

---

### Buscando dados relacionados: include

Por padrão, quando buscamos um registro, o Sequelize **não** traz os dados relacionados. Para isso, usamos a opção `include`.

```javascript
const filme = await Filme.findByPk(1, {
  include: [
    { model: Diretor, as: 'diretor' },
    { model: Artista, as: 'artistas' },
    { model: FichaTecnica, as: 'fichaTecnica' }
  ]
});

console.log(filme.diretor.nome);
console.log(filme.artistas.length);
console.log(filme.fichaTecnica.duracaoMinutos);
```

Repare que o `as` usado no `include` precisa ser exatamente o mesmo definido na associação.

---

### Métodos mágicos gerados pelas associações

Ao configurar uma associação, o Sequelize cria automaticamente métodos para facilitar a manipulação dos dados relacionados:

| Associação | Métodos gerados (exemplo com alias `fichaTecnica` / `artistas`) |
|---|---|
| `hasOne` / `belongsTo` | `getFichaTecnica()`, `setFichaTecnica()`, `createFichaTecnica()` |
| `hasMany` | `getFilmes()`, `setFilmes()`, `addFilme()`, `addFilmes()`, `removeFilme()`, `createFilme()` |
| `belongsToMany` | `getArtistas()`, `setArtistas()`, `addArtista()`, `addArtistas()`, `removeArtista()`, `createArtista()` |

Exemplos de uso:

```javascript
// 1:1 - criar a ficha técnica de um filme já existente
const filme = await Filme.findByPk(1);
await filme.createFichaTecnica({ duracaoMinutos: 120, orcamento: 5000000, bilheteria: 15000000 });

// N:N - associar artistas a um filme
const filme = await Filme.findByPk(1);
await filme.setArtistas([1, 2, 3]); // substitui todos os artistas pelos ids informados
await filme.addArtista(4);          // adiciona mais um artista, sem remover os demais
```

---

### Recebendo relacionamentos em formulários

Para relacionamentos **1:N**, normalmente usamos um `<select>` simples, enviando um único ID:

```html
<select name="diretorId">
  {{#each diretores}}
    <option value="{{this.id}}">{{this.nome}}</option>
  {{/each}}
</select>
```

Para relacionamentos **N:N**, usamos um `<select multiple>`, que envia um array de IDs:

```html
<select name="artistas" multiple>
  {{#each artistas}}
    <option value="{{this.id}}">{{this.nome}}</option>
  {{/each}}
</select>
```

  

---
---
⬅️ **[Voltar ao índice](index.md)**
