const mongoose = require("mongoose");

const CourseTextSchema = mongoose.Schema({
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
    },
    username: {
        type: String,
    },
    date: {
        type: Date,
        default: new Date(),
    },
    message: {
        type: String,
    },
    reference_course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
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

const CourseText = mongoose.model("course-text", CourseTextSchema);
module.exports = CourseText;