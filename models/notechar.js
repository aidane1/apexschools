const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema({
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
    },
    note: {
        type: String,
        required: true,
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
        default: [],
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "school",
        required: true,
    },
});

const Note = mongoose.model("note", NoteSchema);
module.exports = Note;