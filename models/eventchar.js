const mongoose = require ('mongoose');

const EventSchema = mongoose.Schema ({
  grades: {
    type: Array,
    default: [9, 10, 11, 12],
  },
  title: {
    type: String,
  },
  event_date: {
    type: Date,
    default: new Date(),
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
