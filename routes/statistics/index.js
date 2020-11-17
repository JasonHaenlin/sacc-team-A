const { handleExceptions } = require("../../middlewares/error-handlers");
const express = require("express");
const router = express.Router();
var statsController = require("../../appengine/controller/StatsController.js");
const { stats, heatmapPubSub } = require("../../middlewares/pub-sub");

const { ValidationError } = require("joi");
const { ensureIsAdmin } = require("../../middlewares/authorization");



router.get("/simple", handleExceptions(ensureIsAdmin), handleExceptions(async (req, res) => {
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

router.get("/complex", handleExceptions(ensureIsAdmin), handleExceptions(async (req, res) => {
	const email = req.headers.authorization;
	if (req.query["numberofpoi24hours"] !== undefined) {
		stats.publishMessage(email);
	} else if (req.query["generateheatmap"] !== undefined) {
		heatmapPubSub.publishMessage(email);
	}
	else {
		throw new ValidationError("Route must have 'numberofpoi24hours' or 'generateheatmap' as query");
	}
	res.status(200).json("Request received.");
}));

router.get('/heatmap', handleExceptions(async (req, res) => {
	const meetings = await statsController.getMeetingsForHeatmap();
	res.status(200).json(meetings[0].meeting);
}));

module.exports = router;
