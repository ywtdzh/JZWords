const Sequelize = require('sequelize');

const ExClass = function (database) {
    return database.define('exClass', {
        name: {type: Sequelize.STRING, allowNull: false, unique: true},
        exp: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
    });
};

module.exports = ExClass;