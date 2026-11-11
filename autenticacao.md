# Autenticação com Express, Session Cookies, bcrypt e Passport

Neste tutorial, vamos estudar como implementar autenticação em uma aplicação Express. Serão utilizados cookies de sessão, `express-session`, `bcrypt` e Passport.

A implementação prática será incorporada ao projeto de filmes desenvolvido anteriormente com Express, Handlebars e Sequelize.

---

## 1. Autenticação e autorização

**Autenticação** é o processo de verificar a identidade de um usuário. Em uma aplicação com login e senha, o usuário informa suas credenciais e o sistema verifica se elas são válidas.

**Autorização** é o processo de determinar quais recursos e operações um usuário autenticado pode acessar.

Exemplo:

- Autenticação: verificar se o email e a senha correspondem a uma conta cadastrada.
- Autorização: verificar se o usuário pode cadastrar, alterar ou excluir filmes.

Neste tutorial, vamos implementar a autenticação e a proteção das rotas do sistema. O controle de permissões por perfil poderá ser desenvolvido posteriormente.

## 2. O problema: HTTP não mantém o estado do usuário

O protocolo HTTP é stateless, ou seja, cada requisição é tratada de forma independente. Por padrão, o servidor não sabe que duas requisições consecutivas foram feitas pelo mesmo usuário.

Imagine o seguinte cenário:

1. O usuário informa email e senha no formulário de login.
2. O servidor valida as credenciais.
3. O usuário solicita a página de filmes.

Sem algum mecanismo adicional, a segunda requisição não carrega automaticamente a informação de que o usuário já realizou login.

É necessário criar uma forma de manter essa informação entre as requisições. Uma solução comum é utilizar **sessões identificadas por cookies**.

## 3. Sessões e cookies

Uma sessão é um conjunto de informações mantidas no servidor e associadas a um identificador.

Quando o usuário realiza login com sucesso, a aplicação cria ou atualiza uma sessão. O servidor envia ao navegador um cookie contendo o identificador dessa sessão.

Nas próximas requisições, o navegador envia esse cookie automaticamente para o mesmo site. O servidor utiliza o identificador para localizar a sessão correspondente.

O cookie normalmente **não contém a senha nem os dados completos do usuário**. Ele contém um identificador que permite ao servidor recuperar os dados da sessão.

### 3.1. Cookie e sessão não são a mesma coisa

- **Cookie:** informação armazenada pelo navegador e enviada nas requisições seguintes.
- **Sessão:** informação mantida no servidor e associada ao identificador presente no cookie.

O cookie funciona como uma referência à sessão. A sessão propriamente dita fica no servidor.

## 4. Express Session

A biblioteca `express-session` permite gerenciar sessões em aplicações Express.

Uma configuração utilizada no projeto é:

```javascript
const session = require('express-session');

app.use(session({
    name: 'sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax'
    }
}));
```

Algumas opções importantes:

- `name`: nome do cookie que identifica a sessão.
- `secret`: chave utilizada para assinar o identificador da sessão.
- `resave`: evita salvar novamente sessões que não foram alteradas.
- `saveUninitialized`: evita salvar sessões ainda não inicializadas.
- `httpOnly`: impede que scripts executados no navegador leiam o cookie.
- `maxAge`: define a validade do cookie em milissegundos.
- `sameSite`: ajuda a reduzir determinados ataques de envio de requisições entre sites.

O valor `1000 * 60 * 60 * 24` corresponde a 24 horas.

## 5. Armazenamento das sessões

Por padrão, `express-session` utiliza um armazenamento em memória, adequado apenas para desenvolvimento e testes simples.

Neste projeto, utilizaremos `connect-sqlite3` para armazenar as sessões em um arquivo SQLite.

Esse arquivo é independente do banco de dados utilizado pelo Sequelize para armazenar filmes e usuários.

## 6. bcrypt

Senhas não devem ser armazenadas diretamente no banco de dados. Para isso, utilizamos uma função de hash própria para senhas, como bcrypt.

Para gerar um hash:

