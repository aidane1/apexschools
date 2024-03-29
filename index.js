global.base_dir = __dirname;
global.abs_path = function (path) {
  return base_dir + path;
};

global.include = function (file) {
  return require (abs_path ('/' + file));
};

const config = include ('config.json');

const NODE_ENVS = ['production', 'development'];

const configData =
  config[
    NODE_ENVS.indexOf (process.env.NODE_ENV) >= 0
      ? process.env.NODE_ENV
      : NODE_ENVS[0]
  ];

const fileParsing = require (__dirname + '/file_parsing/index');

const keys = include ('secrets.json');

global.server_info = {
  config: configData,
  keys,
};

global.sendMail = include ('email/send_email.js');

const Account = require (__dirname + '/models/accountchar');
const User = require (__dirname + '/models/accounts/userchar');
const Resource = require (__dirname + '/models/resourcechar');
const School = require (__dirname + '/models/schoolchar');
const ApiKey = require (__dirname + '/models/apikeychar');
const Topic = require (__dirname + '/models/topicchar');
const Assignment = require (__dirname + '/models/assignmentchar');
const Note = require (__dirname + '/models/notechar');
const Teacher = require (__dirname + '/models/teacherchar');
const Block = require (__dirname + '/models/blockchar');
const Category = require (__dirname + '/models/categorychar');
const Semester = require (__dirname + '/models/semesterchar');
const Course = require (__dirname + '/models/coursechar');
const Code = require (__dirname + '/models/codechar');
const CourseText = require (__dirname + '/models/coursetextchar');
const GradeText = require (__dirname + '/models/gradetextchar');
const SchoolText = require (__dirname + '/models/schooltextchar');
const {Post, Comment} = require (__dirname + '/models/postchar');
const Event = require (__dirname + '/models/eventchar');
const {AnnouncementDay, AnnouncementTile, Announcement} = require (__dirname +
  '/models/announcementchar');
const Text = require (__dirname + '/models/wstext');
const ImportantDate = require (__dirname + '/models/importantdatechar');
const Notification = require (__dirname + '/models/notificationchar');
const TeacherAccount = require (__dirname + '/models/accounts/teacherchar');
const Link = require (__dirname + '/models/linkchar');
const StudentFile = require (__dirname + '/models/studentfilechar');
const Poll = require (__dirname + '/models/pollchar');

['log', 'warn'].forEach (function (method) {
  var old = console[method];
  console[method] = function () {
    var stack = new Error ().stack.split (/\n/);
    // Chrome includes a single "Error" line, FF doesn't.
    if (stack[0].indexOf ('Error') === 0) {
      stack = stack.slice (1);
    }
    var args = [].slice.apply (arguments).concat ([stack[1].trim ()]);
    return old.apply (console, args);
  };
});

global.models = {
  account: Account,
  user: User,
  resource: Resource,
  school: School,
  apikey: ApiKey,
  topic: Topic,
  assignment: Assignment,
  teacher: Teacher,
  block: Block,
  category: Category,
  semester: Semester,
  course: Course,
  code: Code,
  note: Note,
  'course-text': CourseText,
  'grade-text': GradeText,
  'school-text': SchoolText,
  post: Post,
  comment: Comment,
  event: Event,
  announcement: Announcement,
  'announcement-tile': AnnouncementTile,
  'announcement-day': AnnouncementDay,
  text: Text,
  'important-date': ImportantDate,
  notification: Notification,
  'teacher-account': TeacherAccount,
  link: Link,
  'student-file': StudentFile,
  poll: Poll,
};

global.pluralModels = {
  accounts: Account,
  users: User,
  resources: Resource,
  schools: School,
  apikeys: ApiKey,
  topics: Topic,
  assignments: Assignment,
  teachers: Teacher,
  blocks: Block,
  categories: Category,
  semesters: Semester,
  courses: Course,
  codes: Code,
  notes: Note,
  'course-texts': CourseText,
  'grade-texts': GradeText,
  'school-texts': SchoolText,
  posts: Post,
  comments: Comment,
  events: Event,
  announcements: Announcement,
  'announcement-tiles': AnnouncementTile,
  'announcement-days': AnnouncementDay,
  texts: Text,
  'important-dates': ImportantDate,
  notifications: Notification,
  'teacher-accounts': TeacherAccount,
  links: Link,
  'student-files': StudentFile,
  polls: Poll,
};

global.actions = {};

global.dispatchAction = (action, body) => {
  let callbacks = global.actions[action] || [];
  callbacks.forEach (callback => {
    callback (action, body);
  });
};

global.bindAction = (action, callback) => {
  if (global.actions[action]) {
    global.actions[action].push (callback);
  } else {
    global.actions[action] = [callback];
  }
};

const database = include ('/database/database');

const app = include ('/app/server');

const push_notifications = include ('/push_notifications/index');

const interaction_tokens = include ('/interaction_tokens/index');

const scheduled_events = include ('/scheduled_events/index');

database ()
  .then (() => {
    app ();
    if (server_info.config.update_info) {
      console.log ('updating');
      fileParsing ();
    }
    push_notifications ();
    interaction_tokens ();
    scheduled_events ();
  })
  .catch (e => {
    console.log (e);
    console.log ('server did not bind successfully');
  });
