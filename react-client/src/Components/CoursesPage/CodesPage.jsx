import React, { Component } from 'react';

import DataTable from "../DataTable/DataTable";


import Cookies from 'universal-cookie';
const cookies = new Cookies();

class TeachersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: cookies.get("username"),
            "x-api-key": cookies.get("x-api-key"),
            "x-id-key": cookies.get("x-id-key"),
            resources: [],
        }
        this.dataDisplayFunctions = {
            "Course": code => {
                return code.course;
            },
            "Code": code => {
                return code.code;
            }
        }
    }
    componentDidMount() {
        fetch("/api/v1/codes", {
            method: "get",
            headers: {
                "x-api-key": this.state["x-api-key"],
                "x-id-key": this.state["x-id-key"],
            }
        })
        .then(json => json.json())
        .then(data => {
            if (data.status === "ok") {
                this.setState({resources: data.body});
            } else {
                this.setState({resources: []});
            }
        })
        .catch(e => {
            console.log(e);
        });
    }
    render() {
        return (
            <div>
                <DataTable data={this.state.resources} collectionPlural={"Codes"} display={this.dataDisplayFunctions} />
            </div>
        )
    }
}

export default TeachersPage;