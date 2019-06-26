const mongoose = require("mongoose");




const SemesterChar = new mongoose.Schema({
  start_date: {
      type: Date,
      required: true,
  },
  end_date: {
      type: Date,
      required: true,
  },
  name: {
      type: String,
      required: true,
  },
  school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",
      required: true,
  }
});

let Semester = mongoose.model('semester', SemesterChar);
module.exports = Semester;
