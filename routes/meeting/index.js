const { handleExceptions } = require('../../middlewares/error-handlers');
const { ValidationError } = require('../../middlewares/errors');
const { addMeeting } = require('../../middlewares/tasks');
const validateMeeting = require("../../middlewares/models/meeting");
const express = require('express');
const router = express.Router();
const datastore = require('../../database/datastore');
const { logTheInfo } = require('../../middlewares/config/logger');

router.get('/', handleExceptions(async (req, res) => {
    const meetings = await datastore.get("meeting");
    res.status(200).json(meetings);
}));

/**
 * Create a new meeting point
 * @param {string} req.body.u1sha1 identify a user (should be a length of 10 using a-zA-Z0-9)
 * @param {string} req.body.u2sha1 identify a user (should be a length of 10 using a-zA-Z0-9)
 * @param {number} req.body.latitude coordinate latitude of the meeting
 * @param {number} req.body.longitude coordinate longitude of the meeting
 * @param {date} req.body.timestamp date as a timestamp or none if not set
 */
router.post('/', handleExceptions(async (req, res) => {
    const meeting = req.body;
    const { error } = validateMeeting(meeting);
    if (error) {
        throw new ValidationError(`Meeting does not match schema ${JSON.stringify(meeting)}`, error);
    }
    addMeeting.createTask(meeting);
    res.status(200).json("Task Sent");
}));

/**
 * Task to post a new meeting
 */
router.post('/task', handleExceptions(async (req, res) => {
    logTheInfo(`Received task with payload: ${JSON.stringify(req.body)}`);
    req.body.timestamp = new Date();
    const meeting = await datastore.save("meeting", req.body);
    res.status(201).send(`Printed task payload: ${JSON.stringify(meeting)}`).end();

}));

router.delete('/', handleExceptions(async (req, res) => {
    await datastore.removeAll();
    res.status(200).send("success")
}));

module.exports = router;
