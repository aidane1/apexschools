import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faMinus,
  faChevronUp,
  faTimes,
  faExchangeAlt,
  faCut,
  faHistory,
  faClock,
} from '@fortawesome/free-solid-svg-icons';

import './ScheduleTable.css';
import '../DataTable/select.css';
import '../DataTable/material.css';

function formatUnit (hour, minute) {
  return `${(hour + 11) % 12 + 1}:${minute.toString ().length == 1 ? '0' + minute.toString () : minute}`;
}
function formatTime (time) {
  return `${formatUnit (time.start_hour, time.start_minute)} - ${formatUnit (time.end_hour, time.end_minute)}`;
}
function formatSchedule (
  schedule,
  dayTitles = [
    {
      day_1: 'Monday',
      day_2: 'Tuesday',
      day_3: 'Wednesday',
      day_4: 'Thursday',
      day_5: 'Friday',
    },
  ]
) {
  let schedules = [];
  schedule.day_blocks.map ((week, index) => {
    schedules.push ([[{type: 'filler'}]]);
    for (var key in week) {
      schedules[index][0].push ({
        title: dayTitles[index][key],
        type: 'title',
        week: index,
        day: key,
      });
    }
  });
  schedule.block_times.map ((time, index_1) => {
    schedule.day_blocks.map ((week, index) => {
      schedules[index].push ([{time: time, position: index_1, type: 'time'}]);
    });
    schedule.day_blocks.map ((week, index_2) => {
      for (var key in week) {
        let blockCount = 0;
        let index_3 = 0;
        let first = false;
        let last = false;
        while (true) {
          blockCount += week[key][index_3].block_span;
          if (blockCount > index_1 || index_3 >= week[key].length) {
            if (blockCount - week[key][index_3].block_span === index_1) {
              first = true;
            }
            if (blockCount == index_1 + 1) {
              last = true;
            }
            break;
          }
          index_3++;
        }
        schedules[index_2][index_1 + 1].push ({
          type: 'block',
          block_span: week[key][index_3].block_span,
          block: week[key][index_3].block,
          first,
          last,
          week: index_2,
          day: key,
          blockNum: index_3,
        });
      }
    });
  });
  return schedules;
}

class ScheduleBlock extends Component {
  constructor (props) {
    super (props);
    this.state = {
      selectOpen: false,
      options: this.props.options.map (block => {
        return {name: block.block, value: block._id};
      }),
    };
    this.handleContext = this.handleContext.bind (this);
    this.toggleContextMenu = this.toggleContextMenu.bind (this);
    this.handleClose = this.handleClose.bind (this);
    this.handleChange = this.handleChange.bind (this);
    this.handleMerge = this.handleMerge.bind (this);
    this.contextMenu = this.props.contextMenu;
    this.handleSelectChange = this.handleSelectChange.bind (this);
  }
  handleContext (event) {
    let {pageX, pageY, target} = event;
    console.log ({pageX, pageY, target});
    event.preventDefault ();
    this.contextMenu.current.updateCurrentElement (this);
    this.toggleContextMenu (pageX, pageY - 3);
  }
  toggleContextMenu (x, y) {
    this.contextMenu.current.setState ({
      top: `${y}px`,
      left: `${x}px`,
      display: 'block',
    });
  }
  handleClose () {
    this.contextMenu.current.setState ({
      top: `0px`,
      left: `0px`,
      display: 'none',
    });
  }
  handleChange () {
    this.setState (state => ({
      selectOpen: true,
    }));
  }
  handleSelectChange (event) {
    let val = event.target.value;
    this.setState (
      state => ({
        selectOpen: false,
      }),
      () => {
        this.props.handleBlockUpdate (
          this.props.week,
          this.props.day,
          this.props.blockNum,
          val
        );
      }
    );
  }
  handleMerge () {
    this.props.handleBlockMerge (
      this.props.week,
      this.props.day,
      this.props.blockNum
    );
  }
  handleCut () {
    this.props.handleBlockCut (
      this.props.week,
      this.props.day,
      this.props.blockNum
    );
  }
  render () {
    return (
      <td
        rowspan={this.props.rowspan}
        style={this.props.style}
        className={this.props.className}
        onContextMenu={this.handleContext}
        handleClose={this.handleClose}
      >
        {!this.state.selectOpen
          ? this.props.block.block
          : <div className="select-holder">
              <div class="select" style={{width: '100%', margin: '0'}}>
                <select
                  class="select-text"
                  required
                  onChange={this.handleSelectChange}
                >
                  {this.state.options.map (option => {
                    return (
                      <option
                        value={option.value}
                        selected={this.props.block._id == option.value}
                      >
                        {option.name}
                      </option>
                    );
                  })}
                </select>
                <span class="select-highlight" />
                <span class="select-bar" />
                <label class="select-label" />
              </div>
            </div>}
      </td>
    );
  }
}
class ScheduleTime extends Component {
  constructor (props) {
    super (props);
    this.handleClick = this.handleClick.bind (this);
    this.handleSubmit = this.handleSubmit.bind (this);
  }
  handleClick () {
    this.props.dataBar.current.extend (
      this.props.block.time,
      this.props.block,
      this
    );
  }
  handleSubmit (time) {
    this.props.handleTimeChange (time, this.props.block.position);
  }
  render () {
    return (
      <td className="schedule-time" onClick={this.handleClick}>
        {formatTime (this.props.block.time)}
      </td>
    );
  }
}

