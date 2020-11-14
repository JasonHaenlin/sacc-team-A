const { handleExceptions } = require('../../middlewares/error-handlers');
const { ValidationError } = require('../../middlewares/errors');
const { addMeeting } = require('../../middlewares/tasks');
const validateMeeting = require("../../middlewares/models/meeting");
const express = require('express');
const router = express.Router();
const datastore = require('../../database/datastore')

router.get('/', handleExceptions(async (req, res) => {
    const meetings = await datastore.get("meeting");
    res.status(200).json(meetings);
}));

router.post('/', handleExceptions(async (req, res) => {
    const meeting = req.body;
    const { error } = validateMeeting(meeting);
    if (error) {
        throw new ValidationError(`Meeting does not match schema ${meeting}`, error);
    }
    addMeeting.createTask(meeting);
    res.status(200).json("Task Sent");
}));

/**
 * Task to post a new meeting
 */
router.post('/task', handleExceptions(async (req, res) => {
    const meeting = req.body;
    logTheInfo('Received task with payload: %s', meeting);
    meeting.timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const meeting = await datastore.save("meeting", meeting);
    res.status(201).send(`Printed task payload: ${meeting}`).end();

}));

module.exports = router;
