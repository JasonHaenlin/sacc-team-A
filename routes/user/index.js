const { handleExceptions } = require('../../middlewares/error-handlers');
const { ValidationError, NotFoundError } = require('../../middlewares/errors');
const { ensureIsAdmin } = require("../../middlewares/authorization");
const validateUser = require("../../middlewares/models/user");
const express = require('express');
const router = express.Router();

// testing purpose for now
const users = [];

router.get('/', handleExceptions(async (req, res) => {
    res.status(200).json(users);
}));

router.post('/', handleExceptions(async (req, res) => {
    const user = req.body;
    const { error } = validateUser(user);
    if (error) {
        throw new ValidationError(`User does not match schema ${user}`, error);
    }
    users.push(user);
    res.status(201).json(user);
}));

router.put('/:sha1', ensureIsAdmin, handleExceptions(async (req, res) => {
    const sha1 = req.params.sha1
    const user = users.find(u => u.sha1 === sha1);
    if (!user) {
        throw new NotFoundError(`User not found with sha1 ${sha1}`);
    }
    user.userStatusChangeDate = Date.now();
    res.status(200).json(user);
}));

module.exports = router;
