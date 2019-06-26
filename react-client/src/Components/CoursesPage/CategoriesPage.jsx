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
        this.dataFunctions = {
            "Category": {
                "display": category => {
                    return category.category;
                },
                "input": {
                    "value": category => {
                        return category.category;
                    },
                    "type": "text",
                    "label": "Category",
                    "name": "category",
                }
            }
        }
        this.dataTable = React.createRef();
    }
    componentDidMount() {
        fetch("/api/v1/categories", {
            method: "get",
            headers: {
                "x-api-key": this.state["x-api-key"],
                "x-id-key": this.state["x-id-key"],
            }
        })
        .then(json => json.json())
        .then(data => {
            if (data.status === "ok") {
                this.dataTable.current.setState({data: data.body});
            } else {
                this.dataTable.setState({data: []});
            }
        })
        .catch(e => {
            console.log(e);
        });
    }
    render() {
        return (
            <div>
                <DataTable ref={this.dataTable} collectionPlural={"Categories"} formattingFunctions={this.dataFunctions} />
            </div>
        )
    }
}

export default TeachersPage;