const mongoose = require ('mongoose');

const NoteSchema = mongoose.Schema ({
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  username: {
    type: String,
    default: '',
  },
  note: {
    type: String,
    required: true,
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
  topic: {
    type: mongoose.Schema.Types.ObjectId,
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

const Note = mongoose.model ('note', NoteSchema);
module.exports = Note;
