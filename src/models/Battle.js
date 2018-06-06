const Sequelize = require('sequelize');

const Battle = function (database) {
    return database.define('battle', {
        score: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
        exp: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
        opponentScore: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
        opponentExp: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
    });
};

module.exports = Battle;