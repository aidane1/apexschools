const express = require ('express');

const router = express.Router ();

let clients = {};

let typing = {};

router.ws ('/app', async (ws, req) => {
  try {
    ws.broadcast = (message, clients) => {
      for (var key in clients) {
        clients[key].send (message);
      }
    };
    let {account, key} = await models.apikey.authenticate (
      req.query['x-id-key'],
      req.query['x-api-key']
    );
    let user = await models.user.findOne ({_id: account.reference_id});
    ws.account = account;
    ws.user = user;
    clients[ws.account._id] = ws;
    ws.on ('close', () => {
      delete clients[ws.account._id];
    });
    ws.on ('message', async message => {
      message = JSON.parse (message);
      if (message.type == 'typing') {
        if (typing[message.room]) {
          if (message.typing) {
            typing[message.room].push (message.username);
          } else {
            typing[message.room] = typing[message.room].filter (
              username => username != message.username
            );
          }
        } else {
          if (message.typing) {
            typing[message.room] = [message.username];
          } else {
            typing[message.room] = [];
          }
        }
        typing[message.room] = [...new Set (typing[message.room])];
        ws.broadcast (
          JSON.stringify ({
            key: message.room,
            type: 'typing',
            users: typing[message.room],
          }),
          clients
        );
      } else if (message.type == 'request') {
        if (message.request == 'users-typing') {
          let users = typing[message.room] || [];
          ws.send (
            JSON.stringify ({
              type: 'request',
              request: 'users-typing',
              key: message.room,
              users,
            })
          );
        }
      } else if (message.type == 'delete') {
        console.log("delete");
        message = await models['text'].findById (message.message);
        let diff = new Date ().getTime () - message.date.getTime ();
        console.log(diff);
        if (diff < 15000) {
          await models['text'].findOneAndDelete ({_id: message._id});
          ws.broadcast (
            JSON.stringify ({
              type: 'delete',
              key: message.room,
              _id: message._id,
            }),
            clients
          );
        }
      } else {
        let room = message.room;
        console.log("message!");
        if (room) {
          message.date = new Date ();
          message.school = ws.account.school;
          message.uploaded_by = ws.account.reference_id;
          message.profile_picture = ws.user.profile_picture;
          message.username = ws.account.username;
          message.key = room;
          let text = await models['text'].create (message);
          text = await models['text']
            .findOne ({_id: text._id})
            .populate ('resources');
          global.dispatchAction ('chatroom-text', text);
          text = JSON.parse (JSON.stringify (text));
          ws.broadcast (JSON.stringify ({...text, type: 'message'}), clients);
        }
      }
    });
  } catch (e) {
    console.log (e);
  }
});

// router.ws ('/app/courses/:course', async (ws, req) => {
//   try {
//     ws.broadcast = (message, course) => {
//       let sendClients = clients[course];
//       for (var key in sendClients) {
//         sendClients[key].send (message);
//       }
//     };
//     let {account, key} = await models.apikey.authenticate (
//       req.query['x-id-key'],
//       req.query['x-api-key']
//     );
//     let user = await models.user.findOne ({_id: account.reference_id});
//     ws.account = account;
//     ws.user = user;
//     ws.course = req.params.course;
//     if (clients[req.params.course]) {
//       clients[req.params.course][ws.account._id] = ws;
//     } else {
//       clients[req.params.course] = {};
//       clients[req.params.course][ws.account._id] = ws;
//     }
//     ws.on ('close', () => {
//       delete clients[ws.course][ws.account._id];
//     });
//     ws.on ('message', async msg => {
//       try {
//         msg = JSON.parse (msg);
//         msg.date = new Date ();
//         let course = await models.course.findById (req.params.course);
//         msg.reference_course = course._id;
//         msg.school = course.school;
//         msg.uploaded_by = ws.account._id;
//         msg.profile_picture = ws.user.profile_picture;
//         msg.username = ws.account.username;
//         let textMessage = await models['course-text'].create (msg);
//         textMessage = await models['course-text']
//           .findOne ({_id: textMessage._id})
//           .populate ('resources');
//         textMessage = JSON.stringify (textMessage);
//         ws.broadcast (textMessage, req.params.course);
//         return false;
//       } catch (e) {
//         console.log (e);
//         ws.send (
//           JSON.stringify ({
//             status: 'error',
//             body: 'An error occured',
//           })
//         );
//         return false;
//       }
//     });
//   } catch (e) {
//     console.log (e);
//   }
// });

