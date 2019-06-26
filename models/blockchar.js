const mongoose = require("mongoose");

const BlockSchema = mongoose.Schema({
    block: {
        type: String,
        default: "A",
    },
    is_constant: {
        type: Boolean,
        default: false,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "school",
        required: true,
    }
});

const Block = mongoose.model("block", BlockSchema);
module.exports = Block;