const express = require ('express');
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

async function getAssignment (cookies, district) {
  return new Promise (function (resolve, reject) {
    let options = {
      url: `https://cimsweb.${district}.bc.ca/SchoolConnect/SCAssignments.aspx`,
      method: 'GET',
      headers: {
        Cookie: cookies[0],
      },
    };
    request (options, function (error, response, body) {
      resolve (body);
    });
  });
}

async function getScheduleBody (cookies, district) {
  return new Promise (function (resolve, reject) {
    let options = {
      url: `https://cimsweb.${district}.bc.ca/SchoolConnect/SCSchedule.aspx`,
      method: 'GET',
      headers: {
        Cookie: cookies[0],
      },
    };
    request (options, function (error, response, body) {
      resolve (body);
    });
  });
}

async function compileScheduleInfo (body, semester) {
  return new Promise (function (resolve, reject) {
    let $ = cheerio.load (body);
    let classes = [];
    let scheduleRows = $ (
      '#FormContentPlaceHolder_ContentPlaceHolder1_StuSched tr'
    );

    scheduleRows.each (function (i, element) {
      if (i > 1) {
        let currentClass = [];
        $ (this).children ().each (function (j, elem) {
          let classBox = $ (elem);
          if (classBox.text ().replace (/\s/g, '') && j < 7) {
            currentClass.push (classBox.text ().replace (/\s\s+/g, ' '));
          }
        });
        currentClass.length && currentClass.length !== 1
          ? classes.push (currentClass)
          : '';
      }
    });
    let orderedClasses = [];
    for (var i = 0; i < classes.length; i++) {
      if (classes[i][4] === 'LINEAR' || classes[i][4] === semester) {
        orderedClasses.push ([classes[i][0], classes[i][3], classes[i][5]]);
      }
    }
    resolve (orderedClasses);
  });
}
async function getAssignmentCredentials (body, cookies) {
  let $ = cheerio.load (body);
  let newPostData = {
    ctl00$ctl00$FormContentPlaceHolder$ContentPlaceHolder1$DrpSelect: 'C',
    __EVENTTARGET: 'ctl00$ctl00$NavigationItemsPlaceHolder$AA34',
    __EVENTARGUMENT: '',
    __LASTFOCUS: '',
    ctl00$ctl00$FormContentPlaceHolder$ContentPlaceHolder1$DrpLimCourse: '   000      ',
    ctl00$ctl00$FormContentPlaceHolder$ContentPlaceHolder1$DrpTerm: '1',
  };
  $ ('input').each (function (i, input) {
    if (
      input.attribs.name == '__VIEWSTATE' ||
      input.attribs.name == '__EVENTVALIDATION' ||
      input.attribs.name == '__EVENTTARGET' ||
      input.attribs.name == '__LASTFOCUS' ||
      input.attribs.name == '__VIEWSTATEGENERATOR' ||
      input.attribs.name == 'ctl00$ctl00$FormContentPlaceHolder$STUNO' ||
      input.attribs.name == 'ctl00$ctl00$FormContentPlaceHolder$SGRADE' ||
      input.attribs.name == 'ctl00$ctl00$FormContentPlaceHolder$SCLASS' ||
      input.attribs.name ==
        'ctl00$ctl00$FormContentPlaceHolder$ContentPlaceHolder1$ISTART'
    ) {
      newPostData[input.attribs.name] = input.attribs.value;
    }
  });
  let optionsObject = {
    __EVENTTARGET: 'ctl00$ctl00$FormContentPlaceHolder$ContentPlaceHolder1$DrpSelect',
    __VIEWSTATE: newPostData['__VIEWSTATE'],
    __EVENTVALIDATION: newPostData['__EVENTVALIDATION'],
    ctl00$ctl00$FormContentPlaceHolder$ContentPlaceHolder1$DrpSelect: 'A',
  };
  let headers = {
    url: 'https://cimsweb.sd83.bc.ca/SchoolConnect/SCAssignments.aspx',
    headers: {
      Cookie: cookies[0],
    },
    form: optionsObject,
  };
  // console.log(headers);
  let requestPromise = util.promisify (request.post);
  let response = await requestPromise (headers);
  let bodies = [];
  let newBody = response.body;
  bodies.push (newBody);
  let new$ = cheerio.load (newBody);
  let count = 0;
  let hrefs = new$ (
    "a[href=\"javascript:__doPostBack('ctl00$ctl00$FormContentPlaceHolder$ContentPlaceHolder1$StuAssign$ctl29$ctl01','')\"]"
  );
  while (hrefs.length) {
    count++;
    let $ = cheerio.load (bodies[bodies.length - 1]);
    let newPostData = {};
    $ ('input').each (function (i, input) {
      if (
        input.attribs.name == '__VIEWSTATE' ||
        input.attribs.name == '__EVENTVALIDATION' ||
        input.attribs.name == '__EVENTTARGET' ||
        input.attribs.name == '__LASTFOCUS' ||
        input.attribs.name == '__VIEWSTATEGENERATOR' ||
        input.attribs.name == 'ctl00$ctl00$FormContentPlaceHolder$STUNO' ||
        input.attribs.name == 'ctl00$ctl00$FormContentPlaceHolder$SGRADE' ||
        input.attribs.name == 'ctl00$ctl00$FormContentPlaceHolder$SCLASS' ||
        input.attribs.name ==
          'ctl00$ctl00$FormContentPlaceHolder$ContentPlaceHolder1$ISTART'
      ) {
        newPostData[input.attribs.name] = input.attribs.value;
      }
    });
    let optionsObject = {
      __EVENTTARGET: 'ctl00$ctl00$FormContentPlaceHolder$ContentPlaceHolder1$StuAssign$ctl29$ctl01',
      __EVENTARGUMENT: '',
      __LASTFOCUS: '',
      __VIEWSTATEGENERATOR: '7D3BF3BB',
      __VIEWSTATE: newPostData['__VIEWSTATE'],
      __EVENTVALIDATION: newPostData['__EVENTVALIDATION'],
      ctl00$ctl00$FormContentPlaceHolder$ContentPlaceHolder1$DrpSelect: 'A',
    };
    let headers = {
      url: 'https://cimsweb.sd83.bc.ca/SchoolConnect/SCAssignments.aspx',
      headers: {
        Cookie: cookies[0],
      },
      form: optionsObject,
    };
    let response = await requestPromise (headers);
    let body = response.body;
    hrefs = cheerio.load (body) (
      "a[href=\"javascript:__doPostBack('ctl00$ctl00$FormContentPlaceHolder$ContentPlaceHolder1$StuAssign$ctl29$ctl01','')\"]"
    );
    bodies.push (body);
  }
  return bodies;
}

