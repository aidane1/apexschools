const mongoose = require("mongoose");

const TeacherSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    prefix: {
        type: String,
        default: "Mr.",
    },
    teacher_code: {
        type: String,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "school",
        required: true,
    }
});

const Teacher = mongoose.model("teacher", TeacherSchema);
module.exports = Teacher;