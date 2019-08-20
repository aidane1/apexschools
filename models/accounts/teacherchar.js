const mongoose = require("mongoose");

const TeacherAccountSchema = mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teachers',
    },
    code: {
        type: String,
        required: true, 
    },
});



const TeacherAccount = mongoose.model("teacher-account", TeacherAccountSchema);
module.exports = TeacherAccount;