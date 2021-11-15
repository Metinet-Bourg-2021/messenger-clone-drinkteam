const Mongoose = require('mongoose');
const Config = require("../config/config.json")

Mongoose.connect(
    Config.MONGOOSE.FULL_ADDR, { useNewUrlParser : true}, (error) => {
        console.log(error)
    }
);

module.exports = { Mongoose }