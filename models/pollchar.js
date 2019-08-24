const mongoose = require ('mongoose');

const PollSchema = mongoose.Schema ({
  date: {
    type: Date,
    default: new Date (),
  },
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
  },
  title: {
    type: String,
    required: true,
  },
  options: {
    type: [{type: String}],
  },
  votes: {
    type: Array,
  },
  default: [],
});

const Poll = mongoose.model ('poll', PollSchema);
module.exports = Poll;
