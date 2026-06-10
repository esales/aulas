# Apostila de Express.js

> **Express.js** é o framework web mais popular para Node.js. Minimalista, flexível e rápido, ele fornece recursos para construir APIs REST, aplicações web e servidores HTTP com simplicidade.

---

## Introdução e Exemplo

### O que é Express.js?

Express é um framework minimalista para Node.js que facilita a criação de servidores HTTP. Ele tem recursos de roteamento, middleware e utilitários para resposta a requsições.

### Por que usar Express?

- Leve
- Ecossistema enorme de middleware (recursos)
- Fácil de aprender e integrar
- Base para frameworks maiores (NestJS, Sails, Feathers)
- Amplamente utilizado pela comunidade de desenvolvedores

### Instalação

```bash
mkdir meu-servidor
cd meu-servidor
npm init -y
npm install express
```

### Primeiro servidor
Crie o arquivo **index.js** e escreva:

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Testando o express!');
});

app.listen(
    3000, 
    () => console.log(`Servidor em execução`)
);
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

## Rotas

Uma rota define como a aplicação responde a uma requisição em uma URL específica com um método HTTP específico.

### Métodos HTTP mais usados:

| Método | Uso |
|--------|-----|
| GET    | Buscar dados |
| POST   | Enviar/criar dados |
| PUT    | Atualizar dados completos |
| PATCH  | Atualizar dados parcialmente |
| DELETE | Deletar dados |

### Exemplos de rotas:

```javascript
const express = require('express');
const app = express();

// Rota GET para a raiz da nossa aplicação
app.get('/', (req, res) => {
  res.send('Página Inicial');
});

// Rota GET para /filmes
app.get('/filmes', (req, res) => {
  res.send('Lista de filmes');
});

// Rota GET com parâmetro de rota
app.get('/filmes/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Detalhes do filme de ID: ${id}`);
});

// Rota POST para /filmes
app.post('/filmes', (req, res) => {
  res.send('Filme criado com sucesso!');
});

// Rota DELETE com parâmetro de rota
app.delete('/filmes/:id', (req, res) => {
  const id = req.params.id;
  res.send(`Filme ${id} deletado.`);
});

app.listen(3000, () => {
  console.log('Servidor em http://localhost:3000');
});
```

### Parâmetros de rota 

Parâmetros de rota são partes dinâmicas da URL.
Eles permitem que uma mesma rota funcione para vários valores diferentes.
Normalmente são utilizados para identificar um recurso específico.

Exemplo:

```url
/filmes/1
/filmes/2
/filmes/35
```
Em vez de criar uma rota para cada filime, usamos um parâmetro de rota.

Por exemplo, na rota a seguir, se for acessada a url /filmes/42, o console.log irá imprimir o valor 42:

```javascript
// Parâmetro de rota: /filmes/42
app.get('/filmes/:id', (req, res) => {
  console.log(req.params.id); // "42"
});
```

### Query String
Query string são dados enviados na URL após o símbolo `?`.

Exemplo:

```url
/produtos?categoria=games&pagina=2
```

Aqui temos:

```url
categoria=games
pagina=2
```

Cada informação é chamada de parâmetro de query e são separados por `&`.
Os parâmetros de query são recuperados através da propriedade query do objeto da requisição (req.query).

Por exemplo, se for acessada a url */produtos?categoria=games&pagina=2*, serão impressos "games" e depois "2".

```javascript
// Query string: /produtos?categoria=games&pagina=2
app.get('/produtos', (req, res) => {
  console.log(req.query.categoria); //games
  console.log(req.query.pagina); //2
})
```

Query string é usada quando você quer:
- filtrar
- pesquisar
- ordenar
- paginar
- enviar opções extras

---
---

## Enviando Respostas

No Express.js, o objeto `res` (*response*) é utilizado para enviar uma resposta ao cliente.

### Enviando texto simples
O método `send()` envia uma resposta simples para o cliente.

```javascript
res.send('Olá Mundo');
```

---

### Enviando JSON

O método `json()` converte automaticamente o objeto para o formato JSON. Muito utilizado em APIs REST.

```javascript
res.json({
  nome: 'Matrix',
  ano: 1999
});
```

---

### Enviando respostas com status HTTP

Os **status HTTP** indicam o resultado da requisição.

Alguns códigos comuns:

| Status | Significado |
|---|---|
| 200 | Sucesso |
| 201 | Recurso criado |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

O método `status()` define o código HTTP da resposta.

```javascript
// Recurso não encontrado
res.status(404).send('Não encontrado');

