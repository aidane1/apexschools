const mongoose = require ('mongoose');

const ImportantDateSchema = mongoose.Schema ({
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
  },
  //one of: field trip, exam, quiz, test, rehersal
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  date: {
    type: Date,
    default: new Date (),
  },
  reference_course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course',
  },
  resources: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'resource'}],
    default: [],
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true,
  },
  helpful_votes: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    default: [],
  },
  unhelpful_votes: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    default: [],
  },
  reports: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    default: [],
  },
});

const ImportantDate = mongoose.model ('important-date', ImportantDateSchema);
module.exports = ImportantDate;
