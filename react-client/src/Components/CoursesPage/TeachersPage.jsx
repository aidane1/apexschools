import React, { Component } from 'react';

import SubPage from "./SubPageSkeleton";

class TeachersPage extends Component {
    constructor(props) {
        super(props);
        this.dataFunctions = {
            "First Name": {
                "display": teacher => {
                    return teacher.first_name;
                },
                "input": {
                    "value": teacher => {
                        return teacher !== undefined ? teacher.first_name : "";
                    },
                    "type": "text",
                    "label": "First Name",
                    "name": "first_name",
                }
            },
            "Last Name": {
                "display": teacher => {
                    return teacher.last_name;
                },
                "input": {
                    "value": teacher => {
                        return teacher !== undefined ? teacher.last_name : "";
                    },
                    "type": "text",
                    "label": "Last Name",
                    "name": "last_name",
                }
            },
            "Teacher Code": {
                "display": teacher => {
                    return teacher.teacher_code;
                },
                "input": {
                    "value": teacher => {
                        return teacher !== undefined ? teacher.teacher_code : "";
                    },
                    "type": "text",
                    "label": "Teacher Code",
                    "name": "teacher_code",
                }
            },
            "Prefix": {
                "display": teacher => {
                    return teacher.prefix;
                },
                "input": {
                    "value": teacher => {
                        return teacher !== undefined ? teacher.prefix : "";
                    },
                    "type": "dropdown",
                    "options": [{name: "Mr. ", value: "Mr. "}, {name: "Ms. ", value: "Ms. "}, {name: "Mrs. ", value: "Mrs. "}, {name: "Mme. ", value: "Mme ."}],
                    "label": "Prefix",
                    "name": "prefix",
                }
            }
        }
    }
    render() {
        return <SubPage dataFunctions={this.dataFunctions} populateFields="" collectionPlural={"teachers"} collectionSingular={"teacher"}></SubPage>
    }
}

export default TeachersPage;