class ContextMenu extends Component {
  constructor (props) {
    super (props);
    this.currentElement = false;
    this.state = {
      display: 'none',
      top: '0px',
      left: '0px',
    };
    this.handleClose = this.handleClose.bind (this);
    this.handleMerge = this.handleMerge.bind (this);
    this.handleChange = this.handleChange.bind (this);
    this.handleCut = this.handleCut.bind (this);
  }
  handleClose () {
    this.currentElement.handleClose ();
  }
  handleMerge () {
    this.currentElement.handleMerge ();
    this.handleClose ();
  }
  handleChange () {
    this.currentElement.handleChange ();
    this.handleClose ();
  }
  updateCurrentElement (element) {
    this.currentElement = element;
  }
  handleCut () {
    this.currentElement.handleCut ();
    this.handleClose ();
  }
  render () {
    return (
      <div
        className="context-menu"
        style={{
          top: this.state.top,
          left: this.state.left,
          display: this.state.display,
        }}
      >
        <div className="menu-option" onClick={this.handleMerge}>
          <span>
            Merge Up
          </span>
          <span className="icon-holder">
            <FontAwesomeIcon icon={faChevronUp} />
          </span>
        </div>
        <div className="menu-option" onClick={this.handleCut}>
          <span>
            Split End
          </span>
          <span className="icon-holder">
            <FontAwesomeIcon icon={faCut} />
          </span>
        </div>
        <div className="menu-option" onClick={this.handleChange}>
          <span>
            Change Block
          </span>
          <span className="icon-holder">
            <FontAwesomeIcon icon={faExchangeAlt} />
          </span>
        </div>
        <div className="menu-option" onClick={this.handleClose}>
          <span>
            Close
          </span>
          <span className="icon-holder">
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </div>
      </div>
    );
  }
}

