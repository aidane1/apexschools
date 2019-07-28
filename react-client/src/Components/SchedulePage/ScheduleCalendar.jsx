import React, {Component} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';

import './ScheduleCalendar.css';
class CalendarTitle extends Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <div className="schedule-month-header">
        {this.props.month}
      </div>
    );
  }
}

function makeMonthRows (month) {
  let firstDay = new Date (month.getFullYear (), month.getMonth (), 1);
  let rows = [[]];
  let empties = Array.apply (null, {length: firstDay.getDay () % 7});
  rows[0] = empties.map ((x, index) => {
    return {
      isLast: false,
      date: new Date (
        month.getFullYear (),
        month.getMonth (),
        1 - firstDay.getDay () + index
      ),
      isInMonth: false,
    };
  });
  let currentDay = new Date (month.getFullYear (), month.getMonth (), 1);
  while (
    (currentDay.getDate () == 1 &&
      currentDay.getMonth () == month.getMonth ()) ||
    currentDay.getDate () >
      new Date (
        currentDay.getFullYear (),
        currentDay.getMonth (),
        currentDay.getDate () - 1
      ).getDate ()
  ) {
    if (rows[rows.length - 1].length < 7) {
      rows[rows.length - 1].push ({
        isLast: false,
        date: currentDay,
        isInMonth: true,
      });
    } else {
      rows.push ([{isLast: false, date: currentDay, isInMonth: true}]);
    }
    currentDay = new Date (
      currentDay.getFullYear (),
      currentDay.getMonth (),
      currentDay.getDate () + 1
    );
  }
  if (rows[rows.length - 1].length != 7) {
    let diff = 7 - rows[rows.length - 1].length;
    for (var i = 0; i < diff; i++) {
      rows[rows.length - 1].push ({
        date: new Date (
          currentDay.getFullYear (),
          currentDay.getMonth (),
          currentDay.getDate () + i
        ),
        isInMonth: false,
      });
    }
  }
  for (var i = 0; i < rows[rows.length - 1].length; i++) {
    rows[rows.length - 1][i].isLast = true;
  }
  return rows;
}

class CheckBox extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      checked: true,
    };
    this.handleClick = this.handleClick.bind (this);
  }
  handleClick () {
    this.props.handleClick ('school_in', !this.state.checked);
    this.setState ({checked: !this.state.checked});
  }
  render () {
    return (
      <div
        style={{
          ...this.props.style,
          backgroundColor: '#eee',
          border: '1px solid #aaa',
          cursor: 'pointer',
        }}
        onClick={this.handleClick}
      >
        {this.state.checked
          ? <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgb(3,155,229)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesomeIcon
                icon={faCheck}
                style={{color: 'white', fontSize: '22px'}}
              />
            </div>
          : <div />}
      </div>
    );
  }
}

class CalendarCell extends Component {
  constructor (props) {
    super (props);
  }
  render () {
    
    if (this.props.day) {
      return (
        <td
          onClick={event =>
            this.props.handleClick (event, this.props.day, this.props.cell)}
          className={
            'cell ' +
              (this.props.cell.isInMonth ? 'cell-active ' : 'cell-passive ') +
              (this.props.cell.isLast ? 'cell-last' : '')
          }
        >
          <div className="cell-holder">
            <div className="cell-day-title">
              {this.props.day.is_displayed
                ? this.props.day_titles[this.props.day.week][this.props.day.day]
                : ''}
            </div>
            <div className="cell-date-num">
              {this.props.cell.date.getDate ()}
            </div>
          </div>
        </td>
      );
    } else {
      return (
        <td
          className={
            'cell ' +
              (this.props.cell.isInMonth ? 'cell-active ' : 'cell-passive ') +
              (this.props.cell.isLast ? 'cell-last' : '')
          }
        >
          <div className="cell-holder">
            <div className="cell-day-title" />
            <div className="cell-date-num">
              {this.props.cell.date.getDate ()}
            </div>
          </div>
        </td>
      );
    }
  }
}

