const mongoose = require("mongoose");

const TopicSchema = mongoose.Schema({
    topic: {
        type: String,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
});

const Topic = mongoose.model("topic", TopicSchema);
module.exports = Topic;