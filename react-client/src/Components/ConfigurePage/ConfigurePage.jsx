import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import './configurePage.css';

import CoursesPageHeader from '../HeaderComponent/Header';

import moment from 'moment';

import SubPage from '../CoursesPage/SubPageSkeleton';

import Cookies from 'universal-cookie';
const cookies = new Cookies ();

class DataRow extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      text: this.props.data.map (data => data[0]),
    };
    this.textChange = this.textChange.bind (this);
  }
  sendToServer (id, body) {
    return fetch (`/api/v1/${this.props.endpoint}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cookies.get ('x-api-key'),
        'x-id-key': cookies.get ('x-id-key'),
        school: cookies.get ('school'),
      },
      body: JSON.stringify (body),
    });
  }
  textChange (text, index, valueFunction, key, id) {
    this.state.text[index] = valueFunction (text);
    if (this.state.text[index] != 'Invalid Date') {
      let body = {};
      body[key] = this.state.text[index];
      this.sendToServer (id, body).then (data => data.json ()).then (data => {
        console.log (data);
      });
    }
    this.setState ({text: this.state.text});
  }
  deleteRow (id) {
    if (window.confirm ('Are you sure you would like to delete this row?')) {
      if (
        window.confirm (
          'Are you 100% certain you would like to delete this row? This action is not reversable'
        )
      ) {
        fetch (`/api/v1/${this.props.endpoint}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': cookies.get ('x-api-key'),
            'x-id-key': cookies.get ('x-id-key'),
            school: cookies.get ('school'),
          },
        })
          .then (data => data.json ())
          .then (data => {
            console.log (data);
          });
      }
    }
  }
  render () {
    return (
      <div
        className="box-table-row"
        onDoubleClick={() => this.deleteRow (this.props.id)}
      >
        {this.props.data.map ((data, index) => {
          return (
            <input
              className="box-table-row-info"
              key={'data_' + index}
              type={data[1]}
              value={data[2] (this.state.text[index])}
              onChange={text =>
                this.textChange (
                  text.target.value,
                  index,
                  data[3],
                  data[4],
                  this.props.id
                )}
            />
          );
        })}
      </div>
    );
  }
}

