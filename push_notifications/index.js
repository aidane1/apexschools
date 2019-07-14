const {Expo} = require ('expo-server-sdk');

let expo = new Expo ();

sendPushNotifications = async () => {
  let users = await global.models.user
    .find ({push_token: {$exists: true}})
    .select ({notifications: 1, push_token: 1});


  for (let user of users) {
    let pushToken = user.push_token;
    if (!Expo.isExpoPushToken (pushToken)) {
      console.error (`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    messages.push ({
      to: pushToken,
      sound: 'default',
      body: 'This is a test notification',
      data: {withSome: 'data'},
    });
  }


  let chunks = expo.chunkPushNotifications (messages);
  let tickets = [];
  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync (chunk);
        console.log (ticketChunk);
        tickets.push (...ticketChunk);
      } catch (error) {
        console.error (error);
      }
    }
  }) ();


  let receiptIds = [];
  for (let ticket of tickets) {
    if (ticket.id) {
      receiptIds.push (ticket.id);
    }
  }


  let receiptIdChunks = expo.chunkPushNotificationReceiptIds (receiptIds);
  (async () => {
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync (chunk);
        console.log (receipts);
        for (let receipt of receipts) {
          if (receipt.status === 'ok') {
            continue;
          } else if (receipt.status === 'error') {
            console.error (
              `There was an error sending a notification: ${receipt.message}`
            );
            if (receipt.details && receipt.details.error) {
              console.error (`The error code is ${receipt.details.error}`);
            }
          }
        }
      } catch (error) {
        console.error (error);
      }
    }
  }) ();
};

module.exports = sendPushNotifications;
