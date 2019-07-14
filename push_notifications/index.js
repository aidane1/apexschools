const { Expo } = require('expo-server-sdk');

let expo = new Expo();

sendPushNotifications = async () => {
    let users = await global.models.user.find({push_token: {$exists: true}});
    console.log(users);
}

module.exports = sendPushNotifications;