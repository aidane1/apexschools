const mongoose = require("mongoose");

const BlockSchema = mongoose.Schema({
    block: {
        type: String,
        default: "A",
    },
    is_constant: {
        type: Boolean,
        default: false,
    }
});

const Block = mongoose.model("block", BlockSchema);
module.exports = Block;