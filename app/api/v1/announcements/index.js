const express = require ('express');
const router = express.Router ();
const fs = require ('fs');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  TextWrappingSide,
  TextWrappingType,
} = require ('docx');
const moment = require ('moment');

router.get ('/announcement-day', async (req, res) => {});

router.get ('/announcements', async (req, res) => {
  try {
    announcement = await models['announcement-day']
      .find ({school: req.account.school})
      .populate ({
        path: 'tiles',
        populate: {
          path: 'announcements',
        },
      })
      .limit (parseInt(req.query.limit) || 30);
    res.okay (announcement);
  } catch (e) {
    console.log (e);
    res.error (e.message);
  }
});

router.get ('/new-announcement', async (req, res) => {
  if (req.account.permission_level >= 3) {
    try {
      let announcement = await models['announcement-day'].findOne ({
        $and: [
          {
            school: req.account.school,
          },
          {
            is_current: true,
          },
        ],
      });
      if (announcement && announcement !== null) {
      } else {
        announcement = await models['announcement-day'].create ({
          is_current: true,
          school: req.account.school,
        });
      }
      announcement = await models['announcement-day']
        .findById (announcement._id)
        .populate ({
          path: 'tiles',
          populate: {
            path: 'announcements',
          },
        });
      res.okay (announcement);
    } catch (e) {
      console.log (e);
      res.error (e.message);
    }
  } else {
    res.error ('Permission requirements not met. Please try again.');
  }
});

router.post ('/announcement-tile', async (req, res) => {
  try {
    let announcement = await models['announcement-day'].findOne ({
      $and: [
        {
          school: req.account.school,
        },
        {
          is_current: true,
        },
      ],
    });
    if (announcement && announcement !== null) {
    } else {
      announcement = await models['announcement-day'].create ({
        is_current: true,
        school: req.account.school,
      });
    }
    let tile = await models['announcement-tile'].create ({
      title: req.body.title,
      school: req.account.school,
    });
    await models['announcement-day'].findOneAndUpdate (
      {_id: announcement._id},
      {$push: {tiles: {$each: [tile._id], position: 0}}},
      {
        new: true,
      }
    );
    res.okay (tile);
  } catch (e) {
    console.log (e);
    res.error (e.message);
  }
});

router.post ('/announcement', async (req, res) => {
  try {
    let announcementDay = await models['announcement-day'].findOne ({
      $and: [
        {
          school: req.account.school,
        },
        {
          is_current: true,
        },
        {
          tiles: req.body.tile,
        },
      ],
    });
    if (announcementDay && announcementDay !== null) {
      let announcement = await models['announcement'].create ({
        delta: req.body.delta,
        grades: req.body.grades,
        school: req.account.school,
        is_new: true,
      });
      await models['announcement-tile'].findOneAndUpdate (
        {_id: req.body.tile},
        {$push: {announcements: announcement._id}}
      );
      announcementDay = await models['announcement-day']
        .findById (announcementDay._id)
        .populate ({
          path: 'tiles',
          populate: {
            path: 'announcements',
          },
        });
      res.okay (announcementDay);
    } else {
      res.error (
        'Announcement does not exist or is not current. Please try again.'
      );
    }
  } catch (e) {
    console.log (e);
    res.error (e.message);
  }
});

router.put ('/announcement/:id', async (req, res) => {
  try {
    let announcementDay = await models['announcement-day'].findOne ({
      $and: [
        {
          school: req.account.school,
        },
        {
          is_current: true,
        },
        {
          tiles: req.body.tile,
        },
      ],
    });
    if (announcementDay && announcementDay !== null) {
      await models['announcement'].findOneAndUpdate (
        {
          _id: req.params.id,
        },
        {
          delta: req.body.delta,
          grades: req.body.grades,
          is_new: true,
        }
      );
      announcementDay = await models['announcement-day']
        .findById (announcementDay._id)
        .populate ({
          path: 'tiles',
          populate: {
            path: 'announcements',
          },
        });
      res.okay (announcementDay);
    } else {
      res.error (
        'Announcement does not exist or is not current. Please try again.'
      );
    }
  } catch (e) {
    console.log (e);
    res.error (e.message);
  }
});

