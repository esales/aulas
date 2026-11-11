const { Sequelize } = require('sequelize');
require('dotenv').config()

const sequelize = new Sequelize(process.env.URL_BD,
    {
        dialect: 'postgres',
    }
  );

module.exports = sequelize;