class HourMarker extends Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <div className="hour-marker">
        <div className="line">
          <div>
            {this.props.hour}
          </div>
          <div />
        </div>
      </div>
    );
  }
}

class DayModal extends Component {
  constructor (props) {
    super (props);
    this.state = {
      dashboardDay: this.props.dashboardDay,
      day_titles: this.props.day_titles,
      date: this.props.date,
    };
    this.temp = {
      dashboardDay: this.props.dashboardDay,
    };
    this.updateDay = this.updateDay.bind (this);
    this.updateCellBlock = this.updateCellBlock.bind (this);
    this.weekChange = this.weekChange.bind (this);
    this.dayChange = this.dayChange.bind (this);
    this.months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  }
  updateDay (key, value) {
    let object = this.temp.dashboardDay;
    object[key] = value;
    this.temp.dashboardDay = object;
  }
  weekChange (event) {
    let object = this.temp.dashboardDay;
    object['week'] = event.target.value;
    this.temp.dashboardDay = object;
  }
  dayChange (event) {
    let object = this.state.dashboardDay;
    object['day'] = event.target.value;
    this.temp.dashboardDay = object;
  }
  updateCellBlock () {
      console.log(this.state);
    this.setState ({dashboardDay: this.temp.dashboardDay}, () => {
        this.props.updateCell(`${this.state.date.getFullYear()}_${this.state.date.getMonth()}_${this.state.date.getDate()}`, this.state.dashboardDay);
    });
  }
  componentWillReceiveProps (props) {
    this.setState (props);
  }
  render () {
    return (
      <div className={'schedule-day-dashboard'}>
        <div className="day-dashboard-side-bar">
          <div className="sidebar-child">
            <div className="day-dashboard-section">
              <div className="day-dashboard-section-title">
                Schedule Week:
              </div>
              <div className="day-dashboard-section-body">
                <select onChange={this.weekChange}>
                  {this.props.day_titles.map ((title, index) => {
                    return (
                      <option
                        key={'week_' + index}
                        value={index}
                        selected={index == this.state.dashboardDay.week}
                      >
                        {index}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="day-dashboard-section">
              <div className="day-dashboard-section-title">
                Schedule Day:
              </div>
              <div className="day-dashboard-section-body">
                <select onChange={this.dayChange}>
                  {[1, 2, 3, 4, 5].map ((day, index) => {
                    return (
                      <option
                        value={`day_${day}`}
                        selected={`day_${day}` == this.state.dashboardDay.day}
                      >
                        Day {day}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="day-dashboard-section">
              <div className="day-dashboard-section-title">
                School Attended:
              </div>
              <div className="day-dashboard-section-body">
                <CheckBox
                  style={{width: 40, height: 40}}
                  handleClick={this.updateDay}
                />
              </div>
            </div>
          </div>

          <div className="day-dashboard-changes" onClick={this.updateCellBlock}>
            SUBMIT CHANGES
          </div>

        </div>
        <div className="day-dashboard-day">
          <div className="day-dashboard-day-header">
            {this.state.date
              ? <div className="day-dashboard-day-num">
                  <div className="day-dashboard-month">
                    {this.months[this.state.date.getMonth ()]}
                    {' '}
                    {this.state.date.getDate ()}
                    ,
                    {' '}
                  </div>
                  <div className="day-dashboard-year">
                    {this.state.date.getFullYear ()}
                  </div>
                </div>
              : <div />}
            <div className="day-dashboard-day-title">
              {this.props.day_titles[this.state.dashboardDay.week][
                this.state.dashboardDay.day
              ] || ''}
            </div>
          </div>
          <div className="day-dashboard-events">
            <div className="day-dashboard-events-holder">
              <div className="hour-markers">
                <HourMarker hour="12:00 AM" />
                <HourMarker hour="1:00 AM" />
                <HourMarker hour="2:00 AM" />
                <HourMarker hour="3:00 AM" />
                <HourMarker hour="4:00 AM" />
                <HourMarker hour="5:00 AM" />
                <HourMarker hour="6:00 AM" />
                <HourMarker hour="7:00 AM" />
                <HourMarker hour="8:00 AM" />
                <HourMarker hour="9:00 AM" />
                <HourMarker hour="10:00 AM" />
                <HourMarker hour="11:00 AM" />
                <HourMarker hour="12:00 PM" />
                <HourMarker hour="1:00 PM" />
                <HourMarker hour="2:00 PM" />
                <HourMarker hour="3:00 PM" />
                <HourMarker hour="4:00 PM" />
                <HourMarker hour="5:00 PM" />
                <HourMarker hour="6:00 PM" />
                <HourMarker hour="7:00 PM" />
                <HourMarker hour="8:00 PM" />
                <HourMarker hour="9:00 PM" />
                <HourMarker hour="10:00 PM" />
                <HourMarker hour="11:00 PM" />
              </div>
              <div className="events-holder" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class CalendarBody extends Component {
  constructor (props) {
    super (props);

    //sat = day 6
    // june = month 5
    this.rows = makeMonthRows (this.props.month);
    this.state = {
      dashboardDay: false,
      dashboardCell: false,
      week: 0,
    };
    this.months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.handleClick = this.handleClick.bind (this);
    this.updateCell = this.updateCell.bind (this);
  }
  handleClick (event, day, cell) {
    this.setState (
      {
        dashboardDay: day,
        dashboardCell: cell,
      },
      () => {
        this.props.updateModal ({
          visible: true,
          content: (
            <DayModal
              updateCell={this.updateCell}
              dashboardDay={day}
              day_titles={this.props.day_titles}
              date={cell.date}
            />
          ),
        });
      }
    );
  }
  updateCell (date_string, cell) {
    this.props.object[date_string] = cell;
    this.props.updateSchool ({year_day_object: this.props.object});
    let school = this.props.parent.state.school;
    school['year_day_object'] = this.props.object;
    this.props.parent.setState ({school});
  }
  render () {
    return (
      <div className="schedule-month-body">
        <table className="schedule-month-table">
          {this.rows.map ((row, index_1) => {
            return (
              <tr>
                {row.map ((cell, index_2) => {
                  console.log(cell);
                  return (
                    <CalendarCell
                      handleClick={this.handleClick}
                      cell={cell}
                      day_titles={this.props.day_titles}
                      day={
                        this.props.object[
                          `${cell.date.getFullYear ()}_${cell.date.getMonth ()}_${cell.date.getDate ()}`
                        ]
                      }
                    />
                  );
                })}
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
}

class ScheduleCalendars extends Component {
  constructor (props) {
    super (props);
    this.state = {
      school: {},
      overflow: 'auto',
    };
    this.updateSchool = this.updateSchool.bind (this);
    this.months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  }
  updateSchool (school) {
    this.setState ({school});
  }
  render () {
    if (this.state.school.start_date) {
      let monthsCovered = [];
      for (
        var i = 0;
        i <
        this.state.school.end_date.getFullYear () * 12 +
          this.state.school.end_date.getMonth () -
          this.state.school.start_date.getFullYear () * 12 -
          this.state.school.start_date.getMonth () +
          1;
        i++
      ) {
        monthsCovered.push (
          new Date (
            this.state.school.start_date.getFullYear (),
            this.state.school.start_date.getMonth () + i,
            1
          )
        );
      }
      return (
        <div
          style={{width: '100%', flexGrow: 1, overflow: this.state.overflow}}
        >
          <div>
            {monthsCovered.map ((month, index) => {
              return (
                <div>
                  <CalendarTitle month={this.months[month.getMonth ()]} />
                  <CalendarBody
                    parent={this}
                    object={this.state.school.year_day_object}
                    month={month}
                    updateModal={this.props.updateModal}
                    day_titles={this.state.school.day_titles}
                    updateSchool={this.props.updateSchool}
                  />
                </div>
              );
            })}
          </div>

        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default ScheduleCalendars;
