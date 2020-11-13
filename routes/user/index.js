const { handleExceptions } = require('../../middlewares/error-handlers');
const { ValidationError, NotFoundError } = require('../../middlewares/errors');
const { ensureIsAdmin } = require("../../middlewares/authorization");
const validateUser = require("../../middlewares/models/user");
const express = require('express');
const router = express.Router();
const userSQL = require('../../database/models/user')

// testing purpose for now
const users = [];

router.get('/', handleExceptions(async (req, res) => {
    userSQL.getUser().then(users => {
        res.status(200).json(users);
    }).catch(err => {
        res.status(400).send(err)
    })
    // res.status(200).json(users);
}));

router.post('/', handleExceptions(async (req, res) => {
    const user = req.body;
    const { error } = validateUser(user);
    if (error) {
        throw new ValidationError(`User does not match schema ${user}`, error);
    }
    // users.push(user);
    userSQL.createUser(user).then(resUser => {
        res.status(201).json(resUser);
    }).catch(err => {
        res.status(400).send(err)
    })
}));

router.put('/:sha1', ensureIsAdmin, handleExceptions(async (req, res) => {
    const sha1 = req.params.sha1
    const user = await userSQL.getUserSha1(sha1);
    if (!user) {
        throw new NotFoundError(`User not found with sha1 ${sha1}`);
    }
    user.user_status_change_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    userSQL.putUser(sha1, user).then(resUser => {
        res.status(201).json(resUser);
    }).catch(err => {
        res.status(400).send(err)
    })
}));

module.exports = router;
