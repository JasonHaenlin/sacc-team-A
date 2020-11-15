const { handleExceptions } = require("../../middlewares/error-handlers");
const express = require("express");
const router = express.Router();
var statsController = require("../../appengine/controller/StatsController.js");

const datastore = require('../../database/datastore');

router.get("/", handleExceptions(async (req, res) => {
	let valueToReturn;
	if (req.query["numberofusers"] !== undefined) {
		valueToReturn = await statsController.getNumberOfUsers();
	} else if (req.query["numberofpoi"] !== undefined) {
		valueToReturn = await statsController.getNumberOfPoi();
	} else {
		valueToReturn = statsController.getComplexStats("alexis1953@live.fr");
	}
	res.status(200).json(valueToReturn);
}));

router.get('/heatmap', handleExceptions(async (req, res) => {
	const mettings = await datastore.get('meeting')
	res.status(200).json(mettings.map(metting => {
		return [metting.latitude, metting.longitude]
	}))
}))

module.exports = router;
