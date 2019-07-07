const fs = require("fs");
const csv = require("csv-parser");
const {convertCourseCode, convertBlock} = require(__dirname + "/../data_conversion/pvss");



async function formatData(data) {
    let schools = {};
    data = data.map(row => {
        return normalize(row);
    });

    // console.log(data);
    for (var i = 0; i < data.length; i++) {
        if (!schools[data[i].schoolcode]) {
            let school = await models.school.findOne({school_code: data[i].schoolcode});
            if (school && school != null) {
                schools[data[i].schoolcode] = school._id;
            } else {
                let newSchool = await models.school.create({ name: data[i].schoolcode, school_code: data[i].schoolcode});
                schools[data[i].schoolcode] = newSchool._id;
            }
        }
    }

    //start of teacher parsing
    let teacherObjects = getTeachers(data, schools);


    for (var i = 0; i < teacherObjects.length; i++) {
        teacherObjects[i].first_name = teacherObjects[i].first_name || "Unknown";
        let teacher = await models.teacher.findOne(teacherObjects[i]);
        if (teacher && teacher != null) {

        } else {
            let newTeacher = await models.teacher.create(teacherObjects[i]);
        }
    }
    let teachers = await models.teacher.find();
    //end of teacher parsing

    //start of block parsing
    let blockObjects = getBlocks(data, schools);

    for (var i = 0; i < blockObjects.length; i++) {
        let block = await models.block.findOne(blockObjects[i]);
        if (block && block != null) {

        } else {
            let newBlock = await models.block.create(blockObjects[i]);
            await models.school.findOneAndUpdate({_id : newBlock.school}, {$push: {blocks: newBlock._id}});
        }
    }
    //end of block parsing

    //start of category parsing
    let categoryObjects = getCategories(data, schools);
    for (var i = 0; i < categoryObjects.length; i++) {
        let category = await models.category.findOne({school: categoryObjects[i].school, short_code: categoryObjects[i].short_code});
        if (category && category != null) {

        } else {
            let newCategory = await models.category.create(categoryObjects[i]);
        }
    }
    //end of category parsing

    //start of semester parsing
    let semesterObjects = getSemesters(data, schools);
    for (var i = 0; i < semesterObjects.length; i++) {
        let semester = await models.semester.findOne({school: semesterObjects[i].school, name: semesterObjects[i].name});
        if (semester && semester != null) {

        } else {
            let newSemester = await models.semester.create(semesterObjects[i]);
        }
    }
    //end of semester parsing

    //start of code parsing
    let codeObjects = getCodes(data, schools);
    for (var i = 0; i < codeObjects.length; i++) {
        let code = await models.code.findOne({code: codeObjects[i].code, school: codeObjects[i].school});
        if (code && code != null) {

        } else {
            let newCode = await models.code.create(codeObjects[i]);
        }
    }
    //end of code parsing



    //start of course parsing
    let courseObjects = await getCourses(data, schools);
    for (var i = 0; i < courseObjects.length; i++) {
        let course = await models.course.findOne(courseObjects[i]);
        if (course && course != null) {
            
        } else {
            let newCourse = await models.course.create(courseObjects[i]);
        }
    }
    //end of course parsing


    // console.log(data);
    // console.log(teachers);
    // console.log(teacherObjects);
    // let courseObjects = getCourses(data);
}

function normalize(row) {
    let newRow = {};
    for (var key in row) {
        let data = row[key].trim();
        if (key == "first" || key == "last") {
            data = capitalize(data);
        }
        newRow[key] = data;
    }
    return newRow;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function getTeachers(data, schools) {
    return data.map(row => {
        return schools[row] ? {} : {
            first_name: row.first,
            last_name: row.last,
            teacher_code: row.tchid,
            school: schools[row.schoolcode],
        }
    }).filter(teacher => teacher.school);
}
async function getCourses(data, schools) {
    let newData = data.map(async row => {
        let school = schools[row.schoolcode];
        let block = await models.block.findOne({school: school._id, block: row.block});
        let category = await models.category.findOne({school: school._id, category: row.dtype});
        if (category == null || !category) {
            category = await models.category.findOne({school: school._id, short_code: row.dtype});
        }
        let courseCode = await models.code.findOne({school: school._id, code: row.course});
        let startDate = row.startdate.match(/.{1,2}/g).map(x => parseInt(x));

        let endDate = row.enddate.match(/.{1,2}/g).map(x => parseInt(x));

        if (startDate.length == 3 && endDate.length == 3) {
            startDate = new Date(2000 + startDate[0], startDate[1]-1, startDate[2]);
            endDate = new Date(2000 + endDate[0], endDate[1]-1, endDate[2]);
            let semester = await models.semester.findOne({school: school._id, start_date: startDate, end_date: endDate});
            let teacher = await models.teacher.findOne({school: school._id, teacher_code: row.tchid});
            return {
                course: courseCode,
                block: block._id,
                category: category._id,
                semester: semester._id,
                teacher: teacher._id,
                school: school._id,
            }
        } else {
            return {};
        }
    });
    newData = await Promise.all(newData);
    return newData.filter(course => course.school && course.course && course.teacher && course.semester && course.block && course.category);
}

function getBlocks(data, schools) {
    let blocks = [];
    for (var i = 0; i < data.length; i++) {
        blocks.push({block: data[i].block, is_constant: false, school: schools[data[i].schoolcode]});
    }
    return blocks.filter(block => block.school && block.block);
}   

function getCategories(data, schools) {
    return data.map(row => {
        return {
            category: row.dtype,
            short_code: row.dtype,
            school: schools[row.schoolcode],
        }
    }).filter(category => category.school && category.category);
}
function getCodes(data, schools) {
    return data.map(row => {
        return {
            course: row.course,
            code: row.course,
            school: schools[row.schoolcode],
        }
    }).filter(code => code.code && code.school);
}
function getSemesters(data, schools) {
    return data.map(row => {
        let startDate = row.startdate.match(/.{1,2}/g).map(x => parseInt(x));
        startDate = new Date(2000 + startDate[0], startDate[1]-1, startDate[2]);
        let endDate = row.enddate.match(/.{1,2}/g).map(x => parseInt(x));
        endDate = new Date(2000 + endDate[0], endDate[1]-1, endDate[2]);
        return {
            start_date: startDate,
            end_date: endDate,
            name: row.term,
            school: schools[row.schoolcode],
        }
    }).filter(semester => semester.name && semester.school && semester.start_date && semester.end_date);
}

module.exports = async function() {
    let result = [];
    fs.createReadStream(base_dir + "/file_parsing/master.csv")
        .pipe(csv())
        .on("data", data => result.push(data))
        .on("end", () => {
            formatData(result);
        })
}