const Sequelize = require('sequelize');

const User = function (database) {
    return database.define('user', {
        identifier: {type: Sequelize.STRING, allowNull: false, unique: true},
        nickname: {type: Sequelize.STRING},
        picUrl: {type: Sequelize.STRING},
        expSingle: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
        expTeam: {type: Sequelize.INTEGER, allowNull: false, defaultValue: 0},
    });
};

module.exports = User;
