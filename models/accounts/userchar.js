const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    courses: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "course"}],
        default: [],
    },
    // for renamed blocks (ex. user manually changes block E from snackshack 11/12 to snackshack)
    block_names: {
        type: Object,
        default: {},
    },
    // list of assignments the user has completed
    completed_assignments: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "assignment"}],
        default: [],
    },
    before_school_activities: {

    },
    during_school_activities: {

    },
    after_school_activities: {

    },
    student_number: {
        type: String,
        default: "",
    },
    first_name: {
        type: String,
        default: "",
    },
    last_name: {
        type: String,
        default: "",
    },
    schedule_images: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "resource"}],
        default: [],
    },
    schedule_type: {
        type: String,
        default: "schedule",
    },
});

const User = mongoose.model("user", UserSchema);
module.exports = User;