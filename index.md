# Apostila de Express.js

> **Express.js** é o framework web mais popular para Node.js. Minimalista, flexível e rápido, ele fornece recursos para construir APIs REST, aplicações web e servidores HTTP com simplicidade.

---

## 1. Introdução e Exemplo

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

Execute com:

```bash
node index.js
```

Acesse `http://localhost:3000` no navegador (Chrome, Firefox, Safari, etc) e você verá "Testando o express!".
