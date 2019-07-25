const mongoose = require ('mongoose');

// preload the announcement document with the contents of the previous announcement created

const AnnouncementDaySchema = mongoose.Schema ({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true,
  },
  tiles: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'announcement-tile'}],
    default: [],
  },
  file_path: {
    type: String,
  },
  date_announced: {
      type: Date,
  },
  is_current: {
    type: Boolean,
    default: false,
  },
  most_recent: {
    type: Boolean,
    default: false,
  }
});

const AnnouncementTileSchema = mongoose.Schema ({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  announcements: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'announcement'}],
    default: [],
  },
});

const AnnouncementSchema = mongoose.Schema ({
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true,
  },
  grades: {
    type: [{type: Number}],
    default: [9, 10, 11, 12],
  },
  is_new: {
    type: Boolean,
    default: false,
  },
  delta: {
    type: [
      {
        type: Object,
      },
    ],
    required: true,
  },
});

const AnnouncementDay = mongoose.model (
  'announcement-day',
  AnnouncementDaySchema
);
const AnnouncementTile = mongoose.model (
  'announcement-tile',
  AnnouncementTileSchema
);
const Announcement = mongoose.model ('announcement', AnnouncementSchema);

module.exports = {
  AnnouncementDay,
  AnnouncementTile,
  Announcement,
};
