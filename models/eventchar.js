const mongoose = require("mongoose");

const EventSchema = mongoose.Schema({
    grades: {
        type: Array,
        default: [9, 10, 11, 12],
    }
});

const Event = mongoose.model("course", EventSchema);
module.exports = Event;