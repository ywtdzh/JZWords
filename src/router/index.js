const Router = require('koa-router');
const Operations = require('../controller/index');
const {isNullOrUndefined} = require("util");
const {response} = require('../my-utils/index');

const router = new Router();
router
    .get('/hello', async ctx=> {
        response(ctx, 200, {str:"hello world"});
    });

module.exports = router;