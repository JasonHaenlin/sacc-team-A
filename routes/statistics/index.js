const { handleExceptions } = require("../../middlewares/error-handlers");
const express = require("express");
const router = express.Router();
var statsController = require("../../appengine/controller/StatsController.js");
const { stats, heatmapPubSub } = require("../../middlewares/pub-sub");

const datastore = require('../../database/datastore');
const { ValidationError } = require("joi");

router.get("/simple", handleExceptions(async (req, res) => {
	let valueToReturn;
	console.log(req.query["numberofusers"]);
	if (req.query["numberofusers"] !== undefined) {
		console.log("nkbdgnfksblnkljsnkljibnkji");
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
		stats.publishMessage("numberofpoi24hours");
		//response = statsController.getPoiForLastDay("alexis1953@live.fr");
	} else if (req.query["generateheatmap"] !== undefined) {
		heatmapPubSub.publishMessage("generateheatmap");
		// statsController.generateHeatMap();
	}

	//withoutpubsub
	else {
		statsController.getPoiForLastDay("alexis1953@live.fr");
	}
	res.status(200).json("Request received.");
}));

router.get('/heatmap', handleExceptions(async (req, res) => {
	res.status(200).json(statsController.getMeetingsForHeatmap());
}));

module.exports = router;