class DataEntryBar extends Component {
  constructor (props) {
    super (props);
    this.state = {
      extended: false,
      start_hour: 0,
      start_minute: 0,
      end_hour: 0,
      end_minute: 0,
    };
    this.block = false;
    this.extend = this.extend.bind (this);
    this.changeTime = this.changeTime.bind (this);
    this.submitChanges = this.submitChanges.bind (this);
  }
  extend (time, block, parent) {
    this.setState ({
      extended: true,
      start_hour: time.start_hour,
      end_hour: time.end_hour,
      start_minute: time.start_minute,
      end_minute: time.end_minute,
    });
    this.block = parent;
  }
  changeTime (section, event) {
    let newState = {};
    newState[section] = event.target.value;
    this.setState (newState);
  }
  submitChanges () {
    let state = this.state;
    let time = {
      start_hour: state.start_hour,
      end_hour: state.end_hour,
      start_minute: state.start_minute,
      end_minute: state.end_minute,
    };
    this.setState (
      {
        extended: false,
      },
      () => {
        this.block.handleSubmit (time);
      }
    );
  }
  render () {
    return (
      <div
        className={`data-entry-bar ${this.state.extended ? 'data-entry-bar-active' : ''}`}
      >
        <div className="group-holder">
          <div className="bar-section-title">
            Current Time
          </div>
          <div className="bar-section">
            <div className="bar-section-icon">
              <FontAwesomeIcon icon={faHistory} />
            </div>
            <div className="bar-section-inputs">
              {formatTime ({
                start_hour: this.state.start_hour,
                start_minute: this.state.start_minute,
                end_hour: this.state.end_hour,
                end_minute: this.state.end_minute,
              })}
            </div>
          </div>
        </div>
        <div className="group-holder">
          <div className="bar-section-title">
            New Start Time
          </div>
          <div className="bar-section">
            <div className="bar-section-icon">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="bar-section-inputs">
              <select onChange={event => this.changeTime ('start_hour', event)}>
                <option value="" selected disabled>Hour</option>
                <option value="0">12 AM</option>
                <option value="1">01 AM</option>
                <option value="2">02 AM</option>
                <option value="3">03 AM</option>
                <option value="4">04 AM</option>
                <option value="5">05 AM</option>
                <option value="6">06 AM</option>
                <option value="7">07 AM</option>
                <option value="8">08 AM</option>
                <option value="9">09 AM</option>
                <option value="10">10 AM</option>
                <option value="11">11 AM</option>
                <option value="12">12 PM</option>
                <option value="13">01 PM</option>
                <option value="14">02 PM</option>
                <option value="15">03 PM</option>
                <option value="16">04 PM</option>
                <option value="17">05 PM</option>
                <option value="18">06 PM</option>
                <option value="19">07 PM</option>
                <option value="20">08 PM</option>
                <option value="21">09 PM</option>
                <option value="22">10 PM</option>
                <option value="23">11 PM</option>
              </select>
              <select
                onChange={event => this.changeTime ('start_minute', event)}
              >
                <option value="" selected disabled>Minute</option>
                <option value="0">00</option>
                <option value="1">01</option>
                <option value="2">02</option>
                <option value="3">03</option>
                <option value="4">04</option>
                <option value="5">05</option>
                <option value="6">06</option>
                <option value="7">07</option>
                <option value="8">08</option>
                <option value="9">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
                <option value="32">32</option>
                <option value="33">33</option>
                <option value="34">34</option>
                <option value="35">35</option>
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
                <option value="40">40</option>
                <option value="41">41</option>
                <option value="42">42</option>
                <option value="43">43</option>
                <option value="44">44</option>
                <option value="45">45</option>
                <option value="46">46</option>
                <option value="47">47</option>
                <option value="48">48</option>
                <option value="49">49</option>
                <option value="50">50</option>
                <option value="51">51</option>
                <option value="52">52</option>
                <option value="53">53</option>
                <option value="54">54</option>
                <option value="55">55</option>
                <option value="56">56</option>
                <option value="57">57</option>
                <option value="58">58</option>
                <option value="59">59</option>
              </select>
            </div>
          </div>
        </div>
        <div className="group-holder">
          <div className="bar-section-title">
            New End Time
          </div>
          <div className="bar-section">
            <div className="bar-section-icon">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="bar-section-inputs">
              <select onChange={event => this.changeTime ('end_hour', event)}>
                <option value="" selected disabled>Hour</option>
                <option value="0">12 AM</option>
                <option value="1">01 AM</option>
                <option value="2">02 AM</option>
                <option value="3">03 AM</option>
                <option value="4">04 AM</option>
                <option value="5">05 AM</option>
                <option value="6">06 AM</option>
                <option value="7">07 AM</option>
                <option value="8">08 AM</option>
                <option value="9">09 AM</option>
                <option value="10">10 AM</option>
                <option value="11">11 AM</option>
                <option value="12">12 PM</option>
                <option value="13">01 PM</option>
                <option value="14">02 PM</option>
                <option value="15">03 PM</option>
                <option value="16">04 PM</option>
                <option value="17">05 PM</option>
                <option value="18">06 PM</option>
                <option value="19">07 PM</option>
                <option value="20">08 PM</option>
                <option value="21">09 PM</option>
                <option value="22">10 PM</option>
                <option value="23">11 PM</option>
              </select>
              <select onChange={event => this.changeTime ('end_minute', event)}>
                <option value="" selected disabled>Minute</option>
                <option value="0">00</option>
                <option value="1">01</option>
                <option value="2">02</option>
                <option value="3">03</option>
                <option value="4">04</option>
                <option value="5">05</option>
                <option value="6">06</option>
                <option value="7">07</option>
                <option value="8">08</option>
                <option value="9">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
                <option value="32">32</option>
                <option value="33">33</option>
                <option value="34">34</option>
                <option value="35">35</option>
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
                <option value="40">40</option>
                <option value="41">41</option>
                <option value="42">42</option>
                <option value="43">43</option>
                <option value="44">44</option>
                <option value="45">45</option>
                <option value="46">46</option>
                <option value="47">47</option>
                <option value="48">48</option>
                <option value="49">49</option>
                <option value="50">50</option>
                <option value="51">51</option>
                <option value="52">52</option>
                <option value="53">53</option>
                <option value="54">54</option>
                <option value="55">55</option>
                <option value="56">56</option>
                <option value="57">57</option>
                <option value="58">58</option>
                <option value="59">59</option>
              </select>
            </div>
          </div>
        </div>
        <div className="group-holder">
          <div className="item-button" onClick={this.submitChanges}>
            SUBMIT CHANGES
          </div>
        </div>
      </div>
    );
  }
}

