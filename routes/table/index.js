const express = require('express');
const { createTables, deleteTables, clearTables } = require('../../database/models/table');
const { handleExceptions } = require('../../middlewares/error-handlers');
const router = express.Router();

router.post('/create', handleExceptions(async (req, res) => {
    await createTables();
    res.status(200).json('Database created');
}));

router.post('/delete', handleExceptions(async (req, res) => {
    await deleteTables();
    res.status(200).json('Database deleted');
}));

router.post('/clear', handleExceptions(async (req, res) => {
    await clearTables();
    res.status(200).json('Database cleared');
}));

module.exports = router;
