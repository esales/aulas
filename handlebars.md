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

---
---
⬅️ **[Voltar ao índice](index.md)**