import React, { Component } from 'react';


import "./ScheduleCalendar.css";
class CalendarTitle extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="schedule-month-header">  
                {this.props.month}
            </div>
        )
    }
}


function makeMonthRows(month) {
    let firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    let rows = [[]];
    let empties = Array.apply(null, {length: firstDay.getDay()%7});
    rows[0] = empties.map((x, index) => {
        return {isLast: false, date: new Date(month.getFullYear(), month.getMonth(), 1-firstDay.getDay()+index), isInMonth: false};
    })
    let currentDay = new Date(month.getFullYear(), month.getMonth(), 1);
    while ((currentDay.getDate() == 1 && currentDay.getMonth() == month.getMonth()) || currentDay.getDate() > new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate()-1).getDate()) {
        if (rows[rows.length-1].length < 7) {
            rows[rows.length-1].push({isLast: false, date: currentDay, isInMonth: true});
        } else {
            rows.push([{isLast: false, date: currentDay, isInMonth: true}]);
        }
        currentDay = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate()+1);
    }
    if (rows[rows.length-1].length != 7) {
        let diff = 7-rows[rows.length-1].length;
        for (var i = 0; i < diff; i++) {
            rows[rows.length-1].push({date: new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate()+i), isInMonth: false});
        }
    }
    for (var i = 0; i < rows[rows.length-1].length; i++) {
        rows[rows.length-1][i].isLast = true;
    }
    return rows;
}

class CalendarCell extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.day) {
            return (
                <td onClick={(event) => this.props.handleClick(event, this.props.day, this.props.cell)} className={"cell " + (this.props.cell.isInMonth ? "cell-active " : "cell-passive ") + (this.props.cell.isLast ? "cell-last" : "")}>
                    <div className="cell-holder">
                        <div className="cell-day-title">
                            {this.props.day.is_displayed ? this.props.day.day : ""}
                        </div>
                        <div className="cell-date-num">
                            {this.props.cell.date.getDate()}
                        </div>
                    </div>
                </td>
            )
        } else {
            return (
                <td className={"cell " + (this.props.cell.isInMonth ? "cell-active " : "cell-passive ") + (this.props.cell.isLast ? "cell-last" : "")}>
                    <div className="cell-holder">
                        <div className="cell-day-title">

                        </div>
                        <div className="cell-date-num">
                            {this.props.cell.date.getDate()}
                        </div>
                    </div>                
                </td>
            )
        }
    }
}

class HourMarker extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="hour-marker">
                <div className="line">
                    <div>
                        {this.props.hour}
                    </div>
                    <div>

                    </div>
                </div>
            </div>
        )
    }
}

