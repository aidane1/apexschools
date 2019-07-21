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
    schedule.day_blocks.map((week, index_1) => {
        let newWeek = [];
        let times = [];
        times.push({type: "filler"});
        schedule.block_times.map((time, index_2) => {
            times.push({time: time, type: "time"});
        });
        newWeek.push(times);
        for (var key in week) {
            let day = [];
            day.push({type: "title", title: dayTitles[index_1][key]});
            week[key].map((block, index_2) => {
                day.push({block, type: "block"});
            });
            newWeek.push(day);
        }
        schedules.push(newWeek);
    });
    return schedules;
}


router.post("/", async (req, res) => {
    try {
        let response = await models.account.authenticate(req.body.username, req.body.password, req.body.school);
        let apikey = await models.apikey.findOne({reference_account: response._id});
        let user = await models.user.findOne({_id : response.reference_id}).populate("schedule_images");
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
        school.day_titles = [{day_1: "Monday", day_2: "Tuesday", day_3: "Wednesday", day_4: "Thursday", day_5: "Friday"}];
        let rawSchedule = school.schedule;
        let schedule = formatSchedule({...school.schedule})        
        school.schedule = schedule;
        school.rawSchedule = rawSchedule;
        let oldSemesters = await models.semester.find({school: response.school});
        let semesters = oldSemesters.map(semester => {
            return {
                _id: semester._id,
                name: semester.name,
                startDate: semester.start_date,
                endDate: semester.end_date,
            }
        })
        let topics = await models.topic.find({school: response.school});
        let blocks = await models.block.find({school: response.school});
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
                topics,
                user,
                blocks,
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