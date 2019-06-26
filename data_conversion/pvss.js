function convertCourseCode(courseCode) {
    let keys = {

    }
    return keys[courseCode] || courseCode;
}
function convertBlock(block) {
    let blocks = {

    }
    return blocks[block] || block;
}

module.exports = {
    convertCourseCode,
    convertBlock
};