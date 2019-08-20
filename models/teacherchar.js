const mongoose = require ('mongoose');

function makeid (length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt (
      Math.floor (Math.random () * charactersLength)
    );
  }
  return result;
}

const TeacherSchema = mongoose.Schema ({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    default: 'Mr.',
  },
  teacher_code: {
    type: String,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
    required: true,
  },
});

TeacherSchema.pre ('save', function (next) {
  let teacher = this;
  global.models['teacher-account']
    .create ({
      teacher: teacher._id,
      code: makeid (5),
    })
    .then (teacher => {
      global.models['account'].create ({
        account_type: 'teacher',
        date_created: new Date (),
        reference_id: teacher._id,
      });
    });

  next ();
});

const Teacher = mongoose.model ('teacher', TeacherSchema);
module.exports = Teacher;
