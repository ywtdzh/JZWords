const UUID = require('node-uuid');
const {encryptPassword, response} = require('../my-utils');
const {Op, fn} = require('sequelize');
const {chunk, random, ..._} = require('lodash');
let battle, exClass, history, user, word;

// noinspection JSUnresolvedFunction
require('../models').then(database => {
    ({battle, exClass, history, user, word} = database.models);
});

const predicateNotNull = function (value, key) {
    return value === undefined && value === null;
};

async function userInfo(theUser) {
    const theBattles = await battle.findAll({where: {[Op.or]: [{userId: theUser.id}, {opponentId: theUser.id}]}});
    let win = 0, other = 0;
    theBattles.forEach(theBattle => {
        if (theBattle.userId === theUser.id && theBattle.score > theBattle.opponentScore
            || theBattle.opponentId === theUser.id && theBattle.opponentScore > theBattle.score) win++;
        else other++;
    });
    if (win + other === 0) other = 1;
    return {
        nickName: theUser.nickname,
        picUrl: theUser.picUrl,
        expSingle: theUser.expSingle,
        expTwin: theUser.expTwin,
        winRate: win / (win + other),
    };
}

async function getUserByUUID(uuid) {
    return await user.findOne({where: {identifier: uuid}});
}

async function getUserInfo(ctx) {
    const {UUID} = ctx.request.body;
    if (!UUID) {
        response(ctx, 400, new Error("Missing necessary fields"));
        return;
    }
    const theUser = await getUserByUUID(UUID);
    if (!theUser) {
        response(ctx, 401, new Error("User not found"));
        return;
    }
    const theClass = await theUser.getExClass();
    const result = await userInfo(theUser);
    if(theClass) {
        Object.assign(result, {
            classId: theClass.id,
            className: theClass.name,
        });
    }
    response(ctx, 200, result);
}

async function getUserHistory(ctx) {
    const {UUID, startTime, endTime} = ctx.request.body;
    if (!UUID) {
        response(ctx, 400, new Error("Missing necessary fields"));
        return;
    }
    const theUser = await getUserByUUID(UUID);
    if (!theUser) {
        response(ctx, 401, new Error("User not found"));
        return;
    }
    const where = {[Op.and]: []};
    if (startTime) where[Op.and].push({updatedAt: {gt: startTime}});
    if (endTime) where[Op.and].push({updatedAt: {lt: endTime}});
    const histories = await theUser.getHistories({where});
    response(ctx, 200, histories.map(hist => {
        return {
            title: hist.title,
            type: hist.type,
            result: hist.result,
            time: hist.createdAt,
        };
    }));
}

async function getItem(ctx) {
    const {itemNumber, selectNum, level} = ctx.request.body;
    if (!itemNumber || !selectNum) {
        response(ctx, 400, new Error("Missing necessary fields"));
        return;
    }
    if (itemNumber * selectNum > 10000) {
        response(ctx, 400, new Error("Response too large"));
        return;
    }
    let items = await word.findAll({
        order: fn("random"),
        limit: itemNumber * selectNum,
    });
    if (!items.length > 0) {
        response(ctx, 500, new Error("Not enough words found"));
        return;
    }
    items = chunk(items, selectNum);
    items = items.map(item => {
        const result = {
            title: item[0]['sourceForm' + random(1, 2)],
            selector: _.slice(item, 1).map(theWord => theWord.detail),
            right: random(1, selectNum),
        };
        result.selector.splice(result.right - 1, 0, item[0].detail);
        return result;
    });
    response(ctx, 200, items);
}

async function getClassList(ctx) {
    const classes = await exClass.findAll();
    response(ctx, 200, classes.map(cla => {
        return {name: cla.name, exp: cla.exp, id: cla.id};
    }));
}

async function getClassMember(ctx) {
    const {id, name} = ctx.request.body;
    if (!id && !name) {
        response(ctx, 400, new Error("Missing necessary params"));
        return;
    }
    let theClass;
    if (id) theClass = await exClass.findById(id);
    else theClass = await exClass.findOne({where: {name}});
    if (!theClass) {
        response(ctx, 400, new Error("The class doesn't exist"));
        return;
    }
    const users = await theClass.getUsers(), result = [];
    for (const theUser of users) {
        result.push(await userInfo(theUser));
    }
    response(ctx, 200, result);
}

async function getDictonary(ctx) {
    const {word} = ctx.request.body;
    const theWord = await word.findOne({
        where: {
            [Op.or]:
                [{sourceForm1: word}, {sourceForm2: word}, {header: word}]
        }
    });
    if (!theWord) {
        response(ctx, 400, new Error("The word doesn't exist"));
        return;
    }
    response(ctx, 200, {translation: theWord.detail});
}

async function setUserInfo(ctx) {
    const {UUID, expSingle, expTwin, classId, nickName, picUrl} = ctx.request.body;
    if (!UUID) {
        response(ctx, 400, new Error("Missing necessary field UUID"));
        return;
    }
    const theUser = await user.findOne({where: {identifier: UUID}});
    if (theUser) {
        await theUser.update(_.omitBy({
            expSingle,
            expTwin,
            nickname: nickName,
            picUrl,
            exClassId: classId,
        }, predicateNotNull));
    } else {
        await user.create(_.omitBy({
            identifier: UUID,
            expSingle,
            expTwin,
            nickname: nickName,
            picUrl,
            exClassId: classId,
        }, predicateNotNull));
    }
    response(ctx, 200, "success");
}

async function addHistory(ctx) {
    const {UUID, result, title, type} = ctx.request.body;
    if (!UUID || !result || !title) {
        response(ctx, 400, new Error("Missing necessary fields"));
        return;
    }
    const theUser = await getUserByUUID(UUID);
    if (!theUser) {
        response(ctx, 401, new Error("User not found"));
        return;
    }
    await theUser.createHistory(_.omitBy({
        result,
        title,
        type,
    }, predicateNotNull));
    response(ctx, 200, "success");
}

async function addClass(ctx) {
    const {name, exp} = ctx.request.body;
    try {
        await exClass.create(_.omitBy({
            name,
            exp: exp || 0,
        }, predicateNotNull));
    } catch (e) {
        response(ctx, 400, e);
        return;
    }

    response(ctx, 200, "success");
}

async function setClass(ctx) {
    const {name, exp, id} = ctx.request.body;
    const theClass = await exClass.findById(id);
    if (!theClass) {
        response(ctx, 400, new Error("Class doesn't exist"));
        return;
    }
    try {
        await theClass.update(_.omitBy({
            name,
            exp,
        }, predicateNotNull));
    } catch (e) {
        response(ctx, 400, e);
        return;
    }
    response(ctx, 200, "success");
}

module.exports = {
    getClassList,
    getClassMember,
    getDictonary,
    getItem,
    getUserHistory,
    getUserInfo,
    addClass,
    addHistory,
    setClass,
    setUserInfo,
};