const fs = require('fs');
const Crypto = require('crypto');
const Path = require('path');

async function autoImport(callback, excludeNames = [], dir = Path.resolve('.')) {
    const paths = await new Promise(resolve => {
        fs.readdir(dir, (err, files) => {
            if (err) throw err;
            else resolve(files.filter(name => !excludeNames.includes(name)).map(name => `${dir}/${name}`));
        });
    });
    for (const path of paths) {
        const stats = await new Promise(resolve => {
            fs.lstat(path, (err, stats) => {
                if (err) throw err;
                resolve(stats);
            });
        });
        if (stats.isDirectory())
            await autoImport(callback, excludeNames, path);
        else
            callback(require(path));
    }

}

function response(ctx, status, payload) {
    status = parseInt(status.toString());
    if (isNaN(status)) throw new Error("Invalid Argument: status should be a number");
    const response = {};
    if (status === 0 || status === 200)
        response.data = payload;
    else {
        response.err = payload && payload.toString();
        console.error(payload);
    }
    ctx.status = status || 200;
    ctx.body = JSON.stringify(response);
}

function encryptPassword(username, password, salt) {
    const passwordMd5 = Crypto.createHash('md5'), usernameSha1 = Crypto.createHash('sha1');
    passwordMd5.update(password);
    usernameSha1.update(username);
    const shaSum = Crypto.createHash('sha256');
    shaSum.update(passwordMd5.digest('hex'));
    shaSum.update(salt);
    shaSum.update(usernameSha1.digest('utf-8'));
    return shaSum.digest('hex');
}

module.exports = {
    autoImport,
    response,
    encryptPassword,
};