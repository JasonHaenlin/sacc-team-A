const express = require('express');
const router = express.Router();

const UserRouter = require('./user');
const StatsRouter = require('./statistics')
const MeetingRouter = require('./meeting')

router.use('/user', UserRouter);
router.use('/stats', StatsRouter)
router.use('/meeting', MeetingRouter)

router.get('/', (req, res) => {
    res.json({ name: "hello" });
});

module.exports = router;