async function compileInfo (bodies) {
  return new Promise (function (resolve, reject) {
    let allAssignments = [];
    for (var i = 0; i < bodies.length; i++) {
      let body = bodies[i];
      let $ = cheerio.load (body);
      let texts = [];
      let trs = $ ('#FormContentPlaceHolder_ContentPlaceHolder1_StuAssign tr');
      trs.each (function (i, element) {
        if (i !== 0 && i !== 1) {
          let currentTr = [];
          $ (this).children ().each (function (j, elem) {
            let td = $ (elem);
            if (td.text ().replace (/\s/g, '')) {
              currentTr.push ([td.text ().replace (/\s\s+/g, ' ')]);
            }
          });
          currentTr.length && currentTr.length !== 1
            ? texts.push (currentTr)
            : '';
        }
      });
      allAssignments.push (texts);
    }
    let newTexts = [];
    for (var i = 0; i < allAssignments.length; i++) {
      for (var j = 0; j < allAssignments[i].length; j++) {
        newTexts.push (allAssignments[i][j]);
      }
    }
    resolve (newTexts);
  });
}

async function getHistoryBody (cookies, district) {
  return new Promise (function (resolve, reject) {
    let options = {
      url: `https://cimsweb.${district}.bc.ca/SchoolConnect/SCTranscript.aspx`,
      method: 'GET',
      headers: {
        Cookie: cookies[0],
      },
    };
    request (options, function (error, response, body) {
      resolve (body);
    });
  });
}

