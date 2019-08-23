const express = require ('express');
const https = require ('https');
const cheerio = require ('cheerio');
const querystring = require ('querystring');
const request = require ('request');
const util = require ('util');

const Axios = require ('axios');
const Path = require ('path');

const fs = require ('fs');

const router = express.Router ();

async function getLoginCredentials (username, password, district) {
  return new Promise (function (resolve, reject) {
    var postData = {
      ctl00$FormContentPlaceHolder$USERID: username,
      ctl00$FormContentPlaceHolder$PAUTH: password,
      ctl00$FormContentPlaceHolder$btnOK: 'Sign In',
      __EVENTTARGET: '',
      __EVENTARGUMENT: '',
      __VIEWSTATE: '',
      __VIEWSTATEGENERATOR: '',
      __EVENTVALIDATION: '',
    };
    https.get (
      `https://cimsweb.${district}.bc.ca/SchoolConnect/StuConSignon.aspx`,
      function (res) {
        let data = '';
        res.on ('data', function (chunk) {
          data += chunk;
        });
        res.on ('end', function () {
          let $ = cheerio.load (data);
          $ ('input').each (function (i, input) {
            if (input.attribs.value) {
              postData[input.attribs.name] = input.attribs.value;
            }
          });
          resolve ([
            querystring.stringify (postData),
            res.headers['set-cookie'],
          ]);
        });
      }
    );
  });
}

async function login (data, cookies, district) {
  return new Promise (function (resolve, reject) {
    let options = {
      url: `https://cimsweb.${district}.bc.ca/SchoolConnect/StuConSignon.aspx?${data}`,
      method: 'GET',
      headers: {
        Cookie: cookies[0],
      },
    };
    request (options, function (err, response, body) {
      if (!err && response.statusCode == 200) {
        resolve (body);
      } else {
        reject (err);
      }
    });
  });
}

async function compileHomeInfo (body) {
  return new Promise (function (resolve, reject) {
    let $ = cheerio.load (body);
    let gradeForm = $ ('#FormContentPlaceHolder_SGRADE');
    let classForm = $ ('#FormContentPlaceHolder_SCLASS');
    let fullName = $ ('#UserOptionsTextPlaceHolder_UserInfo');
    resolve ([
      gradeForm.val (),
      classForm.val (),
      fullName.text ().split (' ')[1],
      fullName.text ().split (' ')[2],
      fullName.text ().split (' ')[4],
    ]);
  });
}

async function getSchedule (cookies, district) {
  let options = {
    url: `https://cimsweb.${district}.bc.ca/SchoolConnect/SCSchedule.aspx`,
    method: 'GET',
    headers: {
      Cookie: cookies[0],
    },
  };

  let response = await Axios (options);

  let body = response.data;

  return body;
}

class Course {
  constructor (row) {
    this.teacher = row[4].split (' ');
    this.first_name = this.teacher[0];
    if (this.teacher[0]) {
      console.log (this.teacher);
      this.last_name =
        this.teacher[1][0].toUpperCase () +
        this.teacher[1].substring (1, this.teacher[1].length).toLowerCase ();
    }

    this.course = row[0];
    this.code = row[1];
    this.semester = row[5];
    this.block = row[6];
  }
}

function compileScheduleInfo (body) {
  let $ = cheerio.load (body);
  let scheduleTable = $ (
    '#FormContentPlaceHolder_ContentPlaceHolder1_StuSched > tbody > tr'
  );
  let classes = [];
  scheduleTable.each ((row, node) => {
    if (row > 0) {
      let currentClass = [];
      $ (node).children ().each ((column, elem) => {
        let classBox = $ (elem);
        currentClass.push (classBox.text ().trim ());
      });
      classes.push (new Course (currentClass));
    }
  });
  classes = classes.filter (course =>
    Object.keys (course).reduce ((acc, current) => {
      return acc && !!course[current];
    }, true)
  );
  return classes;
}

async function loadCourses (courses, user) {
  let dbCourses = [];
  for (var i = 0; i < courses.length; i++) {
    let teacher = await models['teacher'].find ({
      last_name: courses[i].last_name,
      school: user.school,
    });
    teacher = teacher.filter (
      teacher =>
        teacher.first_name[0].toUpperCase () ===
        courses[i].first_name.toUpperCase ()
    );

    let code = await models['code'].findOne ({
      school: user.school,
      code: courses[i].code,
    });
    let block = await models['block'].findOne ({
      school: user.school,
      block: courses[i].block,
    });
    let semester = await models['semester'].findOne ({
      school: user.school,
      name: courses[i].semester,
    });
    if (
      teacher.length !== 0 &&
      code != null &&
      block != null &&
      semester != null
    ) {
      let course = await models['course'].findOne ({
        teacher: teacher[0]._id,
        course: code._id,
        block: block._id,
        semester: semester._id,
      });
      if (course && course !== null) {
        dbCourses.push (course);
      }
    }
  }
  return dbCourses;
}

async function getTranscript (user, username, password, district) {
  try {
    let loginCredentials = await getLoginCredentials (
      username,
      password,
      district
    );

    let homePage = await login (
      loginCredentials[0],
      loginCredentials[1],
      district
    );

    if (homePage.indexOf ('Sign In') >= 0) {
      return false;
    } else {
      let schedule = await getSchedule (loginCredentials[1], district);
      let classes = compileScheduleInfo (schedule);
      classes = await loadCourses (classes, user);
      console.log (classes);
      return {status: 'ok', body: classes};
    }
  } catch (e) {
    console.log (e);
    return {status: 'error', error: e.message};
  }
}

router.get ('/', async (req, res) => {
  try {
    // let homework = await getHomework(req.query.username, req.query.password, req.query.district);
    let user = await models['user'].findById (req.account.reference_id);
    let transcript = await getTranscript (
      user,
      req.query.username,
      req.query.password,
      req.query.district
    );
    // console.log (transcript);
    if (transcript.status == 'ok') {
      res.okay (transcript.body);
    } else {
      res.error (transcript.error);
    }
  } catch (e) {
    console.log (e);
    res.error (e.error);
  }
});

module.exports = router;
