# Exemplo: Autenticação no projeto de filmes

Neste exemplo, vamos incorporar autenticação ao projeto de filmes desenvolvido anteriormente com Express, Handlebars e Sequelize.

A ideia é preservar as rotas e as views de filmes, diretores e artistas. Porém, elas só poderão ser acessadas por um usuário autenticado.

---

## 1. Bibliotecas utilizadas

A implementação utiliza as seguintes bibliotecas, que já estão instaladas no projeto:

- `bcrypt`
- `connect-sqlite3`
- `dotenv`
- `express-session`
- `passport`
- `passport-local`
- `sqlite`

Não é necessário reinstalar as bibliotecas caso elas já estejam disponíveis no projeto.

## 2. Estrutura do projeto

Além dos arquivos já existentes no projeto de filmes, serão adicionados ():

```text
projeto/
│
├── app.js
├── .env
├── criarUsuario.js
│
├── config/
│   ├── bdSessao.js
│   └── passport.js
│
├── middlewares/
│   └── auth.js
│
├── models/
│   └── usuario.model.js
│
├── routes/
│   └── auth.js
│   └── index.js
│
└── views/
    └── home.handlebars
    └── login.handlebars
```

Os arquivos de filmes, diretores e artistas permanecem como estão. O arquivo `config/bd.js` também será mantido: o model `Usuario` utilizará a mesma instância do Sequelize.

O arquivo `sessions.sqlite` será criado durante a execução e armazenará as sessões. Ele não precisa ser versionado.

## 3. Configurando as variáveis de ambiente

No arquivo `.env`, adicione a variável utilizada para assinar os cookies de sessão:

```env
SESSION_SECRET=uma-chave-longa-e-aleatoria
```

Se o projeto já possui outras variáveis nesse arquivo, preserve-as.

O valor apresentado é apenas um exemplo. Utilize um segredo próprio e não o publique no GitHub.

Confira se o `.gitignore` contém:

```gitignore
node_modules/
.env
sessions.sqlite
```

## 4. Criando o model Usuario

