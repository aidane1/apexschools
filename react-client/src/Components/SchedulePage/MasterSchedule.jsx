import React, { Component } from 'react';


import ScheduleTables from "./ScheduleTable";

import Cookies from 'universal-cookie';
const cookies = new Cookies();


// let baseSchedule = {
//     block_times: [{start_hour: 9, start_minute: 10, end_hour: 10, end_minute: 12}, {start_hour: 10, start_minute: 15, end_hour: 11, end_minute: 17}],
//     day_blocks: [
//         {
//             day_1: [{block: "5d13adefa7380248baa527f8", block_span: 1}, {block: "5d13adefa7380248baa527f8", block_span: 1}],
//             day_2: [{block: "5d13adefa7380248baa527f8", block_span: 2}],
//             day_3: [{block: "5d13adefa7380248baa527f8", block_span: 1}, {block: "5d13adefa7380248baa527f8", block_span: 1}],
//             day_4: [{block: "5d13adefa7380248baa527f8", block_span: 2}],
//             day_5: [{block: "5d13adefa7380248baa527f8", block_span: 2}],
//         }
//     ]
// }



//schedule format: {block_times: [{...}], day_blocks: {day_1: [{...}]}}
class MasterSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "x-api-key": cookies.get("x-api-key"),
            "x-id-key": cookies.get("x-id-key"),
            "school": cookies.get("school"),
            schedule: {
                block_times:[],
                day_blocks:[],
            }
        }
        this.schedule = React.createRef();
        this.sendScheduleToServer = this.sendScheduleToServer.bind(this);
    }
    componentDidMount() {
        fetch(`/api/v1/schools/${this.state.school}?populate=blocks`, {
            method: "get",
            headers: {
                "x-api-key": this.state["x-api-key"],
                "x-id-key": this.state["x-id-key"],
            },
        })
            .then(json => json.json())
            .then(data => {
                if (data.status == "ok") {
                    this.schedule.current.updateSchedule(data.body.schedule, data.body.blocks);
                }
            })
            .catch(e => {
                console.log(e);
            });
    }
    sendScheduleToServer(schedule) {
        fetch(`/api/v1/schools/${this.state.school}`, {
            method: "put",
            headers: {
                "x-api-key": this.state["x-api-key"],
                "x-id-key": this.state["x-id-key"],
                "Content-Type": "application/json",
            },
            body: JSON.stringify({schedule}),
        })
            .then(json => json.json())
            .then(data => {
                console.log(data);
            })
            .catch(e => {
                console.log(e);
            })
    }
    render() {
        return (
            <div>
                <ScheduleTables sendScheduleToServer={this.sendScheduleToServer} ref={this.schedule} schedule={this.state.schedule} headers={this.state}></ScheduleTables>
            </div>
        )
    }
}
export default MasterSchedule;