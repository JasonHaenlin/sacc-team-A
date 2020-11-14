const { handleExceptions } = require('../../middlewares/error-handlers');
const validateAdmin = require("../../middlewares/models/admin");
const express = require('express');
const router = express.Router();
const adminSQL = require('../../database/models/admin');

/**
 * Post a new admin
 * @param {string} req.body.email email of a suer (eg : contact@teamsacca.com)
 */
router.post('/', handleExceptions(async (req, res) => {
    const admin = req.body;
    const { error } = validateAdmin(admin);
    if (error) {
        throw new ValidationError(`Admin does not match schema ${admin}`, error);
    }
    // TODO : task to add admin here
    await adminSQL.createAdmin(admin);
    res.status(200).json("Task Sent");
}));

/**
 * Get admins (testing purpose)
 * @param {object} req.body list of admin
 * @param {string} req.body.email email of a suer (eg : contact@teamsacca.com)
 */
router.get('/', handleExceptions(async (req, res) => {
    const admins = await adminSQL.getAdmins();
    res.status(200).json(admins);
}));

module.exports = router;