// Recurso criado com sucesso
res.status(201).json({
  mensagem: 'Criado com sucesso'
});
```

---

### Redirecionando o usuário

O método `redirect()` faz com que o cliente seja enviado para outra rota.

```javascript
res.redirect('/filmes');
```
Nesse caso, o cliente será redirecionado para a rota `/filmes`.

---

### Recebendo dados de formulários

No Express.js, req.body contém os dados enviados pelo cliente no corpo da requisição HTTP.
Esses dados chegam ao servidor principalmente em requisições do tipo **POST**, **PUT** ou **PATCH**.

É principalmente utilizado em:
- formulários HTML
- APIs REST

#### Exemplo com formulário HTML
Ao clicar no botão "Enviar", o navegador envia uma requisição HTTP do tipo POST para  `/usuarios`, levando os dados do formulário no corpo da requisição.
O atributo *name* do elemento input indica o nome da propriedade no *req.body*.

```html
<form action="/usuarios" method="POST">
  <input type="text" name="email">
  <button type="submit">Enviar</button>
</form>
```

O valor enviado no input do formulário chega como uma propriedade dentro de req.body.
Neste caso, o nome da propriedade é *email* pois foi o valor setado no atributo *name* do elemento *input*.
```javascript
app.post('/usuarios', (req, res) => {
  console.log(req.body.email);
});
```

Se o usuário digitar "joao@discente.ifpe.edu.br", o `req.body` será:

```javascript
{
  nome: 'joao@discente.ifpe.edu.br'
}
```

#### Importante

Para o `req.body` funcionar, é necessário habilitar o middleware:

```javascript
app.use(express.urlencoded({ extended: true }));
```
<!-- app.use(express.json()); -->

#### Resumo

O `req.body` é o local onde o Express guarda os dados enviados pelo cliente dentro da requisição HTTP.

---

### Exemplo completo

```javascript
const express = require('express');

const app = express();


// Rota principal
app.get('/', (req, res) => {
  res.send('Página inicial');
});


// Retornando JSON
app.get('/filmes', (req, res) => {
  res.json({
    nome: 'Matrix',
    ano: 1999
  });
});


// Retornando status HTTP
app.get('/erro', (req, res) => {
  res.status(404).send('Página não encontrada');
});


// Redirecionamento
app.get('/inicio', (req, res) => {
  res.redirect('/');
});


// Inicializando servidor
app.listen(3000, () => {
  console.log('Servidor executando na porta 3000');
});
```

---
---

## Handlebars
Handlebars é uma template engine para JavaScript.
Ela permite gerar páginas HTML dinamicamente usando dados vindos do servidor.
Com ela, você mistura:
- HTML
- variáveis
- estruturas dinâmicas

### O que são Template Engines?

Uma template engine permite gerar HTML dinâmico no servidor, combinando templates HTML com dados reais. Em vez de concatenar strings para montar HTML, usamos uma sintaxe especial que o servidor interpreta antes de enviar a resposta.

### Instalando o Handlebars

Usaremos o pacote `express-handlebars`:

```
npm install express-handlebars
```

### Configuração no Express

```javascript
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

// Configura o Handlebars como view engine
app.engine('handlebars', exphbs.engine({defaultLayout:false}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('home', {
    titulo: 'Mini Netflix',
    descricao: 'Os melhores filmes em um só lugar.'
  });
});

app.listen(3000, () => {
  console.log('Servidor em http://localhost:3000');
});
```

### Estrutura de Pastas

O Handlebars espera a seguinte estrutura:

```
views/
  home.handlebars
  filmes.handlebars
  layouts/
    main.handlebars
  partials/
    cabecalho.handlebars
    rodape.handlebars
