import React, { Component } from 'react';

import ScheduleCalendars from "./ScheduleCalendar";

import Cookies from 'universal-cookie';
const cookies = new Cookies();


class MasterCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "x-api-key": cookies.get("x-api-key"),
            "x-id-key": cookies.get("x-id-key"),
            "school": cookies.get("school"),
        }
        this.updateSchool = this.updateSchool.bind(this);
        this.calendar = React.createRef();
    }
    updateSchool(body) {
        fetch(`/api/v1/schools/${this.state.school}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": this.state["x-api-key"],
                "x-id-key": this.state["x-id-key"],
            },
            body: JSON.stringify(body),
        })
            .then(json => json.json())
            .then(data => {
                if (data.status == "ok") {

                } else {
                    console.log(data.body);
                }
            })
            .catch(e => {
                console.log(e);
            })
    }
    componentDidMount() {
        fetch(`/api/v1/schools/${this.state.school}`, {
            method: "get",
            headers: {
                "x-api-key": this.state["x-api-key"],
                "x-id-key": this.state["x-id-key"],
            },
        })
            .then(json => json.json())
            .then(data => {
                if (data.status == "ok") {
                    data.body.start_date = new Date(data.body.start_date);
                    data.body.end_date = new Date(data.body.end_date);
                    // console.log(data.body);
                    this.calendar.current.updateSchool(data.body);
                } else {

                }
            })
            .catch(e => {
                console.log(e);
            })
    }
    render() {
        return (
            <div>
                <ScheduleCalendars updateModal={this.props.updateModal} ref={this.calendar} updateSchool={this.updateSchool} headers={this.state}></ScheduleCalendars>
            </div>
        )
    }
}
export default MasterCalendar;