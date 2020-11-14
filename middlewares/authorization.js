const { AccessDeniedError } = require("./errors");
const adminSQL = require('../database/models/admin');

module.exports = {
    ensureIsAdmin: async (req, res, next = () => { }) => {
        const auth = req.headers.authorization;
        if (!auth) {
            throw new AccessDeniedError(`No credentials sent!`);
        }
        const admin = await adminSQL.getAdmin(auth);
        if (!admin) {
            throw new AccessDeniedError(`Wrong authentication permission!`);
        }
        next();
    }
}