```
### Sintaxe do Handlebars

#### Expressões simples:
Permitem exibir valores dinâmicos enviados pelo servidor diretamente no HTML usando {{ }}.

```html
{{nome}}
{{usuario.email}}
```

#### Condicional if/else:
Permite exibir conteúdos diferentes dependendo de uma condição usando {{#if}} e {{else}}.

```html
{{#if logado}}
  <p>Bem-vindo, {{nome}}!</p>
{{else}}
  <p>Por favor, faça login.</p>
{{/if}}
```

#### Loop each:
Permite percorrer arrays ou objetos e repetir blocos de HTML para cada item usando {{#each}}.

```html
{{#each itens}}
  <li>{{this.nome}} — {{this.preco}}</li>
{{/each}}
```

#### Unless (quando não...):
Permite exibir um bloco de conteúdo quando a condição for falsa usando {{#unless}}.

```html
{{#unless erro}}
  <p>Operação realizada com sucesso!</p>
{{/unless}}
```

### Passando Dados para as Views
Os dados podem ser enviados do servidor para a view através do método render(), permitindo gerar conteúdo dinâmico no HTML.

Rota:
```javascript
app.get('/', (req, res) => {

  res.render('home', {
    nome: 'João',
    idade: 20
  });

});
```

View `home.handlebars`:

```html
<h1>Olá {{nome}}</h1>

<p>Idade: {{idade}}</p>
```

### Exemplo Completo

```javascript
app.get('/', (req, res) => {

  res.render('home', {

    nome: 'João',
    logado: true,
    admin: false,

    filmes: [
      'Matrix',
      'Interestelar',
      'Avatar'
    ]

  });

});
```

View `home.handlebars`:

```html
<h1>Olá {{nome}}</h1>

<!-- Condicional if -->
{{#if logado}}
  <p>Usuário autenticado</p>
{{else}}
  <p>Usuário não autenticado</p>
{{/if}}

<!-- Condicional unless -->
{{#unless admin}}
  <p>Você não é administrador</p>
{{/unless}}

<!-- Loop each -->
<h2>Filmes</h2>

<ul>
  {{#each filmes}}
    <li>{{this}}</li>
  {{/each}}
</ul>
```

### Exemplo com `each` e Array de Objetos

```javascript
let filmes: [
      { nome: 'Matrix', ano: 1999 },
      { nome: 'Interestelar', ano: 2014 },
      { nome: 'Avatar', ano: 2009 }
    ]
app.get('/', (req, res) => {

  res.render(
    'home', 
    { filmes }
  );
});
```

View `home.handlebars`:

```html
<h1>Lista de Filmes</h1>

<ul>
  {{#each filmes}}
    <li>
      {{this.nome}} - {{this.ano}}
    </li>
  {{/each}}
</ul>
```

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

```html
<h1>{{titulo}}</h1>

<p>Bem-vindo ao sistema de filmes.</p>

<a href="/filmes">
  Ver filmes
</a>
```

---

### views/filmes.handlebars

```html
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

---

### views/cadastrarFilme.handlebars

```html
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

## Exercícios - Express.js Básico

---

### Rotas Básicas

#### Exercício 1

Crie uma aplicação Express com uma rota GET `/` que exiba:

```txt
Bem-vindo ao sistema
```

---

#### Exercício 2

Crie uma rota GET `/sobre` que exiba uma mensagem sobre a aplicação.

---

#### Exercício 3

Crie uma rota GET `/contato` retornando um JSON com:

```json
{
  "email": "contato@email.com",
  "telefone": "(81) 99999-9999"
}
```

---

#### Exercício 4

Crie uma rota GET `/erro` que retorne:
- status HTTP `404`
- mensagem `Página não encontrada`

---

#### Exercício 5

Crie uma rota GET `/inicio` que redirecione o usuário para `/`.

---

### Parâmetros de Rota

#### Exercício 6

Crie uma rota GET `/usuarios/:id`.

A rota deve exibir o ID enviado na URL.

##### Exemplo

```txt
/usuarios/10
```

Resposta:

```txt
Usuário 10
```

---

#### Exercício 7

Crie uma rota GET `/produtos/:nome`.

A rota deve exibir o nome do produto enviado.

---

#### Exercício 8

Crie uma rota GET `/filmes/:id/:nome`.

Exiba:
- ID do filme
- Nome do filme

---

### Query Strings

#### Exercício 9

Crie uma rota GET `/buscar`.

Receba a query string `nome`.

##### Exemplo

```txt
/buscar?nome=Joao
```

Resposta:

```txt
Buscando por: Joao
```

---

#### Exercício 10

Crie uma rota GET `/produtos`.

Receba:
- `categoria`
- `pagina`

Exiba os valores recebidos.

---

#### Exercício 11

Crie uma rota GET `/usuarios`.

Receba a query string `idade`.

Exiba:

```txt
Filtrando usuários com idade X
```

---

### Handlebars

#### Exercício 12

Configure o Handlebars no Express.

Crie uma view `home.handlebars` exibindo:

```txt
Bem-vindo ao sistema
```

---

#### Exercício 13

Crie uma rota `/perfil`.

Envie para a view:
- nome
- idade

Exiba essas informações no HTML usando Handlebars.

---

#### Exercício 14

Crie uma view que exiba uma lista de filmes usando `{{#each}}`.

Os filmes devem ser enviados pelo servidor.

---

#### Exercício 15

Crie uma view com:
- `if`
- `else`
- `unless`

Exiba mensagens diferentes dependendo dos dados enviados.

---

#### Exercício 16

Crie uma página `/filmes` que:
- liste filmes
- exiba nome e ano
- utilize array de objetos
- utilize `{{#each}}`

---

### Aplicação completa

#### Exercício 17

Crie um pequeno sistema inspirado no TikTok utilizando Express.js e Handlebars.

---

#### Rotas

Crie as seguintes rotas:

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Página inicial |
| GET | `/videos` | Listar vídeos |
| GET | `/videos/cadastrar` | Exibir formulário de cadastro |
| POST | `/videos` | Cadastrar vídeo |

---

#### Propriedades do Vídeo

Cada vídeo deve possuir:

- título
- nome do criador
- descrição
- quantidade de visualizações
- quantidade de curtidas
- hashtag principal
- URL do vídeo
- URL da thumbnail

---

#### Requisitos

O sistema deve:

- utilizar Express.js
- utilizar Handlebars
- utilizar `res.render()`
- utilizar `redirect()`
- utilizar formulário HTML
- utilizar método POST
- utilizar array de objetos
- utilizar `{{#each}}` para listar os vídeos

---

#### Página de Listagem

A página `/videos` deve exibir:

- thumbnail
- título
- criador
- visualizações
- curtidas
- hashtag

---

#### Página de Cadastro

A página `/videos/cadastrar` deve possuir um formulário com campos para:
- título
- criador
- descrição
- visualizações
- curtidas
- hashtag
- URL do vídeo
- URL da thumbnail

---
---

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
```javascript
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
```javascript
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

## Exercícios - Sequelize e SQLite3

---

### Conexão e Models

#### Exercício 1

Crie um arquivo `db.js` com a conexão ao SQLite3 usando Sequelize.
Teste a conexão e exiba uma mensagem de sucesso no terminal.

---

#### Exercício 2

Crie um model `Produto` com as propriedades:
- `nome` (STRING)
- `preco` (FLOAT)

Sincronize com o banco e verifique se o arquivo `.sqlite` foi criado.

---

#### Exercício 3

Crie um model `Usuario` com as propriedades:
- `nome` (STRING)
- `email` (STRING)
- `idade` (INTEGER)

---

### CRUD

#### Exercício 4

Usando o model `Produto`, crie três produtos com `create()` e liste todos eles com `findAll()`.

---

#### Exercício 5

Busque um produto pelo ID com `findByPk()`.
Exiba o nome e o preço no terminal.

---

#### Exercício 6

Atualize o preço de um produto usando `save()`.

---

#### Exercício 7

Delete um produto usando `destroy()`.
Depois liste todos os produtos para confirmar a remoção.

---

### Integração com Express

#### Exercício 8

Crie uma rota GET `/produtos` que busque todos os produtos no banco e retorne um JSON com os resultados.

---

#### Exercício 9

Crie uma rota POST `/produtos` que receba `nome` e `preco` pelo `req.body` e salve no banco usando `create()`.

---

#### Exercício 10

Crie uma rota que receba um `id` como parâmetro de rota e delete o registro correspondente no banco.

---

### Integração com Express e Handlebars

#### Exercício 11

Crie uma rota GET `/usuarios` que busque todos os usuários no banco e renderize uma view `usuarios.handlebars` com a lista usando `{{#each}}`.

---

#### Exercício 12

Crie um formulário em `cadastrarUsuario.handlebars` com campos para `nome`, `email` e `idade`.

A rota POST deve salvar o usuário no banco e redirecionar para `/usuarios`.

---

#### Exercício 13

Adicione um botão de remoção na listagem de usuários.

Ao clicar, o usuário deve ser removido do banco e a página deve ser redirecionada para `/usuarios`.

---

### Aplicação Completa

#### Exercício 14

Refatore o mini-TikTok do exercício anterior para usar **Sequelize + SQLite3** no lugar do array em memória.

Os vídeos devem ser persistidos no banco de dados.

---

##### Requisitos

O sistema deve:

- utilizar Express.js
- utilizar Handlebars
- utilizar Sequelize e SQLite3
- utilizar um model `Video` com todas as propriedades do exercício anterior
- persistir os dados no banco
- listar os vídeos buscando do banco com `findAll()`
- cadastrar vídeos salvando no banco com `create()`
- ter um botão de remoção em cada vídeo usando `destroy()`