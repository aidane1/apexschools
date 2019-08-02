const express = require ('express');

const router = express.Router ();

//syntax for populate: /api/v1/courses?populate=teacher,semester,category
//syntax for notes, etc: /api/v1/notes?reference_courses=id_1,id_2,id_3
//syntax for uploaded by: /api/v1/notes?uploaded_by=id_1
//syntax for created after date: /api/v1/posts?created_after={date format}&created_before={date format}

router.get ('/:collection', async (req, res) => {
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
    let resources = pluralModels[req.params.collection].find ({
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
    console.log (e);
    res.error (e.message);
  }
});

module.exports = router;
