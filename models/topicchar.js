const mongoose = require("mongoose");

const TopicSchema = mongoose.Schema({
    topic: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "school",
        required: true,
    }
});

const Topic = mongoose.model("topic", TopicSchema);
module.exports = Topic;