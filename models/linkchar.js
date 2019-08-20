const mongoose = require ('mongoose');

const LinkChar = mongoose.Schema ({
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
  },
  link: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date (),
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true,
  },
});

const Link = mongoose.model ('link', LinkChar);
module.exports = Link;
