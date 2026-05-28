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

<!-- #### Exemplo com JSON

```javascript
app.post('/filmes', (req, res) => {
  console.log(req.body);
});
```

Requisição enviada:

```json
{
  "titulo": "Matrix",
  "ano": 1999
}
```

Resultado:

```javascript
{
  titulo: 'Matrix',
  ano: 1999
}
```

--- -->

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

<!-- ### Layout Principal

O layout é o esqueleto HTML que envolve todas as páginas. Crie `views/layouts/main.handlebars`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mini Netflix</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background-color: #141414;
      color: #ffffff;
      font-family: Arial, sans-serif;
    }
    nav {
      background-color: #000000;
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    nav .logo {
      color: #e50914;
      font-size: 28px;
      font-weight: bold;
      text-decoration: none;
    }
    nav a {
      color: #ffffff;
      text-decoration: none;
      margin-left: 20px;
    }
    nav a:hover {
      color: #e50914;
    }
    .container {
      max-width: 1200px;
      margin: 30px auto;
      padding: 0 20px;
    }
    footer {
      text-align: center;
      padding: 20px;
      color: #999;
      margin-top: 50px;
      border-top: 1px solid #333;
    }
  </style>
</head>
<body>

  <nav>
    <a href="/" class="logo">MINIFLIX</a>
    <div>
      <a href="/">Início</a>
      <a href="/filmes">Filmes</a>
      <a href="/filmes/novo">Adicionar Filme</a>
    </div>
  </nav>

  <div class="container">
    {{{body}}}
  </div>

  <footer>
    <p>Mini Netflix &copy; 2024 — Projeto de Aprendizado Node.js</p>
  </footer>

</body>
</html>
```

O `{{{body}}}` é onde o conteúdo de cada página será inserido. -->

<!-- ### Criando Views

### View da página inicial — `views/home.handlebars`:

```html
<h1>{{titulo}}</h1>
<p>{{descricao}}</p>
```

### View de lista de filmes — `views/filmes/index.handlebars`:

```html
<h1>Catálogo de Filmes</h1>

{{#if filmes.length}}
  <div class="grid-filmes">
    {{#each filmes}}
      <div class="card-filme">
        <img src="{{this.capa}}" alt="{{this.titulo}}">
        <div class="info">
          <h3>{{this.titulo}}</h3>
          <p>{{this.ano}} | {{this.categoria}}</p>
          <p>Nota: {{this.nota}}/10</p>
          <a href="/filmes/{{this.id}}">Ver detalhes</a>
        </div>
      </div>
    {{/each}}
  </div>
{{else}}
  <p>Nenhum filme cadastrado ainda. <a href="/filmes/novo">Adicionar o primeiro!</a></p>
{{/if}}
``` -->

### Sintaxe do Handlebars

#### Expressões simples:
Permitem exibir valores dinâmicos enviados pelo servidor diretamente no HTML usando {{ }}.

```html
{{nome}}
{{usuario.email}}
```

<!-- ### HTML não escapado (use com cuidado):

```handlebars
{{{conteudoHtml}}}
``` -->

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

<!-- Dentro do `each`, `@index` dá o índice e `@key` a chave do objeto. -->

#### Unless (quando não...):
Permite exibir um bloco de conteúdo quando a condição for falsa usando {{#unless}}.

```html
{{#unless erro}}
  <p>Operação realizada com sucesso!</p>
{{/unless}}
```

<!-- ## 3.8 Partials

Partials são fragmentos de template reutilizáveis. Crie `views/partials/mensagem.handlebars`:

```html
{{#if mensagem}}
  <div class="mensagem {{mensagem.tipo}}">
    <p>{{mensagem.texto}}</p>
  </div>
{{/if}}
```

Use em qualquer view:

```handlebars
{{> mensagem}}
<h1>Conteúdo da página</h1>
```

## 3.9 Helpers Customizados

Helpers são funções que você pode chamar dentro dos templates:

```javascript
const { engine } = require('express-handlebars');

app.engine('handlebars', engine({
  helpers: {
    // Formata nota com uma casa decimal
    formatarNota: function(nota) {
      return parseFloat(nota).toFixed(1);
    },
    // Verifica se dois valores são iguais
    igual: function(a, b) {
      return a === b;
    },
    // Retorna o ano atual
    anoAtual: function() {
      return new Date().getFullYear();
    }
  }
}));
```

No template:

```handlebars
<p>Nota: {{formatarNota nota}}</p>
<p>Ano: {{anoAtual}}</p>
``` -->

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

### Exemplo Completo - Express + Handlebars

#### Instalando as dependências

```bash
npm init -y

npm install express express-handlebars
```

---

#### Estrutura do Projeto

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

#### app.js

```javascript
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();


// Middleware para formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Configurando Handlebars
app.engine('handlebars', exphbs.engine());

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
app.get('/filmes/cadastrar', (req, res) => {

  res.render('cadastrarFilme');

});


// Rota POST - Cadastrar filme
app.post('/filmes', (req, res) => {

  const { nome, ano } = req.body;

  const novoFilme = {
    id: filmes.length + 1,
    nome,
    ano
  };

  filmes.push(novoFilme);

  res.redirect('/filmes');

});


// Rota DELETE
app.delete('/filmes/:id', (req, res) => {

  res.send(`Filme ${req.params.id} removido`);

});


// Inicializando servidor
app.listen(3000, () => {

  console.log('Servidor executando em http://localhost:3000');

});
```

---

#### views/home.handlebars

```html
<h1>{{titulo}}</h1>

<p>Bem-vindo ao sistema de filmes.</p>

<a href="/filmes">
  Ver filmes
</a>
```

---

#### views/filmes.handlebars

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

#### views/cadastrarFilme.handlebars

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

### Exercícios - Express.js Básico

---

#### Rotas Básicas

##### Exercício 1

Crie uma aplicação Express com uma rota GET `/` que exiba:

```txt
Bem-vindo ao sistema
```

---

##### Exercício 2

Crie uma rota GET `/sobre` que exiba uma mensagem sobre a aplicação.

---

##### Exercício 3

Crie uma rota GET `/contato` retornando um JSON com:

```json
{
  "email": "contato@email.com",
  "telefone": "(81) 99999-9999"
}
```

---

##### Exercício 4

Crie uma rota GET `/erro` que retorne:
- status HTTP `404`
- mensagem `Página não encontrada`

---

##### Exercício 5

Crie uma rota GET `/inicio` que redirecione o usuário para `/`.

---

#### Parâmetros de Rota

##### Exercício 6

Crie uma rota GET `/usuarios/:id`.

A rota deve exibir o ID enviado na URL.

###### Exemplo

```txt
/usuarios/10
```

Resposta:

```txt
Usuário 10
```

---

##### Exercício 7

Crie uma rota GET `/produtos/:nome`.

A rota deve exibir o nome do produto enviado.

---

##### Exercício 8

Crie uma rota GET `/filmes/:id/:nome`.

Exiba:
- ID do filme
- Nome do filme

---

#### Query Strings

##### Exercício 9

Crie uma rota GET `/buscar`.

Receba a query string `nome`.

###### Exemplo

```txt
/buscar?nome=Joao
```

Resposta:

```txt
Buscando por: Joao
```

---

##### Exercício 10

Crie uma rota GET `/produtos`.

Receba:
- `categoria`
- `pagina`

Exiba os valores recebidos.

---

##### Exercício 11

Crie uma rota GET `/usuarios`.

Receba a query string `idade`.

Exiba:

```txt
Filtrando usuários com idade X
```

---

#### Handlebars

##### Exercício 12

Configure o Handlebars no Express.

Crie uma view `home.handlebars` exibindo:

```txt
Bem-vindo ao sistema
```

---

##### Exercício 13

Crie uma rota `/perfil`.

Envie para a view:
- nome
- idade

Exiba essas informações no HTML usando Handlebars.

---

##### Exercício 14

Crie uma view que exiba uma lista de filmes usando `{{#each}}`.

Os filmes devem ser enviados pelo servidor.

---

##### Exercício 15

Crie uma view com:
- `if`
- `else`
- `unless`

Exiba mensagens diferentes dependendo dos dados enviados.

---

##### Exercício 16

Crie uma página `/filmes` que:
- liste filmes
- exiba nome e ano
- utilize array de objetos
- utilize `{{#each}}`

---

#### Aplicação completa

##### Exercício 17

Crie um pequeno sistema inspirado no TikTok utilizando Express.js e Handlebars.

---

##### Rotas

Crie as seguintes rotas:

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Página inicial |
| GET | `/videos` | Listar vídeos |
| GET | `/videos/cadastrar` | Exibir formulário de cadastro |
| POST | `/videos` | Cadastrar vídeo |

---

##### Propriedades do Vídeo

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

##### Requisitos

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

##### Página de Listagem

A página `/videos` deve exibir:

- thumbnail
- título
- criador
- visualizações
- curtidas
- hashtag

---

##### Página de Cadastro

A página `/videos/cadastrar` deve possuir um formulário com campos para:
- título
- criador
- descrição
- visualizações
- curtidas
- hashtag
- URL do vídeo
- URL da thumbnail