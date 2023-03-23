const express = require("express");
const blacklistModel = require("../Model/blacklist.model");
const blackListRoute = express.Router();
blackListRoute.get("/", async (req, res) => {
    let blacklistItem = await blacklistModel.find({});
    res.send({ blacklistItem });
})
module.exports = blackListRoute;