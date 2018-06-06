const Koa = require('koa');
const BodyParser = require('koa-bodyparser');

const config = require('../config');
const myUtils = require('./my-utils');
const router = require('./router');

const app = new Koa();
app.keys = config.appKeys;
(async () => {
    // load models
    await require('./models');
    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (e) {
            myUtils.response(ctx, 500, e, "Unknown Server Error");
        }
    });

    app.use(require('koa2-cors')());

    // ctx.request.body is confirmed
    // noinspection JSUnusedGlobalSymbols
    app.use(BodyParser({
        onerror(err, ctx) {
            myUtils.response(ctx, 400, err, "Request unparsable");
        }
    }));

    // register routes
    // noinspection JSUnresolvedFunction
    app
        .use(router.routes())
        .use(router.allowedMethods());

    app.listen(config.server.port);
})();

