const mongoose = require("mongoose");

const WsTextSchema = mongoose.Schema({
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
    },
    username: {
        type: String,
    },
    profile_picture: {
        type: String,
        default: "",
    },
    date: {
        type: Date,
        default: new Date(),
    },
    message: {
        type: String,
    },
    key: {
        type: String,
        required: true,
    },
    resources: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "resource"}],
        default: [],
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "school",
        required: true,
    },
});

const wsText = mongoose.model("text", WsTextSchema);
module.exports = wsText;