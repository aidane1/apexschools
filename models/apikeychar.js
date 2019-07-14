const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Cryptr = require('cryptr');
const cryptr = new Cryptr(server_info.keys.encryption_key);




const ApiKeySchema = mongoose.Schema({
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
    },
});

ApiKeySchema.statics.authenticate = function(id, key) {
    return new Promise(async (resolve, reject) => {
        try {
            let decryptedId = cryptr.decrypt(id)
            if (decryptedId) {
                let account = await models.account.findOne({_id: cryptr.decrypt(id)}).populate("api_key");
                if (account && account != null) {
                    if (account.api_key && account.api_key != null && account.api_key.key === key) {
                        resolve({account, key: account.api_key});
                    } else {
                        reject("API token invalid. Please try again.");
                    }
                } else {
                    reject("Account not found. Please try again.");
                }
            } else {
                reject("API token does not exist. Please try again.");
            }
        } catch(e) {
            reject(e);
        }
    })
}



ApiKeySchema.pre("save", function(next) {
    let apikey = this;
    bcrypt.hash(new Date().getTime().toString(), 10, function(err, hash) {
        if (err) {
            console.log(err);
            return (err);
        }
        apikey.key = hash;
        apikey.date = new Date();
        next();
    });
});

const ApiKey = mongoose.model("apikey", ApiKeySchema);
module.exports = ApiKey;