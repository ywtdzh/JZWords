const UUID = require('node-uuid');
const {encryptPassword} = require('../my-utils');
let battle, exClass, history, user, word;

// noinspection JSUnresolvedFunction
require('../models').then(database => {
    ({battle, exClass, history, user, word} = database.models);
});

module.exports = {};