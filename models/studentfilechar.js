const mongoose = require ('mongoose');

const StudentFileSchema = mongoose.Schema ({
  name: {
    type: String,
    required: true,
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'resource',
  },
  viewer_key: {
    type: String,
    default: ''
  },
  key_description: {
    type: String,
    default: 'School',
  },
  date_created: {
    type: Date,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true,
  },
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

const StudentFile = mongoose.model ('student-file', StudentFileSchema);
module.exports = StudentFile;
