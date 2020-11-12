const { AccessDeniedError } = require("./errors");

module.exports = {
    ensureIsAdmin(req, res, next = () => { }) {
        if (!req.headers.authorization) {
            throw new AccessDeniedError(`No credentials sent!`);
        }
        next();
    }
}
