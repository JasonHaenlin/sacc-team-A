const { handleExceptions } = require("../../middlewares/error-handlers");
const express = require("express");
const router = express.Router();
var statsController = require("../../appengine/controller/StatsController.js");

router.get('/',(req,res)=>{
    console.log("ok");
    res.json(statsController.getComplexStats("alexis1953@live.fr"));
});

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
