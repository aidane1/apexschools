const express = require ('express');

const router = express.Router ();

router.get ('/', async (req, res) => {
  try {
    let reference_courses = req.query.reference_course;
    let find_fields = req.query.find_fields;
    let uploaded_by = req.query.uploaded_by;
    let findFields = [];
    if (find_fields) {
      find_fields = find_fields.split (',');
      find_fields.forEach (field => {
        let currentField = {};
        if (req.query[field]) {
          currentField[field] = req.query[field];
        }
        findFields.push (currentField);
      });
    }
    if (reference_courses) {
      reference_courses = reference_courses.split (',');
      findFields.push ({reference_course: {$in: reference_courses}});
    }
    if (uploaded_by) {
      uploaded_by = uploaded_by.split (',');
      findFields.push ({uploaded_by: {$in: uploaded_by}});
    }
    let resources = pluralModels['comments'].find ({
      $and: [{school: req.school._id}, ...findFields],
    });
    let populateFeilds = req.query.populate;
    if (populateFeilds) {
      populateFeilds = populateFeilds.split (',');
      for (var i = 0; i < populateFeilds.length; i++) {
        resources.populate (populateFeilds[i]);
      }
    }
    let orderBy = req.query.order_by;
    if (orderBy) {
      let orderObject = {};
      orderObject[orderBy] = parseInt (req.query.order_direction);
      resources.sort (orderObject);
    }
    let limit = req.query.limit;
    if (limit) {
      resources.limit (parseInt (req.query.limit));
    }
    resources = await resources;
    res.okay (resources);
  } catch (e) {
    res.status (500);
    res.error (e.message);
  }
});

router.post ('/', async (req, res) => {
  try {
    let resource = await pluralModels['comments'].create ({
      ...req.body,
      school: req.school._id,
    });
    resource = pluralModels['comments'].findOne ({
      _id: resource._id,
    });
    let populateFeilds = req.query.populate;
    if (populateFeilds) {
      populateFeilds = populateFeilds.split (',');
      for (var i = 0; i < populateFeilds.length; i++) {
        resource.populate (populateFeilds[i]);
      }
    }
    resource = await resource;
    await models['post'].findOneAndUpdate (
      {_id: resource.parent},
      {$push: {comments: resource._id}}
    );
    if (req.body.depth != 0) {
      await models['comment'].findOneAndUpdate (
        {_id: req.body.parents[-1]},
        {$push: {children: resource._id}}
      );
    }
    global.dispatchAction ('comment-reply', resource);
    global.dispatchAction ('token-update', {
      ...JSON.parse (JSON.stringify (resource)),
      collection: 'comments',
    });
    res.okay (resource);
  } catch (e) {
    console.log (e);
    res.status (500);
    res.error (e.message);
  }
});

module.exports = router;
