const mongoose = require("mongoose");

const ApiRequestSchema = mongoose.Schema({
    path: {
        type: String,
    },
    method: {
        type: String,
    },
    headers: {
        type: String,
    },
    reference_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        // accepted, rejected
        type: String,
    }
});



const ApiRequest = mongoose.model("apirequest", ApiRequestSchema);
module.exports = ApiRequest;