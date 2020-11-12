const express = require('express')
const router = express.Router();
var statsController =  require("../../appengine/controller/StatsController.js")


router.get('/',(req,res)=>{
    res.json(statsController.test());
})

module.exports = router;
