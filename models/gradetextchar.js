const mongoose = require("mongoose");

const GradeTextSchema = mongoose.Schema({
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
    grade: {
        type: String,
        default: "9",
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

const GradeText = mongoose.model("grade-text", GradeTextSchema);
module.exports = GradeText;