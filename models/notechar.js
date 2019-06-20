const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({

});

const User = mongoose.model("note", UserSchema);
module.exports = User;