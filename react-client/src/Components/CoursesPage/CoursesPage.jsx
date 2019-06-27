
import React, { Component } from 'react';

import SubPage from "./SubPageSkeleton";

class CoursesPage extends Component {
    constructor(props) {
        super(props);
        this.dataFunctions = {
            "Course": {
                "display": course => {
                    return course.course.course;
                },
                "input": {
                    "value": course => {
                        return course !== undefined ? course.course._id : "";
                    },
                    "type": "dropdown-async",
                    "options-url": "/codes",
                    "format": code => {
                        return code.course;
                    },
                    "valueFunc": code => {
                        return code._id;
                    },
                    "label": "Course",
                    "name": "course",
                }
            },
            "Teacher": {
                "display": course => {
                    return course.teacher.prefix + " " + course.teacher.last_name;
                },
                "input": {
                    "value": course => {
                        return course !== undefined ? course.teacher._id : "";
                    },
                    "type": "dropdown-async",
                    "options-url": "/teachers",
                    "format": teacher => {
                        return `${teacher.prefix} ${teacher.last_name}`;
                    },
                    "valueFunc": teacher => {
                        return teacher._id;
                    },
                    "label": "Teacher",
                    "name": "teacher",
                }
            },
            "Block": {
                "display": course => {
                    return course.block.block;
                },
                "input": {
                    "value": course => {
                        return course !== undefined ? course.block._id : "";
                    },
                    "type": "dropdown-async",
                    "options-url": "/blocks",
                    "format": block => {
                        return block.block;
                    },
                    "valueFunc": block => {
                        return block._id;
                    },
                    "label": "Block",
                    "name": "block",
                }
            },
            "Semester": {
                "display": course => {
                    return course.semester.name;
                },
                "input": {
                    "value": course => {
                        return course !== undefined ? course.semester._id : "";
                    },
                    "type": "dropdown-async",
                    "options-url": "/semesters",
                    "format": semester => {
                        return semester.name;
                    },
                    "valueFunc": semester => {
                        return semester._id;
                    },
                    "label": "Semester",
                    "name": "semester",
                }
            },
            "Category": {
                "display": course => {
                    return course.category.category;
                },
                "input": {
                    "value": course => {
                        return course !== undefined ? course.category._id : "";
                    },
                    "type": "dropdown-async",
                    "options-url": "/categories",
                    "format": category => {
                        return category.category;
                    },
                    "valueFunc": category => {
                        return category._id;
                    },
                    "label": "Category",
                    "name": "category",
                }
            },
        }
    }
    render() {
        return <SubPage dataFunctions={this.dataFunctions} populateFields="populate=teacher,category,semester,block,course" collectionPlural={"courses"} collectionSingular={"course"}></SubPage>
    }
}

export default CoursesPage;