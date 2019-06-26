const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema({
    block: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "block",
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher",
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "code",
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "school",
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
    },
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "semester",
        required: true,
    },
    topics: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "topic"}],
    },
});

const Course = mongoose.model("course", CourseSchema);
module.exports = Course;