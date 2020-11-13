const { handleExceptions } = require("../../middlewares/error-handlers");
const express = require("express");
const router = express.Router();
var statsController = require("../../appengine/controller/StatsController.js");

router.get(
  "/",
  handleExceptions(async (res) => {
    res.status(200).json(statsController.test());
  })
);

router.get(
  "/numberOfUsers",
  handleExceptions(async (res) => {
    res.status(200).json(statsController.getNumberOfUsers());
  })
);

router.get(
  "/numberOfPoi",
  handleExceptions(async (res) => {
    res.status(200).json(statsController.getNumberOfPoi());
  })
);

module.exports = router;
