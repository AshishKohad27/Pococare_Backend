const { Schema, model } = require("mongoose");

const authSchema = new Schema({
    email: {
        type: String, unique: true, require: true
    },
    password: {
        type: String, require: true
    }
})

const authModel = model("auth", authSchema);

module.exports = authModel;