async function getHomework (username, password, district) {
  let loginCredentials = await getLoginCredentials (
    username,
    password,
    district
  );
  await login (loginCredentials[0], loginCredentials[1], district);
  let assignmentBody = await getAssignment (loginCredentials[1], district);
  let assignmentCredentials = await getAssignmentCredentials (
    assignmentBody,
    loginCredentials[1],
    district
  );
  let compiledInfo = compileInfo (assignmentCredentials);
  return compiledInfo;
}
//semester is in the form SEM1 or SEM2
async function getSchedule (username, password, semester, district) {
  try {
    let loginCredentials = await getLoginCredentials (
      username,
      password,
      district
    );
    await login (loginCredentials[0], loginCredentials[1], district);
    let scheduleBody = await getScheduleBody (loginCredentials[1], district);
    let compiledSchedule = await compileScheduleInfo (
      scheduleBody,
      semester,
      district
    );
    let names = compiledSchedule.map (x => [
      'Mr.' +
        x[1][2].toUpperCase () +
        x[1].substring (2, x[1].length - 1).substring (1).toLowerCase (),
      'Ms.' +
        x[1][2].toUpperCase () +
        x[1].substring (2, x[1].length - 1).substring (1).toLowerCase (),
      'Mme.' +
        x[1][2].toUpperCase () +
        x[1].substring (2, x[1].length - 1).substring (1).toLowerCase (),
    ]);
    let blocks = compiledSchedule.map (
      x => ['A', 'B', 'C', 'D', 'E'][(parseInt (x[2]) - 1) / 2]
    );
    let classes = compiledSchedule.map (x =>
      x[0].substring (0, 2).toLowerCase ()
    );
    let userCourses = [];
    for (var i = 0; i < names.length; i++) {
      let currentCourse = await Course.find ({
        $and: [{teacher: names[i]}, {block: blocks[i]}],
      });
      if (currentCourse.length != 0) {
        if (currentCourse.length === 1) {
          userCourses.push (currentCourse[0]._id);
        } else {
          let found = false;
          for (var j = 0; j < currentCourse.length; j++) {
            if (
              currentCourse.course.substring (0, 2).toLowerCase () ===
                classes[i] &&
              !found
            ) {
              found = true;
              userCourses.push (currentCourse[j]._id);
            }
          }
          if (!found) {
            userCourses.push (currentCourse[0]);
          }
        }
      }
    }
    return userCourses;
  } catch (e) {
    return [];
  }
}

async function getHistoryBody (cookies, district) {
  return new Promise (function (resolve, reject) {
    let options = {
      url: `https://cimsweb.${district}.bc.ca/SchoolConnect/SCTranscript.aspx`,
      method: 'GET',
      headers: {
        Cookie: cookies[0],
      },
    };
    request (options, function (error, response, body) {
      resolve (body);
    });
  });
}

async function compileHistory (body) {
  return new Promise (function (resolve, reject) {
    let $ = cheerio.load (body);
    let classes = [];
    let scheduleRows = $ (
      '#FormContentPlaceHolder_ContentPlaceHolder1_StuTrans tr'
    );
    scheduleRows.each (function (i, element) {
      if (i > 1) {
        let currentClass = [];
        $ (this).children ().each (function (j, elem) {
          let classBox = $ (elem);
          if (j < 8) {
            currentClass.push (classBox.text ().replace (/\s\s+/g, ' '));
          }
        });
        currentClass.length && currentClass.length !== 1
          ? classes.push (currentClass)
          : '';
      }
    });
    let orderedClasses = [];
    for (var i = 0; i < classes.length; i++) {
      orderedClasses.push ([classes[i][1], classes[i][5], classes[i][7]]);
    }
    resolve (orderedClasses);
  });
}

//gets history of grades for you
async function getHistory (username, password, district) {
  let loginCredentials = await getLoginCredentials (
    username,
    password,
    district
  );
  await login (loginCredentials[0], loginCredentials[1], district);
  let history = await getHistoryBody (loginCredentials[1], district);
  let compiledHistory = compileHistory (history);
  return compiledHistory;
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
//gets user grade and other ID stuff
async function getUserInfo (username, password, district) {
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
  let compiledHome = compileHomeInfo (homePage);
  return compiledHome;
}

router.get ('/', async (req, res) => {
    try {
        let homework = await getHomework(req.body.username, req.body.password, req.body.district);
        console.log(homework);
        res.okay(homework);
    } catch(e) {
        console.log(e);
        res.error(e.message);
    }
});

module.exports = router;