let schoolClients = {};

// router.ws ('/app/schools/:school', async (ws, req) => {
//   try {
//     ws.broadcast = (message, school) => {
//       let sendClients = schoolClients[school];
//       for (var key in sendClients) {
//         sendClients[key].send (message);
//       }
//     };
//     let {account, key} = await models.apikey.authenticate (
//       req.query['x-id-key'],
//       req.query['x-api-key']
//     );
//     let user = await models.user.findOne ({_id: account.reference_id});
//     ws.account = account;
//     ws.user = user;
//     ws.school = req.params.school;
//     if (schoolClients[req.params.school]) {
//       schoolClients[req.params.school][ws.account._id] = ws;
//     } else {
//       schoolClients[req.params.school] = {};
//       schoolClients[req.params.school][ws.account._id] = ws;
//     }
//     ws.on ('close', () => {
//       delete schoolClients[ws.school][ws.account._id];
//     });
//     ws.on ('message', async msg => {
//       try {
//         msg = JSON.parse (msg);
//         msg.date = new Date ();
//         let school = await models.school.findById (req.params.school);
//         msg.school = school._id;
//         msg.uploaded_by = ws.account.reference_id;
//         msg.profile_picture = ws.user.profile_picture;
//         msg.username = ws.account.username;
//         let textMessage = await models['school-text'].create (msg);
//         textMessage = await models['school-text']
//           .findOne ({_id: textMessage._id})
//           .populate ('resources');
//         textMessage = JSON.stringify (textMessage);
//         ws.broadcast (textMessage, req.params.school);
//         return false;
//       } catch (e) {
//         console.log (e);
//         ws.send (
//           JSON.stringify ({
//             status: 'error',
//             body: 'An error occured',
//           })
//         );
//         return false;
//       }
//     });
//   } catch (e) {
//     console.log (e);
//   }
// });

// let gradeClients = {};

// router.ws ('/app/schools/:school/grade/:grade', async (ws, req) => {
//   try {
//     ws.broadcast = (message, school, grade) => {
//       let sendClients = gradeClients[school][grade];
//       for (var key in sendClients) {
//         sendClients[key].send (message);
//       }
//     };
//     let {account, key} = await models.apikey.authenticate (
//       req.query['x-id-key'],
//       req.query['x-api-key']
//     );
//     let user = await models.user.findOne ({_id: account.reference_id});
//     ws.account = account;
//     ws.user = user;
//     ws.grade = req.params.grade;
//     ws.school = req.params.school;
//     if (!gradeClients[ws.school]) {
//       gradeClients[ws.school] = {};
//     }
//     if (gradeClients[ws.school][req.params.grade]) {
//       gradeClients[ws.school][req.params.grade][ws.account._id] = ws;
//     } else {
//       gradeClients[req.params.school][req.params.grade] = {};
//       gradeClients[req.params.school][req.params.grade][ws.account._id] = ws;
//     }
//     ws.on ('close', () => {
//       delete gradeClients[ws.school][ws.grade][ws.account._id];
//     });
//     ws.on ('message', async msg => {
//       try {
//         msg = JSON.parse (msg);
//         msg.date = new Date ();
//         msg.grade = req.params.grade;
//         msg.school = ws.account.school;
//         msg.uploaded_by = ws.account._id;
//         msg.profile_picture = ws.user.profile_picture;
//         msg.username = ws.account.username;
//         let textMessage = await models['grade-text'].create (msg);
//         textMessage = await models['grade-text']
//           .findOne ({_id: textMessage._id})
//           .populate ('resources');
//         textMessage = JSON.stringify (textMessage);
//         ws.broadcast (textMessage, req.params.school, req.params.grade);
//         return false;
//       } catch (e) {
//         console.log (e);
//         ws.send (
//           JSON.stringify ({
//             status: 'error',
//             body: 'An error occured',
//           })
//         );
//         return false;
//       }
//     });
//   } catch (e) {
//     console.log (e);
//   }
// });

module.exports = router;
