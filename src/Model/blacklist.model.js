const { Schema, model } = require("mongoose");

const blacklistSchema = new Schema({
    blackListItem: {
        type: String, require: true
    }
})

const blacklistModel = model("blacklist", blacklistSchema);

module.exports = blacklistModel;