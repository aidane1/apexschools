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

async function loadPrint (cookies, district) {
  return new Promise (async (resolve, reject) => {
    let options = {
      url: `https://cimsweb.${district}.bc.ca/SchoolConnect/SCTranscript.aspx`,
      method: 'GET',
      headers: {
        Cookie: cookies[0],
      },
    };

    let response = await Axios (options);

    let body = response.data;

    let $ = cheerio.load (body);
    let newPostData = {
      __EVENTTARGET: '',
      __EVENTARGUMENT: '',
      __LASTFOCUS: '',
      ctl00$ctl00$FormContentPlaceHolder$ContentPlaceHolder1$btnPrint: 'Print',
    };
    $ ('input').each (function (i, input) {
      if (
        input.attribs.name == '__VIEWSTATE' ||
        input.attribs.name == '__EVENTVALIDATION' ||
        input.attribs.name == '__VIEWSTATEGENERATOR' ||
        input.attribs.name == 'ctl00$ctl00$FormContentPlaceHolder$SGRADE' ||
        input.attribs.name ==
          'ctl00$ctl00$FormContentPlaceHolder$ContentPlaceHolder1$ISTART'
      ) {
        newPostData[input.attribs.name] = input.attribs.value;
      }
    });
    let headers = {
      url: `https://cimsweb.${district}.bc.ca/SchoolConnect/SCTranscript.aspx`,
      method: 'POST',
      headers: {
        Cookie: cookies[0],
      },
      form: newPostData,
    };
    request (headers, (err, response, body) => {
      resolve (body);
    });
  });
}

async function updateTranscript (user, username, password, district) {
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
    let studentNumber;
    if (user.student_number) {
      studentNumber = user.student_number;
    } else {
      studentNumber = await compileHomeInfo (homePage);
      studentNumber = studentNumber[4];
      await models['user'].findOneAndUpdate (
        {_id: user._id},
        {$set: {student_number: studentNumber}}
      );
    }

    await loadPrint (loginCredentials[1], district);

    let path = abs_path (`/student_data/transcripts/${studentNumber}.pdf`);
    let writer = fs.createWriteStream (path);

    const response = await Axios ({
      url: `https://cimsweb.${district}.bc.ca/SchoolConnect/PrivateFileHandler.ashx?FileRequest=Report&DocName=00${studentNumber}`,
      method: 'GET',
      responseType: 'stream',
      headers: {
        Cookie: loginCredentials[1][0],
      },
    });

    // console.log(response);

    response.data.pipe (writer);

    return new Promise ((resolve, reject) => {
      writer.on ('finish', () => {
        let path = abs_path (`/student_data/transcripts/${studentNumber}.pdf`);
        fs.readFile (path, (err, data) => {
          if (err) {
            reject (err);
          } else {
            console.log (data);
            resolve (data);
          }
        });
      });
      writer.on ('error', reject);
    });
  }
}

async function getTranscript (user, username, password, district) {
  try {
    if (user.student_number) {
      updateTranscript (user, username, password, district);
      let path = abs_path (
        `/student_data/transcripts/${user.student_number}.pdf`
      );
      return new Promise ((resolve, reject) => {
        fs.access (path, async err => {
          if (err) {
            let data = await updateTranscript (
              user,
              username,
              password,
              district
            );
            console.log (data);
            if (data) {
              resolve ({status: 'ok', data});
            } else {
              reject ({
                status: 'error',
                error: 'Invalid Login Credentials. Please Try Again.',
              });
            }
          } else {
            fs.readFile (path, (err, data) => {
              if (err) {
                reject ({error: err.message, status: 'error'});
              } else {
                resolve ({data, status: 'ok'});
              }
            });
          }
        });
      });
    } else {
      let data = await updateTranscript (user, username, password, district);
      if (data) {
        return {status: 'ok', data};
      } else {
        return {
          status: 'error',
          error: 'Invalid Login Credentials. Please Try Again.',
        };
      }
    }
  } catch (e) {
    return {status: 'error', error: e.message};
  }
}

router.get ('/', async (req, res) => {
  try {
    // let homework = await getHomework(req.query.username, req.query.password, req.query.district);
    let school = await models['school'].findOne ({
      district: req.query.district,
    });
    let user = await models['user'].findOne ({
      $and: [{username: req.query.username}, {school: school._id}],
    });

    let transcript = await getTranscript (
      user,
      req.query.username,
      req.query.password,
      req.query.district
    );

    if (transcript.status == 'ok') {
      user = await models['user'].findById (user._id);
      res.setHeader ('Content-Type', 'application/pdf');
      //   console.log (
      //     abs_path (`/student_data/transcripts/${user.student_number}.pdf`)
      //   );
      //   res.sendFile (
      //     abs_path (`/student_data/transcripts/${user.student_number}.pdf`)
      //   );
      res.end (transcript.data);
    } else {
      res.error (transcript.error);
    }
  } catch (e) {
    console.log (e);
    res.error (e.error);
  }
});

module.exports = router;
