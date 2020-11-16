const { handleExceptions } = require("../../middlewares/error-handlers");
const express = require("express");
const router = express.Router();
var statsController = require("../../appengine/controller/StatsController.js");
const { stats } = require("../../middlewares/pub-sub");

const datastore = require('../../database/datastore');
const { ValidationError } = require("joi");

router.get("/simple", handleExceptions(async (req, res) => {
	let valueToReturn;
	if (req.query["numberofusers"] !== undefined) {
		valueToReturn = await statsController.getNumberOfUsers();
	} else if (req.query["numberofpoi"] !== undefined) {
		valueToReturn = await statsController.getNumberOfPoi();
	} else {
		throw new ValidationError("Route must have 'numberofusers' or 'numberofpoi' as query");
	}
	res.status(200).json(valueToReturn);
}));

router.get("/complex", handleExceptions(async (req, res) => {
	// with pubsub
	if (req.query["numberofpoi24hours"] !== undefined) {
		stats.publishMessage(req.query["numberofpoi24hours"]);
		//response = statsController.getPoiForLastDay("alexis1953@live.fr");
	}

	//withoutpubsub
	else {
		statsController.getPoiForLastDay("alexis1953@live.fr");
	}
	res.status(200).json("Request received.");
}));

router.get('/heatmap', handleExceptions(async (req, res) => {
	const mettings = await datastore.get('meeting');
	res.status(200).json(mettings.map(metting => {
		return [metting.latitude, metting.longitude];
	}))
}))

module.exports = router;
