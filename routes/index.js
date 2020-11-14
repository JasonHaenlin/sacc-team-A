const express = require('express');
const router = express.Router();

const UserRouter = require('./user');
const StatsRouter = require('./statistics')
const MeetingRouter = require('./meeting')
const AdminRouter = require('./admin');

router.use('/user', UserRouter);
router.use('/stats', StatsRouter);
router.use('/meeting', MeetingRouter);
router.use('/admin', AdminRouter);

router.get('/', (req, res) => {
    res.json({ name: "hello" });
});

module.exports = router;
