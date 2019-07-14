const { Expo } = require('expo-server-sdk');

let expo = new Expo();

sendPushNotifications = async () => {
    let users = await global.models.users.find({push_token: {$exists: true, $not: {$size: 0}}});
    console.log(users);
}

module.exports = sendPushNotifications;