const express = require ('express');

const router = express.Router ();

let clients = {};

router.ws ('/app/courses/:course', async (ws, req) => {
  try {
    ws.broadcast = (message, course) => {
      let sendClients = clients[course];
      for (var key in sendClients) {
        sendClients[key].send (message);
      }
    };
    let {account, key} = await models.apikey.authenticate (
      req.query['x-id-key'],
      req.query['x-api-key']
    );
    ws.account = account;
    ws.course = req.params.course;
    if (clients[req.params.course]) {
      clients[req.params.course][ws.account._id] = ws;
    } else {
      clients[req.params.course] = {};
      clients[req.params.course][ws.account._id] = ws;
    }
    ws.on ('close', () => {
      delete clients[ws.course][ws.account._id];
    });
    ws.on ('message', async msg => {
      try {
        msg = JSON.parse (msg);
        msg.date = new Date ();
        let course = await models.course.findById (req.params.course);
        msg.reference_course = course._id;
        msg.school = course.school;
        msg.uploaded_by = ws.account._id;
        msg.username = ws.account.username;
        let textMessage = await models['course-text'].create (msg);
        textMessage = await models['course-text']
          .findOne ({_id: textMessage._id})
          .populate ('resources');
        textMessage = JSON.stringify (textMessage);
        ws.broadcast (textMessage, req.params.course);
        return false;
      } catch (e) {
        console.log (e);
        ws.send (
          JSON.stringify ({
            status: 'error',
            body: 'An error occured',
          })
        );
        return false;
      }
    });
  } catch (e) {
    console.log (e);
  }
});

let schoolClients = {};

router.ws ('/app/schools/:school', async (ws, req) => {
  try {
    ws.broadcast = (message, school) => {
      let sendClients = schoolClients[school];
      for (var key in sendClients) {
        sendClients[key].send (message);
      }
    };
    let {account, key} = await models.apikey.authenticate (
      req.query['x-id-key'],
      req.query['x-api-key']
    );
    ws.account = account;
    ws.school = req.params.school;
    if (schoolClients[req.params.school]) {
      schoolClients[req.params.school][ws.account._id] = ws;
    } else {
      schoolClients[req.params.school] = {};
      schoolClients[req.params.school][ws.account._id] = ws;
    }
    ws.on ('close', () => {
      delete schoolClients[ws.school][ws.account._id];
    });
    ws.on ('message', async msg => {
      try {
        msg = JSON.parse (msg);
        msg.date = new Date ();
        let school = await models.school.findById (req.params.school);
        msg.school = school._id;
        msg.uploaded_by = ws.account._id;
        msg.username = ws.account.username;
        let textMessage = await models['school-text'].create (msg);
        textMessage = await models['school-text']
          .findOne ({_id: textMessage._id})
          .populate ('resources');
        textMessage = JSON.stringify (textMessage);
        ws.broadcast (textMessage, req.params.school);
        return false;
      } catch (e) {
        console.log (e);
        ws.send (
          JSON.stringify ({
            status: 'error',
            body: 'An error occured',
          })
        );
        return false;
      }
    });
  } catch (e) {
    console.log (e);
  }
});

let gradeClients = {};

router.ws ('/app/schools/:school/grade/:grade', async (ws, req) => {
  try {
    ws.broadcast = (message, school, grade) => {
      let sendClients = gradeClients[school][grade];
      for (var key in sendClients) {
        sendClients[key].send (message);
      }
    };
    let {account, key} = await models.apikey.authenticate (
      req.query['x-id-key'],
      req.query['x-api-key']
    );
    ws.account = account;
    ws.grade = req.params.grade;
    ws.school = req.params.school;
    if (gradeClients[ws.school][req.params.grade]) {
        gradeClients[ws.school][req.params.grade][ws.account._id] = ws;
    } else {
        gradeClients[req.params.school][req.params.grade] = {};
        gradeClients[req.params.school][req.params.grade][ws.account._id] = ws;
    }
    ws.on ('close', () => {
      delete gradeClients[ws.school][ws.grade][ws.account._id];
    });
    ws.on ('message', async msg => {
      try {
        msg = JSON.parse (msg);
        msg.date = new Date ();
        msg.grade = req.params.grade;
        msg.school = ws.account.school;
        msg.uploaded_by = ws.account._id;
        msg.username = ws.account.username;
        let textMessage = await models['grade-text'].create (msg);
        textMessage = await models['grade-text']
          .findOne ({_id: textMessage._id})
          .populate ('resources');
        textMessage = JSON.stringify (textMessage);
        ws.broadcast (textMessage, req.params.grade);
        return false;
      } catch (e) {
        console.log (e);
        ws.send (
          JSON.stringify ({
            status: 'error',
            body: 'An error occured',
          })
        );
        return false;
      }
    });
  } catch (e) {
    console.log (e);
  }
});

module.exports = router;
