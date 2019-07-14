const mongoose = require("mongoose");

const PushTokenSchema = mongoose.Schema({
    key: {
        type: String,
    },
    date_created: {
        type: Date,
        default: new Date(),
    },
    reference_account: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const PushToken = mongoose.model("pushtoken", PushTokenSchema);
module.exports = User;