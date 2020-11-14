const express = require('express');
const router = express.Router();

const UserRouter = require('./user');
const StatsRouter = require('./statistics')
const MeetingRouter = require('./meeting')
const AdminRouter = require('./admin');
const TableRouter = require('./table');

router.use('/user', UserRouter);
router.use('/stats', StatsRouter);
router.use('/meeting', MeetingRouter);
router.use('/admin', AdminRouter);
router.use('/table', TableRouter);

router.get('/', (req, res) => {
    res.json({ name: "hello" });
});

module.exports = router;