class TitleInput extends Component {
  constructor (props) {
    super (props);
    this.state = {
      value: this.props.value,
    };
    this.onChange = this.onChange.bind (this);
  }
  onChange (event) {
    let value = event.target.value;
    this.setState ({value}, () => {
      this.props.dayTitlesUpdate (this.props.week, this.props.day, value);
    });
  }
  render () {
    return (
      <input
        type="text"
        value={this.state.value}
        onChange={this.onChange}
        style={{
          fontSize: '16px',
          width: '100%',
          fontWeight: '500',
          backgroundColor: 'transparent',
          border: '0',
          textAlign: 'center',
        }}
      />
    );
  }
}

class ScheduleTables extends Component {
  constructor (props) {
    super (props);
    this.state = {
      schedule: {
        day_blocks: [
          {
            day_1: [],
            day_2: [],
            day_3: [],
            day_4: [],
            day_5: [],
          },
        ],
        block_times: [],
      },
      formattedSchedule: [],
      blocks: [],
      day_titles: [
        {
          day_1: 'Monday',
          day_2: 'Tuesday',
          day_3: 'Wednesday',
          day_4: 'Thursday',
          day_5: 'Friday',
        },
      ],
    };
    this.updateSchedule = this.updateSchedule.bind (this);
    this.findBlock = this.findBlock.bind (this);
    this.addRow = this.addRow.bind (this);
    this.removeRow = this.removeRow.bind (this);
    this.contextMenu = React.createRef ();
    this.dataBar = React.createRef ();
    this.handleBlockUpdate = this.handleBlockUpdate.bind (this);
    this.handleBlockMerge = this.handleBlockMerge.bind (this);
    this.handleBlockCut = this.handleBlockCut.bind (this);
    this.handleTimeChange = this.handleTimeChange.bind (this);
    this.tableUpdate = this.tableUpdate.bind (this);
    this.dayTitlesUpdate = this.dayTitlesUpdate.bind (this);
  }
  updateSchedule (schedule, blocks, day_titles) {
    this.setState ({
      schedule,
      formattedSchedule: formatSchedule (schedule, day_titles),
      blocks,
      day_titles,
    });
  }
  tableUpdate (schedule) {
    this.props.sendScheduleToServer (schedule);
    this.setState ({
      schedule,
      formattedSchedule: formatSchedule (schedule),
    });
  }
  dayTitlesUpdate (week, day, value) {
    this.state.day_titles[week][day] = value;
    this.props.updateDayTitles (this.state.day_titles);
    this.setState ({
      day_titles: this.state.day_titles,
    });
  }
  findBlock (block) {
    for (var i = 0; i < this.state.blocks.length; i++) {
      if (this.state.blocks[i]._id == block) {
        return this.state.blocks[i];
      }
    }
    return false;
  }
  addRow () {
    let schedule = {...this.state.schedule};
    schedule.block_times.push ({
      start_hour: 9,
      start_minute: 10,
      end_hour: 10,
      end_minute: 12,
    });
    for (var i = 0; i < schedule.day_blocks.length; i++) {
      for (var key in schedule.day_blocks[i]) {
        schedule.day_blocks[i][key].push ({
          block: this.state.blocks[0]._id || '',
          block_span: 1,
        });
      }
    }
    this.tableUpdate (schedule);
  }
  removeRow () {
    let schedule = {...this.state.schedule};
    schedule.block_times.pop ();
    for (var i = 0; i < schedule.day_blocks.length; i++) {
      for (var key in schedule.day_blocks[i]) {
        let newElement = schedule.day_blocks[i][key].pop ();
        if (newElement.block_span > 1) {
          newElement.block_span -= 1;
          schedule.day_blocks[i][key].push (newElement);
        }
      }
    }
    this.tableUpdate (schedule);
  }
  handleBlockUpdate (week, day, block, newVal) {
    let schedule = {...this.state.schedule};
    schedule.day_blocks[week][day][block].block = newVal;
    this.tableUpdate (schedule);
  }
  handleBlockMerge (week, day, block) {
    if (block > 0) {
      let schedule = {...this.state.schedule};
      schedule.day_blocks[week][day][block - 1].block_span +=
        schedule.day_blocks[week][day][block].block_span;
      schedule.day_blocks[week][day] = schedule.day_blocks[week][
        day
      ].filter ((element, index) => {
        return index != block;
      });
      this.tableUpdate (schedule);
    }
  }
  handleBlockCut (week, day, block) {
    let schedule = {...this.state.schedule};
    if (schedule.day_blocks[week][day][block].block_span > 1) {
      schedule.day_blocks[week][day][block].block_span -= 1;
      schedule.day_blocks[week][day].splice (block, 0, {
        block: schedule.day_blocks[week][day][block].block,
        block_span: 1,
      });
      this.tableUpdate (schedule);
    }
  }
  handleTimeChange (time, block) {
    for (var key in time) {
      time[key] = parseInt (time[key]);
    }
    let schedule = {...this.state.schedule};
    schedule.block_times[block] = time;
    this.tableUpdate (schedule);
  }