class CalendarBody extends Component {
    constructor(props) {
        super(props);
        
        //sat = day 6
        // june = month 5
        this.rows = makeMonthRows(this.props.month);
        this.state = {
            dashboardVisible: false,
            dashboardDay: false,
            dashboardCell: false,
        }
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(event, day, cell) {
        this.setState({dashboardVisible: true, dashboardDay: day, dashboardCell: cell});
    }
    render() {
        return (
            <div className="schedule-month-body">
                <table className="schedule-month-table">
                    {
                        this.rows.map((row, index_1) => {
                            return (
                                <tr>
                                    {
                                        row.map((cell, index_2) => {
                                            return (
                                                <CalendarCell handleClick={this.handleClick} cell={cell} day={this.props.object[`${cell.date.getFullYear()}_${cell.date.getMonth()}_${cell.date.getDate()}`]}></CalendarCell>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </table>
                <div className={this.state.dashboardVisible ? "schedule-day-dashboard schedule-day-dashboard-visible" : "schedule-day-dashboard"}>
                    <div className="day-dashboard-day">
                        <div className="day-dashboard-day-header">
                            {
                                this.state.dashboardCell ? 
                                <div className="day-dashboard-day-num">
                                    <div className="day-dashboard-month">
                                        {this.months[this.state.dashboardCell.date.getMonth()]} {this.state.dashboardCell.date.getDate()}, 
                                    </div> 
                                    <div className="day-dashboard-year">
                                        {this.state.dashboardCell.date.getFullYear()}
                                    </div>
                                </div>
                                :
                                <div></div>
                            }
                            <div className="day-dashboard-day-title">{this.state.dashboardDay.day || ""}</div>
                        </div>
                        <div className="day-dashboard-events">
                            <div className="day-dashboard-events-holder">
                                <div className="hour-markers">
                                    <HourMarker hour="12:00 AM"></HourMarker>
                                    <HourMarker hour="1:00 AM"></HourMarker>
                                    <HourMarker hour="2:00 AM"></HourMarker>
                                    <HourMarker hour="3:00 AM"></HourMarker>
                                    <HourMarker hour="4:00 AM"></HourMarker>
                                    <HourMarker hour="5:00 AM"></HourMarker>
                                    <HourMarker hour="6:00 AM"></HourMarker>
                                    <HourMarker hour="7:00 AM"></HourMarker>
                                    <HourMarker hour="8:00 AM"></HourMarker>
                                    <HourMarker hour="9:00 AM"></HourMarker>
                                    <HourMarker hour="10:00 AM"></HourMarker>
                                    <HourMarker hour="11:00 AM"></HourMarker>
                                    <HourMarker hour="12:00 PM"></HourMarker>
                                    <HourMarker hour="1:00 PM"></HourMarker>
                                    <HourMarker hour="2:00 PM"></HourMarker>
                                    <HourMarker hour="3:00 PM"></HourMarker>
                                    <HourMarker hour="4:00 PM"></HourMarker>
                                    <HourMarker hour="5:00 PM"></HourMarker>
                                    <HourMarker hour="6:00 PM"></HourMarker>
                                    <HourMarker hour="7:00 PM"></HourMarker>
                                    <HourMarker hour="8:00 PM"></HourMarker>
                                    <HourMarker hour="9:00 PM"></HourMarker>
                                    <HourMarker hour="10:00 PM"></HourMarker>
                                    <HourMarker hour="11:00 PM"></HourMarker>
                                </div>
                                <div className="events-holder">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class ScheduleCalendars extends Component {
    constructor(props) {
        super(props);
        this.state = {
            school: {},
        }
        this.updateSchool = this.updateSchool.bind(this);
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // console.log("update 1");
        this.props.updateSchool({
            "schedule": {"day_blocks": [], "block_times": [{day_1: [], day_2: [], day_3: [], day_4: [], day_5: []}]},
            "year_day_object" : { "2019_8_1" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_8_2" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_3" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_4" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_5" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_6" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_7" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_8_8" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_8_9" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_10" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_11" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_12" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_13" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_14" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_8_15" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_8_16" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_17" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_18" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_19" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_20" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_21" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_8_22" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_8_23" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_24" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_25" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_26" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_27" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_8_28" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_8_29" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_8_30" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_1" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_2" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_3" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_4" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_5" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_9_6" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_9_7" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_8" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_9" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_10" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_11" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_12" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_9_13" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_9_14" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_15" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_16" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_17" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_18" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_19" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_9_20" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_9_21" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_22" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_23" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_24" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_25" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_26" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_9_27" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_9_28" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_29" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_30" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_9_31" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_1" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_2" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_10_3" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_10_4" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_5" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_6" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_7" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_8" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_9" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_10_10" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_10_11" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_12" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_13" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_14" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_15" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_16" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_10_17" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_10_18" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_19" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_20" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_21" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_22" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_23" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_10_24" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_10_25" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_26" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_27" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_28" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_29" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_10_30" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_11_1" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_11_2" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_3" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_4" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_5" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_6" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_7" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_11_8" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_11_9" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_10" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_11" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_12" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_13" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_14" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_11_15" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_11_16" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_17" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_18" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_19" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_20" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_21" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_11_22" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_11_23" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_24" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_25" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_26" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_27" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_28" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_11_29" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2019_11_30" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2019_11_31" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_1" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_2" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_3" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_4" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_0_5" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_0_6" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_7" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_8" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_9" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_10" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_11" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_0_12" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_0_13" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_14" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_15" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_16" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_17" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_18" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_0_19" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_0_20" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_21" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_22" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_23" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_24" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_25" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_0_26" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_0_27" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_28" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_29" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_30" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_0_31" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_1" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_1_2" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_1_3" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_4" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_5" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_6" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_7" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_8" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_1_9" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_1_10" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_11" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_12" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_13" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_14" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_15" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_1_16" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_1_17" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_18" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_19" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_20" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_21" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_22" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_1_23" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_1_24" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_25" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_26" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_27" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_28" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_1_29" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_2_1" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_2_2" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_3" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_4" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_5" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_6" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_7" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_2_8" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_2_9" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_10" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_11" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_12" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_13" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_14" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_2_15" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_2_16" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_17" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_18" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_19" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_20" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_21" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_2_22" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_2_23" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_24" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_25" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_26" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_27" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_28" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_2_29" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_2_30" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_2_31" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_1" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_2" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_3" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_4" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_3_5" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_3_6" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_7" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_8" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_9" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_10" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_11" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_3_12" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_3_13" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_14" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_15" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_16" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_17" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_18" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_3_19" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_3_20" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_21" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_22" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_23" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_24" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_25" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_3_26" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_3_27" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_28" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_29" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_3_30" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_1" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_2" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_4_3" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_4_4" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_5" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_6" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_7" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_8" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_9" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_4_10" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_4_11" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_12" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_13" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_14" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_15" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_16" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_4_17" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_4_18" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_19" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_20" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_21" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_22" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_23" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_4_24" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_4_25" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_26" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_27" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_28" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_29" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_4_30" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_4_31" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_5_1" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_2" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_3" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_4" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_5" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_6" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_5_7" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_5_8" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_9" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_10" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_11" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_12" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_13" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_5_14" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_5_15" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_16" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_17" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_18" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_19" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_20" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_5_21" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_5_22" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_23" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_24" : { "day" : "day_3", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_25" : { "day" : "day_4", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_26" : { "day" : "day_5", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_27" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_5_28" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 1, "is_displayed" : false, "school_in" : false }, "2020_5_29" : { "day" : "day_1", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true }, "2020_5_30" : { "day" : "day_2", "week" : 0, "events" : [ ], "roll_count" : 0, "is_displayed" : true, "school_in" : true } }
        })
    }
    updateSchool(school) {
        this.setState({ school });
    }
    render() {
        if (this.state.school.start_date) {
            let monthsCovered = [];
            for (var i = 0; i < this.state.school.end_date.getFullYear()*12+this.state.school.end_date.getMonth()-this.state.school.start_date.getFullYear()*12-this.state.school.start_date.getMonth()+1; i++) {
                monthsCovered.push(new Date(this.state.school.start_date.getFullYear(), this.state.school.start_date.getMonth()+i, 1));
            }
            return (
                <div>
                    {
                        monthsCovered.map((month, index) => {
                            return (
                                <div>
                                    <CalendarTitle month={this.months[month.getMonth()]}></CalendarTitle>
                                    <CalendarBody object={this.state.school.year_day_object} month={month}></CalendarBody>
                                </div>
                            )
                        })
                    }
                </div>
            )
        } else {
            return (
                <div>

                </div>
            )
        }
        
    }
}

export default ScheduleCalendars;