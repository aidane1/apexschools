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