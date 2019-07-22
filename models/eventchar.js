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
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true,
  },
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: true,
  },
});

const Event = mongoose.model ('event', EventSchema);
module.exports = Event;