```javascript
const bcrypt = require('bcrypt');

const hash = await bcrypt.hash('123456', 10);
```

Para verificar uma senha:

```javascript
const senhaValida = await bcrypt.compare('123456', hash);
```

O método `compare` recebe a senha informada e o hash armazenado. Não é necessário descriptografar o hash.

O número `10` representa o custo utilizado na geração do hash.

## 7. Passport

O Passport é um middleware de autenticação para Node.js. Ele oferece estratégias para diferentes formas de autenticação.

Neste exemplo, utilizaremos a estratégia `LocalStrategy`, baseada em credenciais fornecidas pelo próprio usuário, como email e senha.

O Passport ficará responsável por:

- Executar a estratégia de autenticação.
- Estabelecer a autenticação do usuário na sessão.
- Recuperar o usuário nas requisições seguintes.
- Encerrar a autenticação no logout.

## 8. LocalStrategy

A estratégia `LocalStrategy` permite configurar quais campos do formulário serão utilizados como identificação e senha.

No projeto, os campos serão `email` e `senha`.

A estratégia consulta o usuário no banco de dados e utiliza `bcrypt.compare()` para verificar a senha.

Se as credenciais forem válidas, a estratégia retorna o usuário ao Passport. Caso contrário, a autenticação é recusada.

## 9. Serialização e desserialização

Depois de autenticar o usuário, o Passport precisa manter sua identificação entre as requisições.

A função `serializeUser` define qual informação será armazenada na sessão. Neste exemplo, será armazenado apenas o identificador do usuário:

```javascript
passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});
```

A função `deserializeUser` recebe esse identificador e recupera o usuário no banco de dados:

```javascript
passport.deserializeUser(async (id, done) => {
    const usuario = await Usuario.findByPk(id);
    done(null, usuario || false);
});
```

Nas requisições seguintes, o usuário recuperado ficará disponível em `req.user`.

## 10. Middlewares de autenticação

O Passport disponibiliza o método `req.isAuthenticated()`, que informa se a requisição está associada a um usuário autenticado.

Podemos utilizar essa informação em um middleware para proteger rotas:

```javascript
function autenticado(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}
```

Quando o usuário está autenticado, `next()` permite que a execução continue para a próxima função ou rota. Caso contrário, ele é redirecionado para o login.

## 11. Logout

O método `req.logout()` encerra a autenticação do usuário no Passport.

Na implementação deste projeto, também destruímos a sessão e removemos o cookie utilizado para identificá-la.

O logout será acionado por uma requisição POST, enviada por um formulário.

## 12. Ordem dos middlewares

A ordem de configuração é importante. A sessão deve ser inicializada antes do Passport utilizar os dados armazenados nela.

A sequência será:

1. Middlewares de processamento dos formulários.
2. `express-session`.
3. `passport.initialize()`.
4. `passport.session()`.
5. Rotas de autenticação.
6. Middleware de proteção das demais rotas.
7. Rotas do sistema de filmes.

Essa ordem permite que `/login` seja acessada sem autenticação, enquanto as rotas do sistema ficam protegidas.

## 13. Fluxo completo

1. O usuário acessa uma rota protegida.
2. Se não estiver autenticado, é redirecionado para `/login`.
3. O usuário envia email e senha.
4. O Passport executa a estratégia local.
5. O sistema consulta o usuário e verifica a senha com bcrypt.
6. Se os dados forem válidos, o Passport registra o identificador do usuário na sessão.
7. O navegador recebe o cookie de sessão.
8. Nas requisições seguintes, o Passport recupera o usuário e o disponibiliza em `req.user`.
9. Ao realizar logout, a autenticação e a sessão são encerradas.

## 14. Cuidados de segurança

- Nunca armazene senhas em texto puro.
- Não publique o arquivo `.env`.
- Utilize um segredo longo e aleatório para a sessão.
- Em produção, utilize HTTPS e configure o cookie `secure` adequadamente.
- Proteja as rotas que exigem autenticação.
- Não confunda autenticação com autorização.
