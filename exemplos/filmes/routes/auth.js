const express = require('express');
const router = express.Router();

const passport = require('../config/passport');
const { naoAutenticado } = require('../middlewares/auth');

router.get('/login', naoAutenticado, (req, res) => {
    res.render('login')
});

router.post('/login', (req, res, next) => {
    passport.authenticate(
        'local',
        (erro, usuario) => {
            if (erro) {
                return next(erro);
            }
            
            if (!usuario) {
                return res.render('login', { erro: 'Email ou senha inválidos' });
            }

            req.login(usuario, (erro) => {
                if (erro) {
                    return next(erro);
                }

                return res.redirect('/');
            });
        })(req, res, next);
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