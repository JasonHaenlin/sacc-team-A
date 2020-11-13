const express = require('express');
const router = express.Router();

const UserRouter = require('./user');
const StatsRouter = require('./statistics')

router.use('/user', UserRouter);
router.use('/stats', StatsRouter)

router.get('/', (req, res) => {
    res.json({ name: "hello" });
});

module.exports = router;