class NewRow extends React.Component {
  constructor (props) {
    super (props);
    let keys = {};
    this.props.data.forEach (data => {
      keys[data[4]] = '';
    });
    this.state = {
      text: keys,
    };
    this.saveRow = this.saveRow.bind (this);
    this.textChange = this.textChange.bind (this);
  }
  saveRow () {
    let saveShown = true;
    for (var key in this.state.text) {
      let text = this.state.text[key];
      if (!text || text == 'Invalid Date') saveShown = false;
    }
    if (saveShown) {
      let body = this.state.text;
      body = {...body, ...this.props.constants};
      fetch (`/api/v1/${this.props.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': cookies.get ('x-api-key'),
          'x-id-key': cookies.get ('x-id-key'),
          school: cookies.get ('school'),
        },
        body: JSON.stringify (body),
      })
        .then (data => data.json ())
        .then (data => {
          console.log (data);
        });
    }
  }

  textChange (text, valueFunction, key) {
    this.state.text[key] = valueFunction (text);
    this.setState ({text: this.state.text});
  }
  render () {
    let saveShown = true;
    for (var key in this.state.text) {
      let text = this.state.text[key];
      if (!text || text == 'Invalid Date') saveShown = false;
    }
    return (
      <div class="create-new-box-row">
        <div className="box-table-row-new">
          {this.props.data.map ((data, index) => {
            return (
              <input
                placeholder={data[0]}
                value={data[2] (this.state.text[data[4]])}
                className="box-table-row-info"
                key={'data_' + index}
                type={data[1]}
                onChange={text =>
                  this.textChange (text.target.value, data[3], data[4])}
              />
            );
          })}
        </div>
        <div
          className={`edit-bar-button edit-bar-save ${saveShown ? 'edit-bar-save-active' : ''}`}
          onClick={this.saveRow}
        >
          SAVE
        </div>
      </div>
    );
  }
}

class DataBox extends Component {
  constructor (props) {
    super (props);
    this.state = {
      expanded: false,
    };
    this.handleClick = this.handleClick.bind (this);
  }
  handleClick () {
    this.props.expandBlock ();
    this.setState ({expanded: true});
  }
  render () {
    return (
      <div
        className={`data-box ${this.state.expanded ? 'data-box-expanded' : ''} ${this.props.box}`}
        onClick={this.handleClick}
      >
        <div className="data-box-content-holder">
          <div className="data-box-overlay">
            <div className="overlay-info">
              <div className="overlay-title">
                {this.props.title}
              </div>
              <div className="overlay-subtitle">
                {this.props.subtitle}
              </div>
            </div>
          </div>
          <div className="data-box-content">
            <SubPage
              dataFunctions={this.props.dataFunctions}
              constants={this.props.constants || {}}
              collectionSingular={this.props.collectionSingular}
              collectionPlural={this.props.collectionPlural}
              populateFields={this.props.populateFields}
              mini={true}
            />
            {/* <div className="box-table">
              <div className="box-table-header">
                <input type="text" placeholder={this.props.placeholder} />
              </div>
              <div className="box-table-keys">
                {this.props.titles.map ((title, index) => {
                  return (
                    <div key={'key_' + title}>
                      {title}
                    </div>
                  );
                })}
              </div>
              <div className="box-table-rows">
                <NewRow
                  data={this.props.newRow.data}
                  endpoint={this.props.endpoint}
                  constants={this.props.newRow.constants}
                />
                {this.props.rows.map ((row, index_1) => {
                  return (
                    <DataRow
                      data={row.data}
                      id={row.id}
                      endpoint={this.props.endpoint}
                      key={'row_' + index_1}
                    />
                  );
                })}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

class ConfigurePage extends Component {
  constructor (props) {
    super (props);
    this.state = {
      username: cookies.get ('username'),
      'x-api-key': cookies.get ('x-api-key'),
      'x-id-key': cookies.get ('x-id-key'),
      school: cookies.get ('school'),
    };
    this.box1 = React.createRef ();
    this.box2 = React.createRef ();
    this.box3 = React.createRef ();
    this.box4 = React.createRef ();
    this.box5 = React.createRef ();
    this.expandBlock = this.expandBlock.bind (this);
  }
    
  expandBlock () {
    this.box1.current.setState ({expanded: false});
    this.box2.current.setState ({expanded: false});
    this.box3.current.setState ({expanded: false});
  }
  render () {
    return (
      <div>
        <CoursesPageHeader school="PVSS (SD83)" barName="Configure" />
        <div>
          <div className="data-boxes">
            <DataBox
              title={'semesters'}
              box={'box-1'}
              expandBlock={this.expandBlock}
              ref={this.box1}
              placeholder={'Semesters'}
              expanded={false}
              subtitle={'Current and Past Semesters'}
              titles={['Name', 'Start Date', 'End Date']}
              endpoint={'semesters'}
              collectionPlural={'Semesters'}
              collectionSingular={'Semester'}
              populateFields={''}
              dataFunctions={{
                Name: {
                  display: semester => {
                    return semester.name;
                  },
                  input: {
                    value: semester => {
                      return semester !== undefined ? semester.name : '';
                    },
                    type: 'text',
                    label: 'Name',
                    name: 'name',
                  },
                },
                'Start Date': {
                  display: semester => {
                    return moment (semester.start_date).format ('YYYY-MM-DD');
                  },
                  input: {
                    value: semester => {
                      return semester !== undefined
                        ? semester.start_date
                        : new Date ();
                    },
                    type: 'date',
                    label: 'Start Date',
                    name: 'start_date',
                  },
                },
                'End Date': {
                  display: semester => {
                    return moment (semester.end_date).format ('YYYY-MM-DD');
                  },
                  input: {
                    value: semester => {
                      return semester !== undefined
                        ? semester.end_date
                        : new Date ();
                    },
                    type: 'date',
                    label: 'End Date',
                    name: 'end_date',
                  },
                },
              }}
            />

            <DataBox
              title={'Constant Blocks'}
              box="box-2"
              ref={this.box2}
              placeholder={'Constant Blocks'}
              expandBlock={this.expandBlock}
              expanded={false}
              subtitle={'All Constant Blocks'}
              titles={['Block']}
              endpoint={'blocks'}
              collectionPlural={'Blocks'}
              collectionSingular={'Block'}
              populateFields={''}
              constants={{is_constant: true}}
              dataFunctions={{
                Block: {
                  display: block => {
                    return block.block;
                  },
                  input: {
                    value: block => {
                      return block !== undefined ? block.block : '';
                    },
                    type: 'text',
                    label: 'Block',
                    name: 'block',
                  },
                },
              }}
            />

            <DataBox
              title={'Changing Blocks'}
              box="box-3"
              placeholder={'Changing Blocks'}
              ref={this.box3}
              expanded={false}
              expandBlock={this.expandBlock}
              subtitle={'All Changing Blocks'}
              titles={['Block']}
              endpoint={'blocks'}
              collectionPlural={'Blocks'}
              collectionSingular={'Block'}
              populateFields={''}
              constants={{is_constant: false}}
              dataFunctions={{
                Block: {
                  display: block => {
                    return block.block;
                  },
                  input: {
                    value: block => {
                      return block !== undefined ? block.block : '';
                    },
                    type: 'text',
                    label: 'Block',
                    name: 'block',
                  },
                },
              }}
            />
            <div className="data-box box-4">
              <div className="data-box-overlay">
                <div className="overlay-info">
                  <div className="overlay-title">
                    Spare Name
                  </div>
                  <div className="overlay-subtitle">
                    Spare Block Name
                  </div>
                </div>
              </div>
            </div>
            <div className="data-box box-5">
              <div className="data-box-overlay">
                <div className="overlay-info">
                  <div className="overlay-title">
                    School Year
                  </div>
                  <div className="overlay-subtitle">
                    Start and End date
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ConfigurePage;
