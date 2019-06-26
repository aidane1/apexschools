const mongoose = require("mongoose");




const CategorySchema = new mongoose.Schema({
  category: {
      type: String,
      required: true,
  },
  short_code: {
    type: String,
  },
  school: {
    type : mongoose.Schema.Types.ObjectId,
    ref: "school",
    required: true,
  },
});

var Category = mongoose.model('category', CategorySchema);
module.exports = Category;
