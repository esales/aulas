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

---
---
⬅️ **[Voltar ao índice](index.md)**