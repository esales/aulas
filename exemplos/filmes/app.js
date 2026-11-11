require('dotenv').config()
const express = require('express');
const exphbs = require('express-handlebars');
const sequelize = require('./config/bd');
const methodOverride = require('method-override');
require('./models/relacionamentosModels');
const session = require('express-session')
const sessionStore = require('./config/bdSessao')
const passport = require('./config/passport')

const app = express();

app.use(session({
    name: 'sid',
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax',
    },
}
));

app.use(methodOverride('_method'));

// Middleware para formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurando Handlebars
app.engine('handlebars', exphbs.engine({
  defaultLayout: false,
  helpers: {
      eq: function (v1, v2) {
        return v1 == v2; 
      }
  }
}));

app.set('view engine', 'handlebars');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.usuario = req.user || null;
    next();
});

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/index'));

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