router.delete ('/announcement-tile/:id', async (req, res) => {
  try {
    await models['announcement-tile'].findByIdAndDelete (req.params.id);
    let announcement = await models['announcement-day']
      .findById (req.query['announcement-day'])
      .populate ({
        path: 'tiles',
        populate: {
          path: 'announcements',
        },
      });
    res.okay (announcement);
  } catch (e) {
    console.log (e);
    res.error (e.message);
  }
});

router.delete ('/announcement/:id', async (req, res) => {
  try {
    await models['announcement'].findByIdAndDelete (req.params.id);
    let announcement = await models['announcement-day']
      .findById (req.query['announcement-day'])
      .populate ({
        path: 'tiles',
        populate: {
          path: 'announcements',
        },
      });
    res.okay (announcement);
  } catch (e) {
    console.log (e);
    res.error (e.message);
  }
});

let populateAnnouncements = tile => {
  console.log (tile);
  return new Promise (async (resolve, reject) => {
    let announcements = tile.announcements.map (announcement => {
      return models['announcement'].findOne ({_id: announcement});
    });
    announcements = await Promise.all (announcements);
    tile.announcements = announcements;
    resolve (tile);
  });
};

duplicateAssignments = tile => {
  return new Promise (async (resolve, reject) => {
    let announcements = tile.announcements.map (announcement => {
      announcement = JSON.parse (JSON.stringify (announcement));
      delete announcement['_id'];
      return models['announcement'].create (announcement);
    });
    announcements = await Promise.all (announcements);
    announcements = announcements.map (announcement => announcement._id);
    tile.announcements = announcements;
    resolve (tile);
  });
};

let makeTileAnnouncement = announcement => {
  let announcementRuns = [];
  announcement.delta.forEach (delta => {
    let text = new TextRun (delta.insert)
      .color ('000000')
      .size (26)
      .font ('Helvetica Neue');
    if (delta.attributes) {
      delta.attributes.italic && text.italics ();
      delta.attributes.bold && text.bold ();
      delta.attributes.underline && text.underline ();
    }
    announcementRuns.push (text);
  });
  let paragraph = new Paragraph ();
  announcementRuns.forEach (run => {
    paragraph.addRun (run);
  });
  return paragraph.bullet (120);
};

let makeDocumentTile = tile => {
  let paragraph = new Paragraph ('').heading3 ().left ();
  let paragraphTitle = new TextRun (`\n${tile.title}`)
    .underline ()
    .size (52)
    .color ('810009')
    .font ('Helvetica Neue');
  paragraph.addRun (paragraphTitle);
  paragraph.addRun (new TextRun ('\n').size (32));

  let paragraphBullets = tile.announcements.map (announcement => {
    return makeTileAnnouncement (announcement);
  });

  return [paragraph, ...paragraphBullets];
};

