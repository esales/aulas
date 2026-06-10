## Sequelize

> **Sequelize** é um ORM (*Object-Relational Mapper*) para Node.js. Ele permite interagir com bancos de dados relacionais usando JavaScript, sem precisar escrever SQL diretamente. 

---

### O que é um ORM?

Um ORM faz a ponte entre o código JavaScript e o banco de dados.
Em vez de escrever SQL puro, você escreve código JavaScript e o ORM traduz para SQL automaticamente.

Exemplo - sem ORM:
```sql
INSERT INTO filmes (nome, ano) VALUES ('Matrix', 1999);
```

Exemplo - com Sequelize:
```javascript
await Filme.create({ nome: 'Matrix', ano: 1999 });
```

O resultado é o mesmo. A diferença é que com o Sequelize você trabalha com objetos JavaScript.

### O que é SQLite3?

SQLite3 é um banco de dados relacional que fica salvo em um único arquivo no seu projeto.
Não precisa instalar nenhum servidor separado, funciona direto na sua máquina.

É ideal para:
- aprendizado
- projetos pequenos
- protótipos

### Instalação

```bash
npm install sequelize sqlite3
```

---

### Criando a conexão

Crie o arquivo **bd.js** na pasta *config*:

```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './bd.sqlite'
});

module.exports = sequelize;
```

O campo `storage` define o nome do arquivo onde o banco será salvo.
Quando você rodar a aplicação pela primeira vez, esse arquivo será criado automaticamente.

---

### Testando a conexão

No arquivo **app.js** inclua no início:

```javascript
const sequelize = require('./config/bd');
```

e inclua no final:
```javascript
async function conectarBD() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (erro) {
    console.error('Erro ao conectar:', erro);
  }
}

conectarBD();
```

Ao executar a aplicação, caso tudo ocorra bem, será exibida a mensagem *"Conexão com o banco de dados estabelecida com sucesso!"*. Além disso, será criado o arquivo **bd.sqlite** na raíz do projeto.

---

### Models

Um **Model** representa uma tabela do banco de dados.
Cada propriedade do model vira uma coluna na tabela.

#### Criando um Model

Na pasta *models/* crie o arquivo **Filme.model.js**:

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Filme = sequelize.define(
  'Filme', 
  {
    nome: {
      type: DataTypes.STRING,
    },
    ano: {
      type: DataTypes.INTEGER,
    }
  },
  {
    tableName: 'Filmes',
    timestamps: true
  }
);

module.exports = Filme;
```
Primeiro são importados os tipos de dados (DataTypes) e as configurações de conexão com o banco de dados.

Depois, o método define() cria um model. Ele recebe três argumentos:
1. Nome do model 
2. Colunas da tabela
3. Configurações extras


O Sequelize vai criar automaticamente a tabela `Filmes` no banco com as colunas `nome`(String) e `ano`(Integer).
Ele adiciona a coluna `id` como chave primária. Além disso, a propriedade *timestamps* indica que queremos os campos `createdAt` (data/hora de criação do registro) e `updatedAt` (data/hora da última atualização).

#### Tipos de dados mais usados

| Tipo | Descrição |
|---|---|
| `DataTypes.STRING` | Texto curto (VARCHAR) |
| `DataTypes.TEXT` | Texto longo |
| `DataTypes.INTEGER` | Número inteiro |
| `DataTypes.FLOAT` | Número decimal |
| `DataTypes.BOOLEAN` | Verdadeiro ou falso |
| `DataTypes.DATE` | Data e hora |

#### Sincronizando o Model com o banco
O método `authenticate` faz a autenticação no banco de dados mas não realiza a criação das tabelas.

Para isso utilizamos o método `sync()` que cria as tabelas no banco caso ainda não exista.

Portanto, vamos alterar o método `conectarBD()` do arquivo **app.js**. O método `authenticate()` deve ser alterado para o `sync()`:

```javascript
    await sequelize.sync();
```
---

### Operações no BD (CRUD)

CRUD é a sigla para as quatro operações básicas com dados:

| Operação | Significado | Método Sequelize |
|---|---|---|
| **C**reate | Criar | `create()` |
| **R**ead | Ler / Buscar | `findAll()`, `findByPk()` |
| **U**pdate | Atualizar | `update()` |
| **D**elete | Deletar | `destroy()` |

---

### Create - Criando um registro

O método `create()` insere um novo registro na tabela.

```javascript
const novoFilme = await Filme.create({
  nome: 'Matrix',
  ano: 1999
});

console.log(novoFilme.id);   // ID gerado automaticamente
console.log(novoFilme.nome); // 'Matrix'
```

---

### Read - Buscando registros

#### Buscar todos os registros

O método `findAll()` retorna todos os registros da tabela como um array.

```javascript
const filmes = await Filme.findAll();
console.log(filmes); // array com todos os filmes
```

#### Buscar por ID

O método `findByPk()` busca um registro pelo ID (Primary Key).

```javascript
const filme = await Filme.findByPk(1);
console.log(filme.nome); // nome do filme com id 1
```

Se o registro não existir, o retorno será `null`.

---

### Update - Atualizando um registro

Uma das formas de atualizar um registro é, depois de ter buscado, alterar a propriedade e utlizar o método `save()`:

```javascript
const filme = await Filme.findByPk(1);
filme.ano = 2000;
await filme.save();
```

---

### Delete - Deletando um registro

O método `destroy()` remove registros que atendam a uma condição.

```javascript
const filme = await Filme.findByPk(2);
await Filme.destroy();
```

---
---
⬅️ **[Voltar ao índice](index.md)**