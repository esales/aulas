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
