const mongoose = require("mongoose");

const SchoolTextSchema = mongoose.Schema({
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
    },
    username: {
        type: String,
    },
    profile_image: {
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

const SchoolText = mongoose.model("school-text", SchoolTextSchema);
module.exports = SchoolText;