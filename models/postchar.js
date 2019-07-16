const mongoose = require ('mongoose');

const postSchema = new mongoose.Schema ({
  hidden: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: new Date (),
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    default: '',
  },
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  show_username: {
    type: Boolean,
    default: true,
  },
  tags: {
    type: Array,
    default: [],
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
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'comment'}],
});

const commentSchema = new mongoose.Schema ({
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
  },
  parents: [{type: mongoose.Schema.Types.ObjectId}],
  children: [{type: mongoose.Schema.Types.ObjectId, ref: 'comment'}],
  body: {
    type: String,
  },
  depth: {
    type: Number,
    default: 0,
  },
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  tree_children: {
    type: Array,
    default: [],
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true,
  },
  resources: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'resource'}],
    default: [],
  }
});

var Post = mongoose.model ('post', postSchema);
var Comment = mongoose.model ('comment', commentSchema);
module.exports = {
  Post,
  Comment,
};
