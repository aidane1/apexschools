const mongoose = require("mongoose");

const ResourceSchema = mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        required: true,
    }
});

const User = mongoose.model("user", UserSchema);
module.exports = User;