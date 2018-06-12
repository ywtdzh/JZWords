const Router = require('koa-router');
const Operations = require('../controller/index');
const {isNullOrUndefined} = require("util");
const {response} = require('../my-utils/index');
const routerHandlers = require('../controller/index');

const router = new Router();
router
    .get('/hello', async ctx => {
        response(ctx, 200, {str: "hello world"});
    })
    .post('/api/getClassList', routerHandlers.getClassList)
    .post('/api/getClassMember', routerHandlers.getClassMember)
    .post('/api/getDictionary', routerHandlers.getDictonary)
    .post('/api/getItem', routerHandlers.getItem)
    .post('/api/getUserHistory', routerHandlers.getUserHistory)
    .post('/api/getUserInfo', routerHandlers.getUserInfo)
    .post('/api/addClass', routerHandlers.addClass)
    .post('/api/addHistory', routerHandlers.addHistory)
    .post('/api/setClass', routerHandlers.setClass)
    .post('/api/setUserInfo', routerHandlers.setUserInfo);

module.exports = router;