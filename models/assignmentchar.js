const mongoose = require("mongoose");

const AssignmentSchema = mongoose.Schema({
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
    },
    assignment_title: {
        type: String,
        required: true,
    },
    assignment_notes: {
        type: String,
        default: "",
    },
    due_date: {
        type: String,
        default: "",
    },
    date: {
        type: Date,
        default: new Date(),
    },
    reference_course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
    },
    resources: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "resource"}],
    },
    response_resources: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "resource"}],
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "school",
        required: true,
    },
});

const Assignment = mongoose.model("assignment", AssignmentSchema);
module.exports = Assignment;