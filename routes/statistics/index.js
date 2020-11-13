const { handleExceptions } = require("../../middlewares/error-handlers");
const express = require("express");
const router = express.Router();
var statsController = require("../../appengine/controller/StatsController.js");

router.get(
  "/",
  handleExceptions(async (req, res) => {
    let valueToReturn;
    if (req.query["numberofusers"] !== undefined) {
      valueToReturn = await statsController.getNumberOfUsers();
    } else if (req.query["numberofpoi"] !== undefined) {
      valueToReturn = await statsController.getNumberOfPoi();
    } else {
      valueToReturn = statsController.test();
    }
    res.status(200).json(valueToReturn);
  })
);

module.exports = router;
