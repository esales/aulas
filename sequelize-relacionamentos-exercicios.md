## Exercícios - Sequelize e Relacionamentos

---

### Relacionamento 1:1

#### Exercício 1

Crie os models `Pessoa` e `Passaporte`.

`Pessoa` deve ter:
- `nome` (STRING)

`Passaporte` deve ter:
- `numero` (STRING)
- `validade` (DATE)

Configure a associação 1:1 entre eles usando `hasOne` e `belongsTo`.

---

#### Exercício 2

Crie uma rota que:
- cadastre uma `Pessoa`
- em seguida, utilize o método mágico `createPassaporte()` para criar o passaporte vinculado a ela

Obs.: No final, precisa usar o `res.send()` senão o navegador (chrome, firefox) ficará "carregando" eternamente.

---

#### Exercício 3

Crie uma rota que busque uma `Pessoa` pelo ID, trazendo o passaporte junto através do `include`, e exiba os dados no terminal.

Obs.: No final, precisa usar o `res.send()` senão o navegador (chrome, firefox) ficará "carregando" eternamente.

---

### Relacionamento 1:N

#### Exercício 4

Crie os models `Autor` e `Livro`.

`Autor` deve ter:
- `nome` (STRING)

`Livro` deve ter:
- `titulo` (STRING)
- `anoPublicacao` (INTEGER)

Configure a associação 1:N: um autor pode ter vários livros.

---

#### Exercício 5

Crie uma rota que cadastre um autor e, em seguida, cadastre 2 livros vinculados a ele (utilizando `autorId` ou o método mágico `createLivro()`).

Obs.: No final, precisa usar o `res.send()` senão o navegador (chrome, firefox) ficará "carregando" eternamente.

---

#### Exercício 6

Crie uma rota que busque um autor pelo ID trazendo a lista de livros com `include`, e exiba os dados no terminal.

Obs.: No final, precisa usar o `res.send()` senão o navegador (chrome, firefox) ficará "carregando" eternamente.

---

### Relacionamento N:N

#### Exercício 7

Reaproveitando o model `Livro`, crie o model `Categoria`, com:
- `nome` (STRING)

Configure a associação N:N entre `Livro` e `Categoria`.

---

#### Exercício 8

Crie uma rota que cadastre um livro e associe 2 ou mais categorias a ele, utilizando `setCategorias()` ou `addCategoria()`.

Obs.: No final, precisa usar o `res.send()` senão o navegador (chrome, firefox) ficará "carregando" eternamente.

---

#### Exercício 9

Crie uma rota que busque um livro pelo ID trazendo suas categorias com `include`, e exiba os dados no terminal.

Obs.: No final, precisa usar o `res.send()` senão o navegador (chrome, firefox) ficará "carregando" eternamente.

---

### Formulários com relacionamento

#### Exercício 10

Crie um formulário de cadastro de `Livro` com:
- um `<select>` para escolher o autor
- um `<select multiple>` para escolher uma ou mais categorias

A rota POST deve processar os dois campos e salvar as associações.

---

#### Exercício 11

Crie uma tela `detalharLivro.handlebars` que exiba o título, o autor e a lista de categorias do livro.

---

### Aplicação Completa

#### Exercício 12

Estenda o mini-TikTok (já refatorado para usar Sequelize e SQLite3) adicionando relacionamentos.

---

##### Requisitos

O sistema deve:

- criar o model `Criador`, com `nome`, `nomeUsuario` e `seguidores`
- relacionar `Criador` e `Video` como **1:N** (um criador tem vários vídeos) — remova o campo solto "nome do criador" de `Video` e substitua por essa associação
- criar o model `PerfilCriador`, com `bio`, `fotoUrl` e `linkRedeSocial`
- relacionar `Criador` e `PerfilCriador` como **1:1**
- criar o model `Hashtag`, com `nome`
- relacionar `Video` e `Hashtag` como **N:N** — remova o campo solto "hashtag principal" de `Video` e substitua por essa associação
- na tela de cadastro de vídeo, incluir um `<select>` para escolher o criador e um `<select multiple>` para escolher as hashtags
- na tela de detalhamento do vídeo, exibir o criador (com link) e a lista de hashtags
- na tela de detalhamento do criador, exibir o perfil (bio, foto, link) e a lista de vídeos publicados por ele

---
---
⬅️ **[Voltar ao índice](index.md)**