Crie o arquivo `models/usuario.model.js`:

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Usuario = sequelize.define('Usuario', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Usuario;
```

O model possui três atributos:

- `nome`: nome do usuário.
- `email`: endereço utilizado para realizar o login.
- `senha`: armazenará o hash gerado pelo bcrypt, e não a senha original.

O atributo `unique` impede que dois usuários sejam cadastrados com o mesmo email.

<!-- Observe que o model importa `config/bd.js`, já existente no projeto. Não crie uma segunda conexão com o banco de dados. -->

## 5. Configurando o armazenamento das sessões

Crie o arquivo `config/bdSessao.js`:

```javascript
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const sessionStore = new SQLiteStore({
    db: 'sessions.sqlite',
    dir: './'
});

module.exports = sessionStore;
```

O armazenamento utiliza SQLite para manter as sessões entre reinicializações do servidor.

Esse arquivo é independente do banco utilizado pelo Sequelize para armazenar os dados do sistema.

## 6. Configurando o Passport

Crie o arquivo `config/passport.js`:

```javascript
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario.model');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'senha'
        },
        async (email, senha, done) => {
            try {
                const usuario = await Usuario.findOne({
                    where: { email }
                });

                if (!usuario) {
                    return done(null, false, {
                        message: 'Usuário não encontrado'
                    });
                }

                const senhaValida = await bcrypt.compare(
                    senha,
                    usuario.senha
                );

                if (!senhaValida) {
                    return done(null, false, {
                        message: 'Senha incorreta'
                    });
                }

                return done(null, usuario);

            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const usuario = await Usuario.findByPk(id);
        done(null, usuario || false);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
```

A estratégia foi configurada para receber os campos `email` e `senha`.

Primeiro, o Passport procura o usuário pelo email. Se encontrar, o bcrypt compara a senha informada com o hash armazenado.

Se as credenciais forem válidas, `done(null, usuario)` informa ao Passport que a autenticação foi bem-sucedida.

A função `serializeUser` determina que o identificador do usuário será armazenado na sessão. Em requisições posteriores, `deserializeUser` utiliza esse identificador para recuperar o usuário. O objeto recuperado fica disponível em `req.user`.

## 7. Criando os middlewares de autenticação

Crie o arquivo `middlewares/auth.js`:

```javascript
function autenticado(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

function naoAutenticado(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    next();
}

module.exports = {
    autenticado,
    naoAutenticado
};
```

O middleware `autenticado` será utilizado para proteger as rotas do sistema.

O middleware `naoAutenticado` será utilizado na página de login. Assim, um usuário que já está autenticado será redirecionado para a página inicial.

## 8. Criando as rotas de autenticação

Crie o arquivo `routes/auth.js`:

```javascript
const express = require('express');
const router = express.Router();

const passport = require('../config/passport');
const { naoAutenticado } = require('../middlewares/auth');

router.get('/login', naoAutenticado, (req, res) => {
    res.render('usuarios/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate(
        'local',
        (erro, usuario) => {
            if (erro) {
                return next(erro);
            }

            if (!usuario) {
                return res.render('usuarios/login', {
                    erro: 'Email ou senha inválidos'
                });
            }

            req.login(usuario, (erro) => {
                if (erro) {
                    return next(erro);
                }

                return res.redirect('/usuarios');
            });
        }
    )(req, res, next);
});

router.post('/logout', (req, res, next) => {
    req.logout((erro) => {
        if (erro) {
            return next(erro);
        }

        req.session.destroy((erro) => {
            if (erro) {
                return next(erro);
            }

            res.clearCookie('sid');
            res.redirect('/login');
        });
    });
});

module.exports = router;
```

### 8.1. GET /login

Exibe o formulário de login. O middleware `naoAutenticado` impede que um usuário já autenticado acesse novamente essa página.

### 8.2. POST /login

Recebe as credenciais e executa a estratégia `local`.

Se as credenciais forem inválidas, a página de login será renderizada novamente com uma mensagem de erro.

Se forem válidas, `req.login()` estabelece a autenticação do usuário na sessão. Em seguida, o navegador é redirecionado para `/usuarios`.

### 8.3. POST /logout

Encerra a autenticação utilizando `req.logout()`. Depois, a sessão é destruída e o cookie `sid` é removido do navegador.

O nome `sid` precisa corresponder ao nome configurado no `express-session`.

---

Crie o arquivo `routes/index.js`:

```javascript
const express = require('express');
const router = express.Router();
const Filme = require('../models/filme.model');
const Diretor = require('../models/diretor.model');
const Artista = require('../models/artista.model');

const { autenticado } = require('../middlewares/auth');

router.use(autenticado);

//...
//TODAS AS ROTAS DE FILMES, ARTISTAS E DIRETORES
//...

module.exports = router;
```

Neste arquivo ficarão todas as rotas de artistas, diretores e filmes.

Essas rotas só poderão ser acessadas se o usuário estiver logado. Essa verificação é feita através do middleware `autenticado`.

## 9. Criando as views

Crie a pasta `views/usuarios`.

### 9.1. Formulário de login

Crie `views/login.handlebars`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
</head>
<body>

    <h1>Login</h1>

    {{#if erro}}
        <p>{{erro}}</p>
    {{/if}}

    <form action="/login" method="POST">

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>

        <br>

        <label for="senha">Senha:</label>
        <input type="password" id="senha" name="senha" required>

        <br>

        <button type="submit">Entrar</button>

    </form>

</body>
</html>
```

Os nomes `email` e `senha` precisam corresponder aos campos configurados na `LocalStrategy`.

### 9.2. Página do usuário autenticado

Crie `views/usuarios/home.handlebars`:

```html
<h1>{{titulo}}</h1>

<p>Bem-vindo ao sistema de filmes.</p>
<p>Usuário: {{usuario.nome}}</p>

<form action="/logout" method="POST">
    <button type="submit">Logout</button>
</form>

<a href="/filmes">
  Filmes
</a><br>

<a href="/diretores">
  Diretores
</a><br>

<a href="/artistas">
  Artistas
</a><br>
```

A tela principal passa a exibir o nome do usuário logado e o botão para realizar o **logout**.

## 10. Integrando a autenticação ao app.js do projeto de filmes

Agora vamos alterar o `app.js` que já existe no projeto.

### 10.1. Incluindo os imports

No início do `app.js`, mantenha os imports existentes e acrescente os relacionados à autenticação:

```javascript
require('dotenv').config();

const session = require('express-session');
const sessionStore = require('./config/bdSessao');
const passport = require('./config/passport');

const { autenticado } = require('./middlewares/auth');
```

Retire os imports (serão movidos para /routes/index.js):

```javascript
const Filme = require('./models/filme.model');
const Diretor = require('./models/diretor.model');
const Artista = require('./models/artista.model');
```

<!-- O import de `passport` carrega a configuração da estratégia e, consequentemente, o model `Usuario`. Assim, ele também será registrado no Sequelize antes de `sequelize.sync()`. -->

### 10.2. Configurando os middlewares

Depois de criar a aplicação (`const app = express();`), mantenha os middlewares já existentes:

```javascript
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
```

Mantenha a configuração do Handlebars que já existe no projeto:

```javascript
app.engine('handlebars', exphbs.engine({
    defaultLayout: false,
    helpers: {
        eq: function (v1, v2) {
            return v1 == v2;
        }
    }
}));

app.set('view engine', 'handlebars');
```

Em seguida, configure a sessão:

```javascript
app.use(session({
    name: 'sid',
    store: sessionStore,
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

Inicialize o Passport depois da sessão:

```javascript
app.use(passport.initialize());
app.use(passport.session());
```

Por fim, disponibilize o usuário autenticado nas views:

```javascript
app.use((req, res, next) => {
    res.locals.usuario = req.user || null;
    next();
});
```

Com isso, as views Handlebars poderão acessar a variável `usuario` sem que seja necessário enviá-la manualmente em cada `res.render()`.

### 10.3. Registrando as rotas e protegendo o sistema

A ordem abaixo é importante. Registre as rotas de autenticação **antes** do middleware `autenticado`:

```javascript
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/index'));
```

A primeira linha permite acessar `/login` e `/logout`. A segunda faz com que as rotas registradas depois dela exijam autenticação.

### 10.4. Removendo as rotas do projeto de filmes

As rotas de home, diretores, artistas e filmes devem ser movidas para o arquivo /routes/index.js.

### 10.5. Sincronização e inicialização

Mantenha a função `conectarBD()` e a chamada `app.listen()` existentes no final do arquivo.

A sincronização deve acontecer depois que os models de filmes, diretores, artistas e usuários tiverem sido carregados. Como `config/passport.js` importa o model `Usuario`, isso já ocorre com os imports apresentados.

A estrutura geral do `app.js` ficará assim:

```javascript
// Variáveis de ambiente e imports
require('dotenv').config();

const express = require('express');
const exphbs = require('express-handlebars');
const sequelize = require('./config/bd');

require('./models/relacionamentosModels');

const methodOverride = require('method-override');

const session = require('express-session');
const sessionStore = require('./config/bdSessao');
const passport = require('./config/passport');
const { autenticado } = require('./middlewares/auth');

const app = express();

// Middlewares já existentes
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração Handlebars já existente
app.engine('handlebars', exphbs.engine({
    defaultLayout: false,
    helpers: {
        eq: function (v1, v2) {
            return v1 == v2;
        }
    }
}));
app.set('view engine', 'handlebars');

// Sessão
app.use(session({
    name: 'sid',
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax'
    }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Disponibiliza o usuário nas views
app.use((req, res, next) => {
    res.locals.usuario = req.user || null;
    next();
});

// Rotas de autenticação
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/index'));

// Mantenha a função conectarBD(), sequelize.sync()
// e app.listen() que já existem no projeto.
```

## 11. Testando a aplicação

Depois de realizar as alterações:

1. Inicie o servidor.
2. Acesse `http://localhost:3000`.
3. Verifique se o sistema redireciona para `/login`.
4. Tente acessar diretamente `/filmes`, `/diretores` e `/artistas`.
5. Faça login com um usuário cadastrado.
6. Verifique se o acesso às páginas do sistema foi liberado.
7. Acesse `/usuarios` e confira os dados do usuário.
8. Faça logout.
9. Tente acessar novamente uma rota protegida.

As rotas de autenticação precisam ser registradas antes do middleware `autenticado`. Caso contrário, o próprio login também será protegido e o usuário não conseguirá entrar.

## 12. Criando um usuário para teste

Para testar o login, é necessário que exista pelo menos um usuário cadastrado no banco de dados.

Crie temporariamente o arquivo `criarUsuario.js` na raiz do projeto:

```javascript
require('dotenv').config();

const bcrypt = require('bcrypt');
const sequelize = require('./config/bd');
const Usuario = require('./models/usuario.model');

async function criarUsuario() {
    try {
        await sequelize.sync();

        const senhaHash = await bcrypt.hash('123456', 10);

        await Usuario.create({
            nome: 'Administrador',
            email: 'admin@teste.com',
            senha: senhaHash
        });

        console.log('Usuário criado com sucesso!');
    } catch (erro) {
        console.error('Erro ao criar usuário:', erro);
    } finally {
        await sequelize.close();
    }
}

criarUsuario();
```

Execute o script uma única vez:

```bash
node criarUsuario.js
```

O usuário de teste será:

- Email: `admin@teste.com`
- Senha: `123456`

**Importante:** esse script é provisório e serve apenas para criar um usuário inicial durante o desenvolvimento. Ele não deve ser utilizado como mecanismo definitivo de cadastro de usuários. Depois de criar a conta, o arquivo pode ser removido.
