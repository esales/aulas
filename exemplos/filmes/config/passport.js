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
                const usuario = await Usuario.findOne({ where: { email } });
                
                if (!usuario) {
                    return done(null, false, { message: 'Usuário não encontrado' });
                }

                const senhaValida = await bcrypt.compare(senha, usuario.senha);

                if (!senhaValida) {
                    return done(null, false, { message: 'Senha incorreta' });
                }

                return done(null, usuario);
            } catch (error) {
                return done(error);
            }
        }
));

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