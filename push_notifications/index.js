const {Expo} = require ('expo-server-sdk');

const moment = require ('moment-timezone');

let expo = new Expo ();

sendPushNotifications = async (
  users,
  titleFunction,
  bodyFunction,
  dataFunction
) => {
  let messages = [];
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

function formatUnit (hour, minute) {
  return `${(hour + 11) % 12 + 1}:${minute.toString ().length == 1 ? '0' + minute.toString () : minute}`;
}

function formatTime (time) {
  return `${formatUnit (time.start_hour, time.start_minute)} - ${formatUnit (time.end_hour, time.end_minute)}`;
}

let placeHolder = 12;

module.exports = () => {
  global.bindAction ('assignment-upload', async (action, assignment) => {
    let users = await models.user
      .find ({
        push_token: {$exists: true},
        reference_id: {$ne: assignment.uploaded_by},
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

  global.bindAction ('image-reply', async (action, assignment) => {
    let users = await models.user
      .find ({
        push_token: {$exists: true},
        reference_id: assignment.uploaded_by,
        school: assignment.school,
      })
      .select ({notifications: 1, push_token: 1});
    users = users.filter (user => {
      return user.notifications.image_replies;
    });

    let referenceCourse = await models.course
      .findOne ({_id: assignment.reference_course})
      .populate ('course');

    let titleFunction = user => {
      return 'Someone added an image to your assignment!';
    };

    let bodyFunction = user => {
      return `A new image has been added to your assignment ${assignment.assignment_title} in ${referenceCourse.course.course}`;
    };

    let dataFunction = user => {
      return {
        action: 'image-reply',
        assignment: assignment,
      };
    };
    sendPushNotifications (users, titleFunction, bodyFunction, dataFunction);
  });

  // Next class alerts are sent 10 minutes before the class
  // Activity Alerts for the morning are sent at 6:30AM
  // Activity Alerts for lunchtime activities are sent at ...
  // Activity Alerts for after school activities are sent 10 minutes before school ends
  //
  setInterval (async () => {
    let time = moment (new Date (2019, 9, 14, 17, 11)).tz ('America/Vancouver');
    // console.log(time.format("ha z"));
    // console.log (time.hours ());
    // console.log (time.minutes ());
    let schedules = await models.school.find (
      {},
      {year_day_object: 1, schedule: 1}
    );
    schedules.forEach (schedule => {
      let today =
        schedule.year_day_object[
          `${time.year ()}_${time.month ()}_${time.date ()}`
        ];

      if (today != undefined) {
        let next;
        // console.log (today);
        if (today.school_in) {
          // console.log (schedule.schedule.block_times);
          let blocks = schedule.schedule.day_blocks[today.week][today.day];
          let blockSpan = 0;
          blocks.forEach (async block => {
            let start_time = schedule.schedule.block_times[blockSpan];
            let end_time =
              schedule.schedule.block_times[blockSpan + block.block_span - 1];
            // console.log({start_time});
            if (
              start_time.start_hour * 60 + start_time.start_minute <
                time.hours () * 60 + time.minutes () &&
              end_time.end_hour * 60 + end_time.end_minute >
                time.hours () * 60 + time.minutes ()
            ) {
              if (
                end_time.end_hour * 60 +
                  end_time.end_minute -
                  (time.hours () * 60 + time.minutes ()) ==
                1
              ) {
                if (placeHolder == 12) {
                  placeHolder = 15;
                  let semesters = await models.semester.find ({
                    school: schedule._id,
                  });
                  semesters = semesters
                    .filter (semester => {
                      return (
                        semester.start_date.getTime () <= time.valueOf () &&
                        semester.end_date.getTime () >= time.valueOf ()
                      );
                    })
                    .map (semester => {
                      return semester._id;
                    });
                  let courses = await models.course
                    .find ({
                      $and: [
                        {school: schedule._id},
                        {semester: {$in: semesters}},
                        {block: block.block}
                      ],
                    })
                    .populate ('course');
                  courses = courses.filter (
                    course =>
                      course.block.toString () == block.block.toString ()
                  );
                  let courseMap = {};
                  courses.forEach (course => {
                    courseMap[course._id.toString ()] = course;
                  });
                  let users = await models.user
                    .find ({
                      push_token: {$exists: true},
                      school: schedule._id,
                    })
                    .select ({notifications: 1, push_token: 1, courses: 1});
                  users = users
                    .filter (user => {
                      return user.notifications.next_class;
                    })
                    .map (user => {
                      user = JSON.parse (JSON.stringify (user));
                      user.courses.forEach (course => {
                        if (courseMap[course])
                          user.current_course = courseMap[course];
                      });
                      return user;
                    });

                  console.log (users);
                  let titleFunction = user => {
                    return `Next Course Soon! ${user.current_course.course.course}`;
                  };

                  let bodyFunction = user => {
                    return `Your next course, ${user.current_course.course.course} runs from ${formatTime (
                      {
                        start_hour: start_time.start_hour,
                        start_minute: start_time.start_minute,
                        end_hour: end_time.end_hour,
                        end_minute: end_time.end_minute,
                      }
                    )}`;
                  };

                  let dataFunction = user => {
                    return {
                      action: 'next-course',
                      course: user.current_course,
                    };
                  };
                  sendPushNotifications (
                    users,
                    titleFunction,
                    bodyFunction,
                    dataFunction
                  );
                }
              }
            }
            blockSpan += block.block_span;
          });
        }
      }
    });
    // console.log (time.month ());
  }, 1000);
};
