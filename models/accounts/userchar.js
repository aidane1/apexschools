const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    courses: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "course"}],
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

    }
});

const User = mongoose.model("user", UserSchema);
module.exports = User;