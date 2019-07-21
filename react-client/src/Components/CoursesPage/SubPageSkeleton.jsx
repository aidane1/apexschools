import React, { Component } from 'react';

import DataTable from "../DataTable/DataTable";


import Cookies from 'universal-cookie';
const cookies = new Cookies();

class SubPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: cookies.get("username"),
            "x-api-key": cookies.get("x-api-key"),
            "x-id-key": cookies.get("x-id-key"),
            resources: [],
        }
        this.dataFunctions = this.props.dataFunctions;
        // console.log(this.dataFunctions);
        this.collectionSingular = this.props.collectionSingular;
        this.collectionPlural = this.props.collectionPlural;
        this.populateFields = this.props.populateFields;

        this.dataTable = React.createRef();
        this.updateItem = this.updateItem.bind(this);
        this.createItem = this.createItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }
    componentDidMount() {
        let findFields = "&find_fields=";
        let fieldVals = "";
        if (this.props.constants) {
            for (var key in this.props.constants) {
                findFields += `${key},`;
                fieldVals += `&${key}=${this.props.constants[key]}`
            }
        }
        fetch(`/api/v1/${this.collectionPlural.toLowerCase()}?${this.populateFields}${findFields}${fieldVals}`, {
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
    updateItem(data) {
        return fetch(`/api/v1/${this.collectionPlural.toLowerCase()}/${data._id}?${this.populateFields}`, {
            method: "put",
            headers: {
                "x-api-key": this.state["x-api-key"],
                "x-id-key": this.state["x-id-key"],
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data.values),
        })
        .then(json => json.json())
    }
    createItem(data) {
        let body = {...data.values};
        if (this.props.constants) {
            body = {...body, ...this.props.constants};
        }
        return fetch(`/api/v1/${this.collectionPlural.toLowerCase()}?${this.populateFields}`, {
            method: "post",
            headers: {
                "x-api-key": this.state["x-api-key"],
                "x-id-key": this.state["x-id-key"],
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        .then(json => json.json())
    }
    deleteItem(id) {
        return fetch(`/api/v1/${this.collectionPlural.toLowerCase()}/${id}?${this.populateFields}`, {
            method: "delete",
            headers: {
                "x-api-key": this.state["x-api-key"],
                "x-id-key": this.state["x-id-key"],
            }
        }).then(json => json.json());
    }

    render() {
        return (
            <div>
                <DataTable mini={this.props.mini || false} ref={this.dataTable} apiKeys={{"x-api-key": this.state["x-api-key"],"x-id-key": this.state["x-id-key"]}} delete={this.deleteItem} create={this.createItem} update={this.updateItem} collectionSingular={this.collectionSingular} collectionPlural={this.collectionPlural} formattingFunctions={this.dataFunctions} />
            </div>
        )
    }
}

export default SubPage;