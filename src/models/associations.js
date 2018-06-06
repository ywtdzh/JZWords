module.exports = function (database) {
    const {battle, exClass, history, user} = database.models;
    user.belongsToMany(user, {as: "opponent", through: {model: battle}});
    user.belongsTo(exClass);
    exClass.hasMany(user);
    user.hasMany(history);
    history.belongsTo(user);
};