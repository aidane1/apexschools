const express = require("express");
const Cryptr = require('cryptr');
const cryptr = new Cryptr(server_info.keys.encryption_key);

const router = express.Router();

router.get("/", async (req, res) => {
    res.status(404).send({error: "not allowed"});
});

function formatSchedule(schedule) {
    let dayTitles = [{day_1: "Monday", day_2: "Tuesday", day_3: "Wednesday", day_4: "Thursday", day_5: "Friday"}];
    let schedules = [

    ]
    schedule.day_blocks.map((week, index) => {
        schedules.push([
            [{type: "filler"}],
        ]);
        for (var key in week) {
            schedules[index][0].push({title: dayTitles[index][key], type: "title"});
        }
    });
    schedule.block_times.map((time, index_1) => {
        schedule.day_blocks.map((week, index) => {
            schedules[index].push([{time: time, position: index_1, type: "time"}]);
        });
        schedule.day_blocks.map((week, index_2) => {
            for (var key in week) {
                let blockCount = 0;
                let index_3 = 0;
                let first = false;
                let last = false;
                while (true) {
                    blockCount += week[key][index_3].block_span;
                    if (blockCount > index_1 || index_3 >= week[key].length) {
                        if (blockCount - week[key][index_3].block_span === index_1) {
                            first = true;
                        }
                        if (blockCount == index_1+1) {
                            last = true;
                        }
                        break;
                    }
                    index_3++;
                }
                schedules[index_2][index_1+1].push({
                    type: "block",
                    block_span: week[key][index_3].block_span,
                    block: week[key][index_3].block,
                    first,
                    last,
                    week: index_2,
                    day: key,
                    blockNum: index_3,
                });
            }
        });
    });
    return schedules;
}


router.post("/", async (req, res) => {
    try {
        let response = await models.account.authenticate(req.body.username, req.body.password, req.body.school);
        let apikey = await models.apikey.findOne({reference_account: response._id});
        response.api_key = apikey.key;
        let encrypted_id = cryptr.encrypt(response._id.toString());
        response._id = encrypted_id;
        let oldCourses = await models.course.find({school: response.school}).populate("teacher").populate("category").populate("course");
        let courses = oldCourses.map(course => {
            return {
                _id: course._id,
                block: course.block,
                teacher: `${course.teacher.prefix}${course.teacher.last_name}`,
                category: course.category.category,
                semester: course.semester,
                course: course.course.course,
                school: course.school,
            }
        });
        // console.log(courses);
        let events = [];
        let school = await models.school.findOne({_id : response.school}).populate("blocks");
        school = JSON.parse(JSON.stringify(school));
        let schedule = formatSchedule(school.schedule)
        school.schedule = schedule;
        let oldSemesters = await models.semester.find({school: response.school});
        let semesters = oldSemesters.map(semester => {
            return {
                _id: semester._id,
                name: semester.name,
                startDate: semester.start_date,
                endDate: semester.end_date,
            }
        })
        res.send({
            status: "ok",
            body: {
                _id: encrypted_id,
                api_key: apikey.key,
                username: response.username,
                school,
                semesters,
                courses,
                events,
            }
        });
    } catch(e) {
        console.log(e);
        res.error(e);
    }
}); 

router.put("/", async (req, res) => {

});

router.delete("/", async (req, res) => {

});

module.exports = router;