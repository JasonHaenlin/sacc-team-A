const { handleExceptions } = require('../../middlewares/error-handlers');
const validateAdmin = require("../../middlewares/models/admin");
const { addAdmin } = require('../../middlewares/tasks');
const express = require('express');
const router = express.Router();
const adminSQL = require('../../database/models/admin');
const { logTheInfo } = require('../../middlewares/config/logger');

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
    res.status(200).json("Task Sent");
}));

/**
 * Get admins (testing purpose)
 * @param {object} req.body list of admin
 * @param {string} req.body.email email of a user (eg : contact@teamsacca.com)
 */
router.get('/', handleExceptions(async (req, res) => {
    const admins = await adminSQL.getAdmins();
    res.status(200).json(admins);
}));

/**
 * Task to post a new admin
 */
router.post('/task', handleExceptions(async (req, res) => {
    logTheInfo('Received task with payload: %s', req.body);
    await adminSQL.createAdmin(req.body);
    res.status(201).send(`Printed task payload: ${req.body}`);
}));


module.exports = router;
