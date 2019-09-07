const moment = require("moment-timezone");

let scheduleEvent = (time, callback) => {
  setInterval(() => {
    let date = moment(new Date()).tz("America/Vancouver");
    if (date.hours() === time.hour && date.minutes() === time.minute) {
      callback();
    }
  }, 60000);
};

let intervalEvent = (interval, callback) => {
  setInterval(callback, interval);
};

module.exports = () => {
  scheduleEvent({ hour: 7, minute: 30 }, async () => {
    await global.models["user"].updateMany(
      {},
      { $set: { unviewed_chatrooms: [] } }
    );
  });
  intervalEvent(10 * 60 * 1000, async () => {
    await global.models["user"].updateMany(
      {},
      { $set: { unviewed_chatrooms: [] } }
    );
  });
};
