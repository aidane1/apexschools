const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AccountSchema = mongoose.Schema({
    //["user", "teacher", "admin"]
    account_type: {
        type: String,
        required: true,
    },
    date_created: {
        type: Date,
        default: new Date(),
    },
    reference_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    api_key: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "apikey",
    }, 
    permission_level: {
        type: Number,
        default: 0,
    },
});

AccountSchema.statics.authenticate = (username, password, school) => {
    return new Promise(async (resolve, reject) => {
        try {
            let account = await Account.findOne({$and: [{ username }, { school }]});
            if (account && account != null) {
                bcrypt.compare(password, account.password, (err, result) => {
                    if (result) {
                        resolve(account);
                    } else {
                        reject("password incorrect");
                    }
                });  
            } else {
                reject("User not found. Please try again.");
            }
        } catch(e) {
            console.log(e);
            reject(e.message);
        }
    })
}

AccountSchema.methods.stringify = function() {
    return JSON.parse(JSON.stringify(this));
}

AccountSchema.pre('save', function(next) {
    let account = this;
    bcrypt.hash(account.password, 10, async function(err, hash) {
        if (err) {
            console.log(err);
            return (err);
        }
        account.password = hash;
        let apikey = await models.apikey.create({reference_account: account._id});
        account.api_key = apikey._id;
        next();
    });
});

const Account = mongoose.model("account", AccountSchema);
module.exports = Account;