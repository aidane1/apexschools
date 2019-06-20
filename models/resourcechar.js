const mongoose = require("mongoose");

const ResourceSchema = mongoose.Schema({
    path: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    date_created: {
        type: Date,
        required: true,
    },
    school: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    uploaded_by: {
        type: mongoose.Types.ObjectId,
        required: true,
    }
});

const User = mongoose.model("resource", ResourceSchema);
module.exports = User;