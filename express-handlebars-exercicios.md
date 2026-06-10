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
⬅️ **[Voltar ao índice](index.md)**