const mongoose = require ('mongoose');

const NotificationChar = mongoose.Schema ({
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
  },
  data: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date (),
  },
  send_instantly: {
    type: Boolean,
    default: true,
  },
  send_date: {
    type: Date,
    default: new Date (),
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true,
  },
  has_been_sent: {
    type: Boolean,
    default: false,
  },
});

const Notification = mongoose.model ('notification', NotificationChar);
module.exports = Notification;
