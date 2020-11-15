const { handleExceptions } = require('../../middlewares/error-handlers');
const { ValidationError, NotFoundError } = require('../../middlewares/errors');
const { ensureIsAdmin } = require("../../middlewares/authorization");
const { addUser, updateUserPoi } = require("../../middlewares/tasks");
const { logTheInfo } = require('../../middlewares/config/logger');
const validateUser = require("../../middlewares/models/user");
const express = require('express');
const router = express.Router();
const userSQL = require('../../database/models/user');

/**
 * Get all the users
 * @param {string} req.body.sha1 identify a user (should be a length of 10 using a-zA-Z0-9)
 * @param {string} req.body.email email of a suer (eg : contact@teamsacca.com)
 * @param {number} req.body.user_status_change_date date as a timestamp or none if not set
 */
router.get("/", handleExceptions(async (req, res) => {
    const users = await userSQL.getUser();
    res.status(200).json(users);
}));

/**
 * Post a new user
 * @param {string} req.body.sha1 identify a user (should be a length of 10 using a-zA-Z0-9)
 * @param {string} req.body.email email of a suer (eg : contact@teamsacca.com)
 * @param {number} req.body.user_status_change_date date as a timestamp or none if not set (OPTIONAL)
 */
router.post('/', handleExceptions(async (req, res) => {
    const user = req.body;
    const { error } = validateUser(user);
    if (error) {
        throw new ValidationError(`User does not match schema ${user}`, error);
    }
    addUser.createTask(user);
    res.status(200).json("Task Sent");
}));

/**
 * Update the POI of a user
 * @param {string} header.authorization should be the mail of an admin
 * @param {params} req.params.user_status_change_date date as a timestamp or none if not set
 */
router.put('/:sha1', handleExceptions(ensureIsAdmin), handleExceptions(async (req, res) => {
    const sha1 = req.params.sha1
    const user = await userSQL.getUserSha1(sha1);
    if (!user) {
        throw new NotFoundError(`User not found with sha1 ${sha1}`);
    }
    user.user_status_change_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    updateUserPoi.createTask(user);
    res.status(200).json("Task Sent");
}));

/**
 * Delete all Users
 */
router.delete('/', handleExceptions(async (req, res) => {
    await userSQL.deleteAll();
    res.status(200).json('Deleted');
}));

/**
 * Task to post a new user
 */
router.post('/task', handleExceptions(async (req, res) => {
    logTheInfo(`Received task with payload: ${req.body}`);
    await userSQL.createUser(req.body);
    res.status(201).send(`Printed task payload: ${req.body}`);
}));

/**
 * Task to update a user poi
 */
router.put('/task/poi', handleExceptions(async (req, res) => {
    logTheInfo(`Received task with payload: ${req.body} with sha1 ${req.body.sha1}`);
    const model = await userSQL.putUser(req.body.sha1, req.body);
    res.status(200).send(`Printed task payload: ${model}`);
}));

module.exports = router;
