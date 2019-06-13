const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({

});

const User = mongoose.model("user", UserSchema);
module.exports = User;