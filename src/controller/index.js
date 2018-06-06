const UUID = require('node-uuid');
const {encryptPassword} = require('../my-utils');
let battle, exClass, history, user;

require('../models').then(database => {
    ({battle, exClass, history, user} = database.models);
});

module.exports = {};