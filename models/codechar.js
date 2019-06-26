const mongoose = require("mongoose");




const CodeSchema = new mongoose.Schema({
  code: {
      type: String,
      required: true,
  },
  course: {
    type: String,
    required: true,
  },
  school: {
    type : mongoose.Schema.Types.ObjectId,
    ref: "school",
    required: true,
  },
});

var Code = mongoose.model('code', CodeSchema);
module.exports = Code;
