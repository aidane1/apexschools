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
      badge: 1,
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
    try {
      let users = await models.user
        .find ({
          push_token: {$exists: true},
          _id: {$ne: assignment.uploaded_by},
          school: assignment.school,
          courses: assignment.reference_course,
        })
        .select ({notifications: 1, push_token: 1});
      users = users.filter (user => {
        return user.notifications.new_assignments && user.push_token !== '';
      });

      let uploadAccount = await models.account.findOne ({
        reference_id: assignment.uploaded_by,
      });

      let referenceCourse = await models.course
        .findOne ({_id: assignment.reference_course})
        .populate ('course');

      let titleFunction = user => {
        return `${uploadAccount.username} uploaded an assignment to ${referenceCourse.course.course}!`;
      };

      let bodyFunction = user => {
        return `${assignment.assignment_title}`;
      };

      let dataFunction = user => {
        return {
          action: 'assignment-upload',
          assignment: assignment,
        };
      };
      sendPushNotifications (users, titleFunction, bodyFunction, dataFunction);
    } catch (e) {
      console.log (e);
    }
  });

  global.bindAction ('image-reply', async (action, assignment) => {
    try {
      let users = await models.user
        .find ({
          push_token: {$exists: true},
          _id: assignment.uploaded_by,
          school: assignment.school,
        })
        .select ({notifications: 1, push_token: 1});
      users = users.filter (user => {
        return user.notifications.image_replies && user.push_token !== '';
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
    } catch (e) {
      console.log (e);
    }
  });

  (() => {
    setInterval (async () => {
      try {
        let time = moment (new Date ()).tz ('America/Vancouver');
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
            if (today.school_in) {
              let blocks = schedule.schedule.day_blocks[today.week][today.day];
              let blockSpan = 0;
              blocks.forEach (async (block, index) => {
                let start_time = schedule.schedule.block_times[blockSpan];
                let end_time =
                  schedule.schedule.block_times[
                    blockSpan + block.block_span - 1
                  ];
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
                    10
                  ) {
                    if (blocks[index + 1] !== undefined) {
                      let span = block.block_span;
                      start_time =
                        schedule.schedule.block_times[blockSpan + span];
                      block = blocks[index + 1];
                      end_time =
                        schedule.schedule.block_times[
                          blockSpan + block.block_span + span - 1
                        ];
                      if (placeHolder == 12) {
                        placeHolder = 15;
                        let semesters = await models.semester.find ({
                          school: schedule._id,
                        });
                        semesters = semesters
                          .filter (semester => {
                            return (
                              semester.start_date.getTime () <=
                                time.valueOf () &&
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
                              {block: block.block},
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
                          .select ({
                            notifications: 1,
                            push_token: 1,
                            courses: 1,
                          });
                        users = users
                          .filter (user => {
                            return (
                              user.notifications.next_class &&
                              user.push_token !== ''
                            );
                          })
                          .map (user => {
                            user = JSON.parse (JSON.stringify (user));
                            user.courses.forEach (course => {
                              if (courseMap[course])
                                user.current_course = courseMap[course];
                            });
                            return user;
                          });
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
                }
                blockSpan += block.block_span;
              });
            }
          }
        });
      } catch (e) {
        console.log (e);
      }
    }, 60000);
  })();

  // put () to call

  global.bindAction ('message', async (action, notification) => {
    console.log (notification);
    try {
      let users = await models.user
        .find ({
          push_token: {$exists: true},
          school: notification.school,
        })
        .select ({notifications: 1, push_token: 1});
      users = users.filter (user => {
        return user.push_token !== '';
      });

      let titleFunction = user => {
        return 'Office Alert!';
      };

      let bodyFunction = user => {
        return `${notification.data}`;
      };

      let dataFunction = user => {
        return {
          action: 'message',
          message: notification,
        };
      };

      let timeDif =
        (notification.send_instantly
          ? notification.date.getTime ()
          : notification.send_date.getTime ()) - new Date ().getTime ();
      if (timeDif < 0) {
        timeDif = 10;
      }

      if (notification.send_instantly) {
        let currentNotification = await models['notification'].findOne ({
          _id: notification._id,
        });
        if (!currentNotification.has_been_sent) {
          await models['notification'].findOneAndUpdate (
            {_id: notification._id},
            {$set: {has_been_sent: true}}
          );
          sendPushNotifications (
            users,
            titleFunction,
            bodyFunction,
            dataFunction
          );
        }
      } else {
        setTimeout (async () => {
          let currentNotification = await models['notification'].findOne ({
            _id: notification._id,
          });
          if (!currentNotification.has_been_sent) {
            await models['notification'].findOneAndUpdate (
              {_id: notification._id},
              {$set: {has_been_sent: true}}
            );
            sendPushNotifications (
              users,
              titleFunction,
              bodyFunction,
              dataFunction
            );
          }
        }, timeDif);
      }
    } catch (e) {
      console.log (e);
    }
  });

  async () => {
    let notifications = await models['notification'].find ({
      has_been_sent: false,
    });
    notifications.forEach (notification => {
      global.dispatchAction ('message', notification);
    });
  };

  // put () to call

  global.bindAction ('announcements', async (action, announcement) => {
    try {
      let users = await models.user
        .find ({
          push_token: {$exists: true},
          school: announcement.school,
        })
        .select ({notifications: 1, push_token: 1});

      console.log ({users});

      users = users.filter (user => {
        return user.push_token !== '' && user.notifications.daily_announcements;
      });

      console.log ({users});

      // console.log (users);

      let titleFunction = user => {
        return 'Daily Announcements!';
      };

      let date = moment (announcement.date_announced).format ('MMMM Do, YYYY');

      let bodyFunction = user => {
        return `The daily announcements for ${date} have been released!`;
      };

      let dataFunction = user => {
        return {
          action: 'announcement',
          // announcement: announcement,
          announcement: announcement._id,
        };
      };

      // console.log("text");

      // global.dispatchAction ('message', {
      //   school: announcement.school,
      //   send_instantly: true,
      //   date: new Date (),
      //   send_date: new Date (),
      //   _id: '5d49b99bc10f1434e7e8bcd4',
      // });

      sendPushNotifications (users, titleFunction, bodyFunction, dataFunction);
    } catch (e) {
      console.log (e);
    }
  });

  global.bindAction ('chatroom-text', async (action, text) => {
    console.log ('called!');
    console.log ({text});
    try {
      let users = await models.user
        .find ({
          $and: [
            {push_token: {$exists: true}},
            {chatrooms: text.key},
            {unviewed_chatrooms: {$ne: text.key}},
          ],
        })
        .select ({push_token: 1});

      console.log (users);

      await models.user.updateMany (
        {_id: {$in: users.map (user => user._id)}},
        {$push: {unviewed_chatrooms: text.key}}
      );

      users = users.filter (user => {
        return user.push_token !== '';
      });

      let group = text.key.split ('_');
      console.log (group);
      let roomName = '';
      if (group[0] == 'course') {
        let course = await models['course']
          .findById (group[1])
          .populate ('course');
        console.log (course);
        if (course && course != null) {
          roomName = course.course.course;
        }
      } else if (group[0] == 'grade') {
        let grade = group[1].split ('-')[1];
        roomName = `Grade ${grade}`;
      } else if (group[0] == 'school') {
        let school = await models['school'].findById (group[1]);
        roomName = school.name;
      }

      let titleFunction = user => {
        return `${text.username} ${roomName ? `in ${roomName}` : 'Sent a message'}`;
      };

      let bodyFunction = user => {
        return `${text.message || 'Image'}`;
      };

      let dataFunction = user => {
        return {
          action: 'chatroom-text',
          text: text,
        };
      };

      console.log ({users});

      sendPushNotifications (users, titleFunction, bodyFunction, dataFunction);
    } catch (e) {
      console.log (e);
    }
  });

  global.bindAction ('comment-reply', async (action, comment) => {
    try {
      let parent;
      if (comment.depth === 0) {
        parent = await models['post'].findOne ({_id: comment.parents[0]});
      } else {
        parent = await models['comment'].findOne ({
          _id: comment.parents[comment.parents.length - 1],
        });
      }
      let users = await models['user'].findById (parent.uploaded_by);
      users = [users];
      console.log ({users});
      users = users.filter (user => user.push_token != '');
      console.log ({users});

      let account = await models['account'].findOne ({
        reference_id: comment.uploaded_by,
      });
      let titleFunction = user => {
        return `${account.username} replied to your ${comment.depth === 0 ? 'post' : 'comment'}`;
      };

      let bodyFunction = user => {
        return `${comment.body}`;
      };

      let post = await models['post'].findOne ({_id: comment.parents[0]});

      let dataFunction = user => {
        return {
          action: 'comment-reply',
          post,
        };
      };

      sendPushNotifications (users, titleFunction, bodyFunction, dataFunction);
    } catch (e) {
      console.log (e);
    }
  });

  global.bindAction ('post', async (action, question) => {
    try {
      let users = await models.user
        .find ({
          push_token: {$exists: true},
          school: question.school,
        })
        .select ({notifications: 1, push_token: 1});

      users = users.filter (user => {
        return user.push_token !== '' && user.notifications.daily_announcements;
      });

      console.log ({users});

      // console.log (users);

      let postedBy = await models['user'].findOne ({_id: question.uploaded_by});

      let titleFunction = user => {
        return 'Forum Post!';
      };

      let bodyFunction = user => {
        return `${postedBy.username} asked a question: ${question.title} `;
      };

      let dataFunction = user => {
        return {
          action: 'post',
          // announcement: announcement,
          question: question._id,
        };
      };

      // console.log("text");

      // global.dispatchAction ('message', {
      //   school: announcement.school,
      //   send_instantly: true,
      //   date: new Date (),
      //   send_date: new Date (),
      //   _id: '5d49b99bc10f1434e7e8bcd4',
      // });

      sendPushNotifications (users, titleFunction, bodyFunction, dataFunction);
    } catch (e) {
      console.log (e);
    }
  });

  // (() => {
  //   setInterval (async () => {
  //     let time = moment (new Date (2019, 9, 14, 13)).tz ('America/Vancouver');
  //     if (time.hours () == 6) {
  //       let schedules = await models.school.find (
  //         {},
  //         {year_day_object: 1, schedule: 1}
  //       );
  //       schedules.forEach (async schedule => {
  //         let today =
  //           schedule.year_day_object[
  //             `${time.year ()}_${time.month ()}_${time.date ()}`
  //           ];
  //         if (today.school_in) {
  //           if (time.hours () * 60 + time.minutes () === 360) {
  //             let users = await models.user
  //               .find ({
  //                 push_token: {$exists: true},
  //                 school: schedule._id,
  //               })
  //               .select ({notifications: 1, push_token: 1, courses: 1});
  //             users = users.filter (user => {
  //               return user.notifications.next_class && user.push_token !== '';
  //             });
  //             console.log (time.format ('MMMM Do YYYY, h:mm:ss a'));
  //           }
  //         }
  //       });
  //     }
  //   }, 6000);
  // }) ();

  // Next class alerts are sent 10 minutes before the class
  // Activity Alerts for the morning are sent at 6:30AM
  // Activity Alerts for lunchtime activities are sent at ...
  // Activity Alerts for after school activities are sent 10 minutes before school ends
  //
};
