const mongoose = require ('mongoose');

const UserSchema = mongoose.Schema ({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "school",
    required: true,
  },
  reference_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: true,
  },
  courses: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'course'}],
    default: [],
  },
  // for renamed blocks (ex. user manually changes block E from snackshack 11/12 to snackshack)
  block_names: {
    type: Object,
    default: {},
  },

  block_colors: {
    type: Object,
    default: {},
  },
  // list of assignments the user has completed
  completed_assignments: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'assignment'}],
    default: [],
  },

  grade: {
    type: Number,
    default: 9,
  },

  before_school_activities: {},

  during_school_activities: {},

  after_school_activities: {},

  student_number: {
    type: String,
    default: '',
  },
  first_name: {
    type: String,
    default: '',
  },
  last_name: {
    type: String,
    default: '',
  },
  schedule_images: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'resource'}],
    default: [],
  },
  schedule_type: {
    type: String,
    default: 'schedule',
  },
  notifications: {
    type: {
      daily_announcements: {type: Boolean, default: false},
      next_class: {type: Boolean, default: false},
      new_assignments: {type: Boolean, default: true},
      image_replies: {type: Boolean, default: true},
      upcoming_events: {type: Boolean, default: true},
      activities: {type: Boolean, default: true},
      marked_assignments: {type: Boolean, default: false},
    },
    default: {
      daily_announcements: false,
      next_class: false,
      new_assignments: true,
      image_replies: true,
      activities: true,
      upcoming_events: true,
    },
  },
  theme: {
    type: String,
    default: 'Dark',
  },
  true_dark: {
    type: Boolean,
    default: false,
  },
  visually_impared: {
    type: Boolean,
    default: false,
  },
  grade_only_announcements: {
    type: Boolean,
    default: false,
  },
  automatic_mark_retrieval: {
    type: Boolean,
    default: false,
  },
  automatic_course_retrieval: {
    type: Boolean,
    default: false,
  },
  push_token: {
    type: String,
  },
  profile_picture: {
    type: String,
    default: "",
  },
  chatrooms: {
    type: Array,
    default: [],
  },
  unviewed_chatrooms: {
    type: Array,
    default: [],
  },
  //tokens given to users every time they vote, comment, create an assignment, etc...
  interaction_tokens: {
    type: {
      //each vote is work 1 token
      votes: [],
      //each comment is worth 0-3 tokens
      //helpfulness 0-33% : 1
      //helpfulness 33-66% : 2
      //helpfulness 66-100%: 3
      comments: [],
      //each created assignment is worth 0-5 tokens
      //helpfulness 0-33% : 1
      //helpfulness 33-66% : 3
      //helpfulness 66-100%: 5
      created_assignments: [],
      //each created note is woth 0-3 tokens
      //helpfulness 0-33% : 1
      //helpfulness 33-66% : 2
      //helpfulness 66-100%: 3
      created_notes: [],
      //each created question is worth 0-5 tokens
      //helpfulness 0-33% : 1
      //helpfulness 33-66% : 3
      //helpfulness 66-100%: 5
      created_questions: [],
      //each completed survey is worth 5 to 15 tokens
      completed_surveys: [],
      //each completed poll is worth 1 to 5 tokens
      completed_polls: [],
      //each assignment that the user responds to with an image is worth 3 tokens
      response_images: [],
      //the amount of spent or otherwise negated tokens
      negated_tokens: 0
    },
  }
});

const User = mongoose.model ('user', UserSchema);
module.exports = User;
