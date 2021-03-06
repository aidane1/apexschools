const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const https = require("https");
const cheerio = require("cheerio");
const querystring = require("querystring");
const request = require("request");
const Axios = require("axios");

const AccountSchema = mongoose.Schema({
  //["user", "teacher", "admin"]
  account_type: {
    type: String,
    required: true
  },
  date_created: {
    type: Date,
    default: new Date()
  },
  reference_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  api_key: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "apikey"
  },
  permission_level: {
    type: Number,
    default: 0
  }
});

async function getLoginCredentials(username, password, district) {
  return new Promise(function(resolve, reject) {
    var postData = {
      ctl00$FormContentPlaceHolder$USERID: username,
      ctl00$FormContentPlaceHolder$PAUTH: password,
      ctl00$FormContentPlaceHolder$btnOK: "Sign In",
      __EVENTTARGET: "",
      __EVENTARGUMENT: "",
      __VIEWSTATE: "",
      __VIEWSTATEGENERATOR: "",
      __EVENTVALIDATION: ""
    };
    https.get(
      `https://cimsweb.${district}.bc.ca/SchoolConnect/StuConSignon.aspx`,
      function(res) {
        let data = "";
        res.on("data", function(chunk) {
          data += chunk;
        });
        res.on("end", function() {
          let $ = cheerio.load(data);
          $("input").each(function(i, input) {
            if (input.attribs.value) {
              postData[input.attribs.name] = input.attribs.value;
            }
          });
          resolve([querystring.stringify(postData), res.headers["set-cookie"]]);
        });
      }
    );
  });
}
async function login(data, cookies, district) {
  return new Promise(function(resolve, reject) {
    let options = {
      url: `https://cimsweb.${district}.bc.ca/SchoolConnect/StuConSignon.aspx?${data}`,
      method: "GET",
      headers: {
        Cookie: cookies[0]
      }
    };
    request(options, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
}

function retrieveUserData(body) {
  let $ = cheerio.load(body);
  return [
    ...$("#UserOptionsTextPlaceHolder_UserInfo")
      .text()
      .split(" "),
    $("#FormContentPlaceHolder_SGRADE").val()
  ];
}

AccountSchema.statics.authenticateSchool = async (
  username,
  password,
  school
) => {
  try {
    username = username.toLowerCase();
    let userSchool = await models.school.findOne({ _id: school });
    userSchool = JSON.parse(JSON.stringify(userSchool));
    let headers = await getLoginCredentials(
      username,
      password,
      userSchool.district.toLowerCase()
    );
    let body = await login(
      headers[0],
      headers[1],
      userSchool.district.toLowerCase()
    );
    let userData = retrieveUserData(body);
    if (userData[1] && userData[2] && userData[4]) {
      let first_name = userData[1];
      let last_name = userData[2];
      let student_number = userData[4];
      let grade = parseInt(userData[5]) || 12;
      let id = mongoose.Types.ObjectId();
      let user = await models.user.create({
        school,
        username,
        reference_id: id,
        first_name,
        last_name,
        student_number,
        grade
      });
      let accountObject = {
        _id: id,
        username,
        password,
        school,
        account_type: "user",
        reference_id: user._id
      };
      let account = await models.account.create(accountObject);
      return account;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

AccountSchema.statics.create_teacher = async (teacher_code, school) => {
  try {
    let teacher = await global.models["teacher"].findOne({
      $and: [{ teacher_code }, { school }]
    });
    if (teacher && teacher != null) {
      let courses = await models["course"].find({ teacher: teacher._id });
      let id = mongoose.Types.ObjectId();
      let user = await models.user.create({
        school,
        username: teacher_code,
        reference_id: id,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        student_number: "0",
        grade: 12,
        courses: courses.map(course => course._id)
      });
      let accountObject = {
        _id: id,
        username: teacher_code,
        password: "1",
        school,
        account_type: "teacher",
        reference_id: user._id
      };
      let account = await models.account.create(accountObject);
      return account;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

AccountSchema.statics.authenticate_teacher = (teacher_code, school) => {
  teacher_code = teacher_code.toUpperCase();
  return new Promise(async (resolve, reject) => {
    let account = await Account.findOne({
      $and: [
        { username: teacher_code },
        { school },
        { account_type: "teacher" }
      ]
    });
    if (account && account != null) {
      let teacher = await models["teacher"].findOne({
        $and: [{ teacher_code }, { school }]
      });
      if (teacher && teacher != null) {
        let courses = await models["course"].find({ teacher: teacher._id });
        await models["user"].findOneAndUpdate(
          { _id: account.reference_id },
          { $set: { courses: courses.map(course => course._id) } }
        );
      }
      resolve(account);
    } else {
      let teacherAccount = await Account.create_teacher(teacher_code, school);
      if (teacherAccount !== false) {
        resolve(teacherAccount);
      } else {
        reject("Teacher not found. Please try again.");
      }
    }
  });
};

AccountSchema.statics.authenticate = (username, password, school) => {
  username = username.toLowerCase();
  return new Promise(async (resolve, reject) => {
    try {
      let account = await Account.findOne({
        $and: [{ username }, { school }, { account_type: "user" }]
      });
      if (account && account != null) {
        bcrypt.compare(password, account.password, async (err, result) => {
          if (result) {
            resolve(account);
          } else {
            reject("password incorrect");
          }
        });
      } else {
        let schoolAccount = await Account.authenticateSchool(
          username,
          password,
          school
        );
        if (schoolAccount !== false) {
          resolve(schoolAccount);
        } else {
          reject("User not found. Please try again.");
        }
      }
    } catch (e) {
      console.log(e);
      reject(e.message);
    }
  });
};

AccountSchema.methods.stringify = function() {
  return JSON.parse(JSON.stringify(this));
};

AccountSchema.methods.getRoutes = function() {
  let permissions = {
    "-1": {
      get: {
        method: "get",
        paths: ["/*"],
        not: ["/authenticate"]
      },
      post: {
        method: "post",
        paths: ["/contact"],
        not: []
      },
      put: {
        method: "put",
        paths: ["/chatroom-keys/pull/:user"],
        not: []
      },
      delete: {
        method: "delete",
        paths: [],
        not: []
      }
    },
    "0": {
      get: {
        method: "get",
        paths: ["/*"],
        not: ["/authenticate"]
      },
      post: {
        method: "post",
        paths: ["/:collection"],
        not: []
      },
      put: {
        method: "put",
        paths: [
          "/users/:user",
          "/resources/:resource",
          "/assignments/:assignment",
          "/topics/:topic",
          "/notes/:note",
          "/posts/:post",
          "/comments/:comment",
          "/chatroom-keys/pull/:user"
        ],
        not: []
      },
      delete: {
        method: "delete",
        paths: [
          "/resources/:resource",
          "/assignments/:assignment",
          "/topics/:topic",
          "/notes/:note",
          "/posts/:post",
          "/comments/:comment"
        ],
        not: []
      }
    },
    "1": {
      get: {
        method: "get",
        paths: ["/*"],
        not: ["/authenticate"]
      },
      post: {
        method: "post",
        paths: ["/:collection"],
        not: []
      },
      put: {
        method: "put",
        paths: [
          ,
          "/users/:user",
          "/resources/:resource",
          "/assignments/:assignment",
          "/topics/:topic",
          "/notes/:note",
          "/posts/:post",
          "/comments/:comment",
          "/chatroom-keys/pull/:user"
        ],
        not: []
      },
      delete: {
        method: "delete",
        paths: [
          "/resources/:resource",
          "/assignments/:assignment",
          "/topics/:topic",
          "/notes/:note",
          "/posts/:post",
          "/comments/:comment"
        ],
        not: []
      }
    },
    "2": {
      get: {
        method: "get",
        paths: ["/*"],
        not: ["/authenticate"]
      },
      post: {
        method: "post",
        paths: ["/:collection"],
        not: []
      },
      put: {
        method: "put",
        paths: [
          "/users/:user",
          "/resources/:resource",
          "/assignments/:assignment",
          "/topics/:topic",
          "/notes/:note",
          "/posts/:post",
          "/comments/:comment",
          "/chatroom-keys/pull/:user"
        ],
        not: []
      },
      delete: {
        method: "delete",
        paths: [
          "/resources/:resource",
          "/assignments/:assignment",
          "/topics/:topic",
          "/notes/:note",
          "/posts/:post",
          "/comments/:comment"
        ],
        not: []
      }
    },
    "3": {
      get: {
        method: "get",
        paths: ["/*"],
        not: ["/authenticate"]
      },
      post: {
        method: "post",
        paths: ["/:collection"],
        not: []
      },
      put: {
        method: "put",
        paths: ["/:collection/:item", "/chatroom-keys/pull/:user"],
        not: []
      },
      delete: {
        method: "delete",
        paths: ["/:collection/:item"],
        not: []
      }
    }
  };
  return permissions[this.permission_level.toString()] || permissions["-1"];
};

AccountSchema.pre("save", function(next) {
  let account = this;
  bcrypt.hash(account.password, 10, async function(err, hash) {
    if (err) {
      console.log(err);
      return err;
    }
    account.password = hash;
    let apikey = await models.apikey.create({ reference_account: account._id });
    account.api_key = apikey._id;
    next();
  });
});

const Account = mongoose.model("account", AccountSchema);
module.exports = Account;
