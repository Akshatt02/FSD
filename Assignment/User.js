const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    username:String,
    password:String,
    role:String   // student or faculty

});

module.exports = mongoose.model("User",userSchema);