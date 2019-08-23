const mongoose = require ('mongoose');

const EventSchema = mongoose.Schema ({
  title: {
    type: String,
    required: true,
  },
  event_date: {
    type: Date,
    default: new Date(),
    required: true,
  },
  time: {
    type: String,
    default: "",
    required: true,
  },
  school_in: {
    type: Boolean, 
    default: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true,
  },
  school_skipped: {
    type: Boolean,
    default: false,
  },
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

const Event = mongoose.model ('event', EventSchema);
module.exports = Event;
