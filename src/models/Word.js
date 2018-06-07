const Sequelize = require('sequelize');

const Word = function (database) {
    return database.define('word', {
        sourceForm1: {type: Sequelize.STRING, allowNull: false},
        sourceForm2: {type: Sequelize.STRING, allowNull: false},
        detail: {type: Sequelize.STRING, allowNull: false},
        header: {type: Sequelize.STRING, allowNull: false},
        simple: {type: Sequelize.STRING, allowNull: false},
        type: {type: Sequelize.STRING, allowNull: false},
    });
};

module.exports = Word;
