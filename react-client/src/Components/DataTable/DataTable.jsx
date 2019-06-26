import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faLongArrowAltDown, faLongArrowAltUp, faSearch } from '@fortawesome/free-solid-svg-icons';
// import Select from 'react-select'
// import "@material/textfield/mdc-text-field.css";
// import { makeStyles } from '@material-ui/core/styles';
// import Button from "@material-ui/core/Button";


import "./datatable.css";
import "./material.css";
// import { runInThisContext } from 'vm';

class TextInput extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="group-holder">
                <div className="group">
                    <input type="text" required onChange={this.props.onChange} />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label>{this.props.placeholder}</label>
                </div>
            </div>
        )
    }  
}

class DataTableEditBar extends Component {
    constructor(props) {
        super(props);
        //types: text, popup-textarea, dropdown, date, time, checkbox
        //inputs: [{type: "text", name: "category", label: "Category"}, {type: "text", name: "code", label: "code"}]
        this.state = {
            values: this.props.inputs["input"].reduce((accumulator, current) => {
                accumulator[current.name] = "";
                return accumulator;
            }, {})
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange(event, name) {
        let values = {...this.state.values};
        values[name] = event.target.value;
        this.setState({values});
    }
    render() {
        return (
            <div className="edit-bar">
                <div className="edit-bar-inputs">
                    {
                        this.props.formattingFunctions.map(input => {
                            switch(input["input"].type) {
                                case "text":
                                    return <TextInput value={this.state.values[input.name]} placeholder={input.label} onChange={(event) => this.handleInputChange(event, input.name)}></TextInput>
                                case "popup-textarea":
                                    return <TextInput></TextInput>
                                case "dropdown":
                                    return <TextInput></TextInput>
                                case "date":
                                    return <TextInput></TextInput>
                                case "time":
                                    return <TextInput></TextInput>
                                case "checkbox":
                                    return <TextInput></TextInput>
                            }
                        })
                    }
                    {/* <Select options={this.selectOptions}></Select> */}
                </div>
                <div className="edit-bar-buttons">
                    <div className="control-buttons">
                        <div className="edit-bar-button edit-bar-cancel" onClick={this.props.cancelFunc}>
                            CANCEL
                        </div>
                        <div className={"edit-bar-button edit-bar-save " + (Object.keys(this.state.values).reduce(((acc, val) => this.state.values[val] && acc), true) ? "edit-bar-save-active" : "")} onClick={this.props.saveFunc}>
                            SAVE
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sort_key: Object.keys(this.props.formattingFunctions)[0],
            //-1: a-z, 1: z-a
            sort_direction: -1,
            data: [],
        }
        this.searchBar = React.createRef();
        this.tableBody = React.createRef();
        this.handleClick = this.handleClick.bind(this);
        
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleDotsClick = this.handleDotsClick.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);

        this.selectOptions = [
            {
                value: "1",
                label: "label-1",
            },
            {
                value: "2",
                label: "label-2",
            },
            {
                value: "2",
                label: "label-3",
            }
        ]
    }
    handleClick(key) {
        let newSortDirection = this.state.sort_key == key ? this.state.sort_direction*-1 : -1;
        this.state.data.sort((a, b) => {
            return (this.props.formattingFunctions[key]["display"](a).localeCompare(this.props.formattingFunctions[key]["display"](b))) * (this.state.sort_direction);
        });
        this.setState({sort_key: key, sort_direction: newSortDirection, data: this.state.data});
    }
    handleFocus() {
        this.searchBar.current.className = "search-bar search-bar-selected";
    }
    handleBlur() {
        this.searchBar.current.className = "search-bar";
    }
    handleInput(event) {
        for (var i = 0; i < this.state.data.length; i++) {
            this.state.data[i].displayed = this.props.formattingFunctions[this.state.sort_key]["display"](this.state.data[i]).toLowerCase().indexOf(event.target.value.toLowerCase()) >= 0;
        }
        this.setState(state => ({
            data: this.state.data,
        }));
    }
    handleDotsClick(event) {
        let node = event.target;
        while (node.nodeName.toLowerCase() != "div") {
            node = node.parentNode;
        }
        node.classList.toggle("open-icon-active");
    }
    handleEdit(item) {
        console.log("tits");
        console.log(item);
        console.log(this);
        this.tableBody.current.classList.add("data-table-open");
    }
    handleCancel() {
        this.tableBody.current.classList.remove("data-table-open");
    }
    handleSave() {

    }
    render() {
        return (
            <div className="data-table" ref={this.tableBody}>
                <div className="search-bar" ref={this.searchBar}>
                    <div className="search-bar-icon">
                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                    </div>
                    <input className="search-bar-input" placeholder={`Search for ${this.props.collectionPlural}`} onFocus={this.handleFocus} onBlur={this.handleBlur} onInput={this.handleInput}>

                    </input>
                </div>
                <table className="keys-bar">
                    {
                        <tr>
                            {
                                Object.keys(this.props.formattingFunctions).map(key => {
                                    return (
                                        <td onClick={() => this.handleClick(key)}>
                                            {key}
                                            <FontAwesomeIcon icon={faLongArrowAltUp} className={(this.state.sort_key === key && this.state.sort_direction === 1 ? " selected-arrow" : "unselected-arrow")}></FontAwesomeIcon>
                                            <FontAwesomeIcon icon={faLongArrowAltDown} className={(this.state.sort_key === key && this.state.sort_direction === -1 ? " selected-arrow" : "unselected-arrow")}></FontAwesomeIcon>
                                        </td>
                                    )
                                })
                            }
                        </tr> 
                    }
                </table>
                <DataTableEditBar cancelFunc={this.handleCancel} saveFunc={this.handleSave} inputs={this.props.formattingFunctions}></DataTableEditBar>
                <table className="data-body">
                    {
                        this.state.data.map((course, index) => {
                            return course.displayed !== false ? (
                                <tr data-id={index} key={course._id}>
                                    {  
                                        Object.keys(this.props.formattingFunctions).map((key, index, array) => {
                                            if (index == array.length-1) {
                                                return (
                                                    <td>
                                                        {this.props.formattingFunctions[key]["display"](course)}
                                                        <div className="open-icon" onClick={this.handleDotsClick}>
                                                            <FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon>
                                                            <div className="edit-delete-box">
                                                                <div className="edit-box" onClick={() => this.handleEdit(course)}>
                                                                    Edit
                                                                </div>
                                                                <div className="delete-box">
                                                                    Delete                                                                    
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                )
                                            } else {
                                                return (
                                                    <td>
                                                        {this.props.formattingFunctions[key]["display"](course)}
                                                    </td>
                                                )    
                                            }
                                            
                                        })
                                    }
                                </tr>
                            ) : "";
                        })
                    }
                    {
                        this.state.data.length == 0 ? 
                        <tr>
                            <td>Loading Data...</td>
                        </tr>
                        :
                        ""
                    }
                </table>
            </div>
        )
    }
}

export default DataTable;