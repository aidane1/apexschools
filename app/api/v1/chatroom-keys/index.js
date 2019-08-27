const express = require ('express');

const router = express.Router ();

router.get ('/', async (req, res) => {
  try {
    let user = await models["user"].findById(req.account.reference_id);
    let date = new Date ();
    let chats = await models['text'].find ({
      $and: [
        {
          key: user.chatrooms,
        },
        {
          date: {
            $gte: new Date (
              date.getFullYear (),
              date.getMonth (),
              date.getDate ()-2
            ),
          },
        },
      ],
    });
    let rooms = {};
    chats.forEach(chat => {
      if (rooms[chat.key]) {
        rooms[chat.key].users.push(chat.username);
        rooms[chat.key].date = chat.date;
      } else {
        rooms[chat.key] = {key: chat.key, users: [chat.username], date: chat.date};
      }
    })
    let chatrooms = [];
    for (var key in rooms) {
      let roomName = '';
      let group = rooms[key].key.split("_");
      if (group[0] == 'course') {
        let course = await models['course'].findById (group[1]).populate("course");
        if (course && course != null) {
          roomName = course.course.course;
        }
      } else if (group[0] == "grade") {
        let grade = group[1].split("-")[1];
        roomName = `Grade ${grade}`;
      } else if (group[0] == "school") {
        let school = await models["school"].findById(group[1]);
        roomName = school.name;
      }
      rooms[key].name = roomName;
      chatrooms.push(rooms[key]);
    }
    res.okay(chatrooms);
  } catch (e) {
    console.log (e);
    res.error (e.message);
  }
});

router.post ('/', async (req, res) => {});

router.put ('/pull/:user', async (req, res) => {
  console.log(req.body);
  console.log(req.params.user);
  try {
    if (req.params.user == req.account.reference_id) {
      let user = await models['user'].findOneAndUpdate (
        {_id: req.params.user},
        {
          $pull: {
            unviewed_chatrooms: req.body.key,
          },
        }
      );
      console.log(user);
      res.okay (user);
    } else {
      res.error ('Permission requirements not met. Please try again.');
    }
  } catch (e) {
    console.log (e);
    res.error (e.message);
  }
});

router.delete ('/', async (req, res) => {});

module.exports = router;