  render () {
    return (
      <div>
        {this.state.formattedSchedule.map ((week, index_1) => {
          return (
            <div className="schedule-week-wrapper">
              <table className="schedule-week">
                {week.map ((row, index_2) => {
                  return (
                    <tr className="schedule-row">
                      {row.map ((block, index_3) => {
                        switch (block.type) {
                          case 'block':
                            if (block.first) {
                              return (
                                <ScheduleBlock
                                  handleBlockCut={this.handleBlockCut}
                                  handleBlockMerge={this.handleBlockMerge}
                                  handleBlockUpdate={this.handleBlockUpdate}
                                  week={block.week}
                                  day={block.day}
                                  blockNum={block.blockNum}
                                  options={this.state.blocks}
                                  contextMenu={this.contextMenu}
                                  style={
                                    index_3 == 5 ? {borderRight: 'none'} : {}
                                  }
                                  rowspan={block.block_span}
                                  className={'schedule-block'}
                                  block={this.findBlock (block.block)}
                                />
                              );
                            } else {
                              return '';
                            }
                          case 'title':
                            return (
                              <td className="schedule-title">
                                <TitleInput
                                  value={block.title}
                                  week={block.week}
                                  day={block.day}
                                  dayTitlesUpdate={this.dayTitlesUpdate}
                                />
                              </td>
                            );
                          case 'time':
                            return (
                              <ScheduleTime
                                handleTimeChange={this.handleTimeChange}
                                dataBar={this.dataBar}
                                block={block}
                              />
                            );
                          case 'filler':
                            return <td className="schedule-filler" />;
                        }
                      })}
                    </tr>
                  );
                })}
              </table>
              <div className="table-footer">
                <div
                  className="footer-button footer-button-add"
                  onClick={this.addRow}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </div>
                <div
                  className="footer-button footer-button-subtract"
                  onClick={this.removeRow}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </div>
              </div>
            </div>
          );
        })}
        <ContextMenu ref={this.contextMenu} />
        <DataEntryBar ref={this.dataBar} />
      </div>
    );
  }
}

export default ScheduleTables;
