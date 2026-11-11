require('dotenv').config();

const bcrypt = require('bcrypt');
const sequelize = require('./config/bd');
const Usuario = require('./models/usuario.model');

async function criarUsuario() {
    try {
        const senhaHash = await bcrypt.hash('123456', 10);

        await Usuario.create({
            nome: 'Administrador',
            email: 'admin@teste.com',
            senha: senhaHash
        });

        console.log('Usuário criado com sucesso!');

    } catch (erro) {
        console.error(erro);
    } finally {
        await sequelize.close();
    }
}

criarUsuario();