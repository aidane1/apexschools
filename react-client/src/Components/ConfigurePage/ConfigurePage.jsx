import React, {Component, useCallback} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import {useDropzone} from 'react-dropzone';

import './configurePage.css';

import CoursesPageHeader from '../HeaderComponent/Header';

import moment from 'moment';

import SubPage from '../CoursesPage/SubPageSkeleton';

import Cookies from 'universal-cookie';
const cookies = new Cookies ();

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

function ImageUpload (props) {
  const onDrop = useCallback (files => {
    //get the input and the file
    let file = files[0];
    //if the file isn't a image nothing happens.
    //you are free to implement a fallback
    if (!file || !file.type.match (/image.*/)) {
    } else {
      let formData = new FormData ();
      formData.append ('resource', file);
      formData.append ('path', '/logo');

      let xhr = new XMLHttpRequest ();
      xhr.open ('POST', `/api/v1/resources`);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          let response = JSON.parse (xhr.responseText);
          props.ImageUpload (response);
        }
      };

      xhr.send (formData);
    }
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone ({onDrop});

  return (
    <div {...getRootProps ()}>
      <input {...getInputProps ()} />
      <div
        style={{
          width: '70%',
          padding: '30px',
          fontSize: '20px',
          backgroundColor: '#f5f5f5',
          margin: 'auto',
          marginTop: '20px',
          textAlign: 'center',
        }}
      >
        Click Or Drop Files
      </div>
    </div>
  );
}

class ImageBox extends Component {
  constructor (props) {
    super (props);
    this.state = {
      expanded: false,
      logo: false,
    };
    this.handleClick = this.handleClick.bind (this);
    this.ImageUpload = this.ImageUpload.bind (this);
  }
  handleClick () {
    this.props.expandBlock ();
    this.setState ({expanded: true});
  }
  componentDidMount () {
    fetch (`/api/v1/schools/${this.props.headers.school}?populate=logo`, {
      method: 'GET',
      headers: this.props.headers,
    })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          console.log (data.body);
          this.setState ({logo: data.body.logo});
        }
      })
      .catch (e => {
        console.log (e);
      });
  }
  ImageUpload (image) {
    image = image.body;
    fetch (`/api/v1/schools/${this.props.headers.school}?populate=logo`, {
      method: 'PUT',
      headers: {
        ...this.props.headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({logo: image._id}),
    })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          this.setState ({logo: data.body.logo});
        }
      })
      .catch (e => {
        console.log (e);
      });
  }
  render () {
    console.log (this.state);
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
            {this.state.logo
              ? <img
                  src={this.state.logo.path}
                  style={{
                    width: '50%',
                    display: 'block',
                    margin: 'auto',
                    boxShadow: '0px 3px 7px rgba(0,0,0,0.2)',
                  }}
                />
              : <img />}
            <ImageUpload ImageUpload={this.ImageUpload} />
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
    this.box4.current.setState ({expanded: false});
  }
  render () {
    return (
      <div>
        <CoursesPageHeader school="PVSS (SD83)" barName="Configure" />
        <div>
          <div className="data-boxes">
            <DataBox
              title={'Semesters'}
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

            <ImageBox
              title={'School Logo'}
              box={'box-4'}
              expandBlock={this.expandBlock}
              ref={this.box4}
              expanded={false}
              headers={{
                'x-api-key': this.state['x-api-key'],
                'x-id-key': this.state['x-id-key'],
                school: this.state['school'],
              }}
              subtitle={'The image to represent your school'}
            />
            {/* <div className="data-box box-4">
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
            </div> */}
            {/* <div className="data-box box-5">
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
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}
export default ConfigurePage;
