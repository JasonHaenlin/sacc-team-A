const { handleExceptions } = require('../../middlewares/error-handlers');
const validateAdmin = require("../../middlewares/models/admin");
const express = require('express');
const router = express.Router();

/**
 * Post a new admin
 * @param {string} req.body.email email of a suer (eg : contact@teamsacca.com)
 */
router.post('/', handleExceptions(async (req, res) => {
    const admin = req.body;
    const { error } = validateUser(admin);
    if (error) {
        throw new ValidationError(`Admin does not match schema ${admin}`, error);
    }
    // TODO : task to add admin here
    res.status(200).json("Task Sent");
}));

module.exports = router;
