import React, { Component } from 'react';

import SubPage from "./SubPageSkeleton";

class CodesPage extends Component {
    constructor(props) {
        super(props);
        this.dataFunctions  = {
            "Course": {
                "display": code => {
                    return code.course;
                },
                "input": {
                    "value": code => {
                        return code !== undefined ? code.course : "";
                    },
                    "type": "text",
                    "label": "Course",
                    "name": "course",
                }
            },
            "Code": {
                "display": code => {
                    return code.code;
                },
                "input": {
                    "value": code => {
                        return code !== undefined ? code.code : "";
                    },
                    "type": "text",
                    "label": "Code",
                    "name": "code",
                }
            }
        }
    }
    render() {
        return <SubPage dataFunctions={this.dataFunctions} populateFields="" collectionPlural={"codes"} collectionSingular={"code"}></SubPage>
    }
}
export default CodesPage;