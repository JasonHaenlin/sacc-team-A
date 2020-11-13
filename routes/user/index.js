const { handleExceptions } = require('../../middlewares/error-handlers');
const { ValidationError, NotFoundError } = require('../../middlewares/errors');
const { ensureIsAdmin } = require("../../middlewares/authorization");
const { addUserTask } = require("../../middlewares/tasks");
const validateUser = require("../../middlewares/models/user");
const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();
const userSQL = require('../../database/models/user')

// testing purpose for now
const users = [];

/**
 * Get all the users
 * @param {string} req.body.sha1 identify a user (should be a length of 10 using a-zA-Z0-9)
 * @param {string} req.body.email email of a suer (eg : contact@teamsacca.com)
 * @param {number} req.body.userStatusChangeDate date as a timestamp or none if not set
 */
router.get("/", handleExceptions(async (req, res) => {
    userSQL
        .getUser()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
    // res.status(200).json(users);
}));

/**
 * Get all the users
 * @param {string} req.body.sha1 identify a user (should be a length of 10 using a-zA-Z0-9)
 * @param {string} req.body.email email of a suer (eg : contact@teamsacca.com)
 * @param {number} req.body.userStatusChangeDate date as a timestamp or none if not set
 */
router.get('/', handleExceptions(async (req, res) => {
    res.status(200).json(users);
}));

/**
 * Post a new user
 * @param {string} req.body.sha1 identify a user (should be a length of 10 using a-zA-Z0-9)
 * @param {string} req.body.email email of a suer (eg : contact@teamsacca.com)
 * @param {number} req.body.userStatusChangeDate date as a timestamp or none if not set (OPTIONAL)
 */
router.post('/', bodyParser.json(), handleExceptions(async (req, res) => {
    const user = req.body;
    const { error } = validateUser(user);
    if (error) {
        throw new ValidationError(`User does not match schema ${user}`, error);
    }
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

router.delete('/', handleExceptions(async (req, res) => {
    // users.push(user);
    userSQL.deleteAll().then(() => {
        res.status(200).json('success');
    }).catch(err => {
        res.status(400).send(err)
    })
}));

router.post('/task', bodyParser.raw({ type: 'application/octet-stream' }), handleExceptions(async (req, res) => {
    // Log the request payload
    console.log('Received task with payload: %s', req.body);
    res.send(`Printed task payload: ${req.body}`).end();
}));

module.exports = router;
