const mongoose = require("mongoose");

const ResourceSchema = mongoose.Schema({
    path: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    date_created: {
        type: Date,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "school",
        required: true,
    },
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
    }
});

const User = mongoose.model("resource", ResourceSchema);
module.exports = User;