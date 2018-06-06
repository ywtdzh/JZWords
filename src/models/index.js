const Sequelize = require('sequelize');
const myUtils = require('../my-utils');
const associate = require('./associations');
const Path = require('path');
const database = new Sequelize('jz_word', 'jz_word_user', '52%#fwe82', {
    host: 'postgres',
    dialect: 'postgres',
});

module.exports = (async () => {
    await myUtils.autoImport(defineModel => defineModel(database), ["index.js", "associations.js"], Path.resolve('./models'))
        .catch(e => {
            console.error("AutoImport Error\n", e);
            process.exit(1);
        });
    associate(database);
    return await database.sync();
})();

