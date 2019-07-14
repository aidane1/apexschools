const mongoose = require ('mongoose');

const UserSchema = mongoose.Schema ({
  courses: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'course'}],
    default: [],
  },
  // for renamed blocks (ex. user manually changes block E from snackshack 11/12 to snackshack)
  block_names: {
    type: Object,
    default: {},
  },
  // list of assignments the user has completed
  completed_assignments: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'assignment'}],
    default: [],
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
    },
    default: {
      daily_announcements: false,
      next_class: false,
      new_assignments: true,
      image_replies: true,
      upcoming_events: true,
    },
  },
  theme: {
    type: String,
    default: 'Light',
  },
  true_dark: {
    type: Boolean,
    default: false,
  },
  visually_impared: {
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
      default: "",
  }
});

const User = mongoose.model ('user', UserSchema);
module.exports = User;