let makeDocument = async announcement => {
  announcement = await models['announcement-day']
    .findById (announcement._id)
    .populate ({
      path: 'tiles',
      populate: {
        path: 'announcements',
      },
    });

  let school = await models['school'].findOne ({_id: announcement.school});
  let dayTitle = 'Off';
  let date = moment (announcement.date_announced).format (
    'dddd, MMMM Do, YYYY'
  );
  let image = false;
  if (school) {
    image = fs.readFileSync (abs_path (`/public/logos/${school.logo}`));
    let date = announcement.date_announced;

    let today =
      school.year_day_object[
        `${date.getFullYear ()}_${date.getMonth ()}_${date.getDate ()}`
      ];

    if (
      today &&
      school.day_titles[today.week] &&
      school.day_titles[today.week][today.day]
    ) {
      dayTitle = school.day_titles[today.week][today.day];
    }
  }

  const doc = new Document ();

  if (image !== false) {
    doc.createImage (image, 100, 100, {
      floating: {
        horizontalPosition: {
          offset: 3300000,
        },
        verticalPosition: {
          offset: 100,
        },
        wrap: {
          type: TextWrappingType.SQUARE,
          side: TextWrappingSide.BOTH_SIDES,
        },
        margins: {
          top: 201440,
          bottom: 201440,
        },
      },
    });
  }

  const titleParagraph = new Paragraph ('').heading1 ().center ();

  let titleText = new TextRun ('Daily Announcements')
    .bold ()
    .font ('Helvetica Neue')
    .size (60)
    .underline ()
    .color ('000000');
  titleParagraph.addRun (titleText);

  doc.addParagraph (titleParagraph);

  const dayParagraph = new Paragraph ('').heading2 ().left ();

  let dateText = new TextRun (`\n${date}`)
    .bold ()
    .font ('Helvetica Neue')
    .size (40)
    .color ('888888');
  let dayText = new TextRun (dayTitle)
    .bold ()
    .font ('Helvetica Neue')
    .size (40)
    .color ('888888')
    .break ();

  dayParagraph.addRun (dateText);
  dayParagraph.addRun (dayText);

  doc.addParagraph (dayParagraph);

  let tiles = announcement.tiles.map (tile => {
    return makeDocumentTile (tile);
  });

  tiles.forEach (tile => {
    tile.forEach (paragraph => {
      doc.addParagraph (paragraph);
    });
  });

  const packer = new Packer ();

  packer.toBuffer (doc).then (buffer => {
    fs.writeFileSync (__dirname + '/My Document.docx', buffer);
  });
  //   let html = `
  //     <div style="background-color: red">
  //         Hello!
  //     </div>
  //   `

  //   let docx = HtmlDocx.asBlob (html);
  //   fs.writeFileSync (__dirname + '/My Document.docx', html);
};

router.get ('/announce', async (req, res) => {
  try {
    await models['announcement-day'].updateMany (
      {most_recent: true},
      {$set: {most_recent: false}}
    );
    let announcement = await models['announcement-day'].findOneAndUpdate (
      {
        $and: [
          {is_current: true},
          {
            school: req.account.school,
          },
        ],
      },
      {
        $set: {
          is_current: false,
          date_announced: new Date (),
          most_recent: true,
        },
      },
      {new: 'true'}
    );
    makeDocument (announcement);
    global.dispatchAction ('announcements', announcement);
    let tiles = announcement.tiles.map (tile => {
      return models['announcement-tile'].findById (tile);
    });
    tiles = await Promise.all (tiles);
    tiles = tiles.map (populateAnnouncements);
    tiles = await Promise.all (tiles);
    tiles = tiles.map (duplicateAssignments);
    tiles = await Promise.all (tiles);
    tiles = tiles.map (tile => {
      tile = JSON.parse (JSON.stringify (tile));
      delete tile['_id'];
      return models['announcement-tile'].create (tile);
    });
    tiles = await Promise.all (tiles);
    let newAnnouncement = await models['announcement-day'].create ({
      is_current: true,
      school: req.account.school,
      tiles: tiles.map (tile => tile._id),
    });
    newAnnouncement = await models['announcement-day']
      .findById (newAnnouncement._id)
      .populate ({
        path: 'tiles',
        populate: {
          path: 'announcements',
        },
      });
    res.okay (newAnnouncement);
  } catch (e) {
    console.log (e);
    try {
      let announcement = await models['announcement-day'].findOneAndUpdate (
        {
          $and: [
            {most_recent: true},
            {
              school: req.account.school,
            },
          ],
        },
        {
          $set: {
            is_current: true,
          },
        }
      );
      res.okay (announcement);
    } catch (e) {
      console.log (e);
      res.error (e.message);
    }
  }
});

module.exports = router;
