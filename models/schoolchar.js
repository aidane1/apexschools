const mongoose = require("mongoose");
const fs = require("fs");
const mkdirp = require("mkdirp");

const SchoolSchema = mongoose.Schema({
    schedule: {
        type: Object,
        default: {},
    },
    blocks: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "block"}],
        default: []
    },
    name: {
        type: String,
        required: true,
    },
    semesters: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "Semester"}],
    },
    school_code: {
        type: String,
    },
    spare_name: {
        type: String,
        default: "Spare",
    },
    day_titles: {
        type: [{type: String}],
        default: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
    start_date: {
        type: Date,
        default: new Date(2018, 08, 1),
    },
    end_date: {
        type: Date,
        default: new Date(2019, 05, 30),
    },
    year_day_object: {
        type: Object,
    }
});

// year_day_object format: 
// {
//     "year_month_day": {
//         week: 0,
//         day: "day_1",
//         roll_count;
//         is_displayed: true,
//         school_in: true,
//         events: [...event1_id, ...event2_id],        
//     }
// }



SchoolSchema.pre("save", async (next) => {
    try {
        let school = this;
        let id = mongoose.Types.ObjectId();
        school._id = id;
        let blockLetters = [["A", "changing"], ["B", "changing"], ["TA", "constant"], ["C", "changing"], ["Lunch", "constant"], ["D", "changing"], ["E", "constant"]];
        let blocks = [];
        for (var i = 0; i < blockLetters.length; i++) {
            let block = await models.block.create({school: school._id, block: blockLetters[i][0], is_constant: blockLetters[i][1]==="constant"});
            blocks.push(block._id);
        }
        school.blocks = blocks;
        school.schedule = [
            {   
                block_times: [{start_hour: 9, start_minute: 10, end_hour: 10, end_minute: 12}],
                day_blocks: [
                    {
                        day_1: [{block: blocks[0], block_span: 1}],
                        day_2: [{block: blocks[0], block_span: 1}],
                        day_3: [{block: blocks[0], block_span: 1}],
                        day_4: [{block: blocks[0], block_span: 1}],
                        day_5: [{block: blocks[0], block_span: 1}],
                    }
                ]
            }
        ]
        mkdirp(abs_path("/public/" + school._id), (err) => {
            if (err) {
                console.log(err);
                next(err);
            } else {
                next();
            }
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
});

const School = mongoose.model("school", SchoolSchema);
module.exports = School;