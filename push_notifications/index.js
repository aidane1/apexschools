const {Expo} = require ('expo-server-sdk');

let expo = new Expo ();

sendPushNotifications = async (
  users,
  titleFunction,
  bodyFunction,
  dataFunction
) => {
  let messages = [];
  console.log (users);
  for (let user of users) {
    let pushToken = user.push_token;
    if (!Expo.isExpoPushToken (pushToken)) {
      console.error (`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    messages.push ({
      to: pushToken,
      sound: 'default',
      title: titleFunction (user),
      body: bodyFunction (user),
      data: dataFunction (user),
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

module.exports = () => {
  global.bindAction ('assignment-upload', async (action, assignment) => {
    let users = await models.user
      .find ({
        push_token: {$exists: true},
        _id: {$ne: assignment.uploaded_by},
        school: assignment.school,
        courses: assignment.reference_course,
      })
      .select ({notifications: 1, push_token: 1});
      
    users = users.filter (user => {
      return user.notifications.new_assignments;
    });
    
    let uploadAccount = await models.account.findOne ({
      _id: assignment.uploaded_by,
    });

    let referenceCourse = await models.course
      .findOne ({_id: assignment.reference_course})
      .populate ('course');


    let titleFunction = user => {
      return 'New assignment uploaded!';
    };
    
    let bodyFunction = user => {
      return `${uploadAccount.username} uploaded an assignment to ${referenceCourse.course.course}. ${assignment.assignment_title}`;
    };

    let dataFunction = user => {
      return {
        action: 'assignment-upload',
        assignment: assignment,
      };
    };

    sendPushNotifications (users, titleFunction, bodyFunction, dataFunction);
  });
};
