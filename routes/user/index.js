const { handleExceptions } = require('../../middlewares/error-handlers');
const { ValidationError } = require('../../middlewares/errors');
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

router.put('/', handleExceptions(async (req, res) => {
    // TODO
    res.status(200).json(data);
}));

module.exports = router;
