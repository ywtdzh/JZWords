const Sequelize = require('sequelize');

const History = function (database) {
    return database.define('history', {
        title: {type: Sequelize.STRING, allowNull: false},
        result: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
        type: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
    });
};

module.exports = History;