import React, {Component} from 'react';

import Header from '../HeaderComponent/Header';

import moment from 'moment';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {
  faCaretDown,
  faCaretUp,
  faTimes,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

import ReactQuill from 'react-quill';

import {QuillDeltaToHtmlConverter} from 'quill-delta-to-html';

import {SortableContainer, SortableElement} from 'react-sortable-hoc';

import './index.css';

import 'react-quill/dist/quill.snow.css';

import arrayMove from 'array-move';

import Cookies from 'universal-cookie';

const cookies = new Cookies ();

const SortableItem = SortableElement (props => {
  return (
    <AnnouncementSection
      updateModal={props.updateModal}
      createAnnouncement={props.createAnnouncement}
      updateAnnouncement={props.updateAnnouncement}
      deleteSection={props.deleteSection}
      deleteAnnouncement={props.deleteAnnouncement}
      possible_grades={props.possible_grades}
      tile={props.value}
    />
  );
});

const SortableList = SortableContainer (props => {
  return (
    <div>
      {props.items.map ((value, index) => (
        <SortableItem
          updateModal={props.updateModal}
          createAnnouncement={props.createAnnouncement}
          updateAnnouncement={props.updateAnnouncement}
          deleteSection={props.deleteSection}
          deleteAnnouncement={props.deleteAnnouncement}
          possible_grades={props.possible_grades}
          key={value._id}
          index={index}
          value={value}
        />
      ))}
    </div>
  );
});

class NewAnnouncementModal extends Component {
  constructor (props) {
    super (props);
    this.state = {
      text: this.props.text || [],
      possible_grades: this.props.possible_grades || [9, 10, 11, 12],
      grades: this.props.grades || [9, 10, 11, 12],
    };
    this.text = this.props.text;
    this.grades = this.props.grades;
    this.quill = React.createRef ();
    this.handleChange = this.handleChange.bind (this);
    this.handleClick = this.handleClick.bind (this);
    this.changeGrade = this.changeGrade.bind (this);
  }
  componentWillReceiveProps (props) {
    this.setState (props);
  }
  handleChange (content, delta, source, editor) {
    this.text = editor.getContents ().ops;
  }
  handleClick () {
    this.props.createAnnouncement (this.text, this.state.grades);
    this.props.updateModal ({visible: false}, () => {});
  }
  changeGrade (grade, state) {
    console.log ({grade, state});
    if (state) {
      this.state.grades.push (grade);
      // this.grades.push (grade);
    } else {
      this.state.grades = this.state.grades.filter (num => num != grade);
      // this.grades = this.grades.filter (num => num != grade);
    }
    this.state.grades = this.state.grades.sort ((a, b) => {
      return a > b ? 1 : -1;
    });
    // this.grades = this.state.grades.sort ((a, b) => {
    //   return a > b ? 1 : -1;
    // });
    console.log (this.state.grades);
  }
  render () {
    return (
      <div
        style={{
          backgroundColor: 'white',
          boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12)',
        }}
      >
        <ReactQuill
          ref={this.quill}
          value={this.state.text || []}
          onChange={this.handleChange}
          style={{width: '500px'}}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: '10px',
          }}
        >
          <div
            className="edit-bar-button edit-bar-save edit-bar-save-active"
            style={{width: '100px', marginTop: '20px'}}
            onClick={this.handleClick}
          >
            {this.props.buttonText || 'CREATE'}
          </div>
          {this.state.possible_grades.map ((grade, index) => {
            return (
              <div
                key={'grade_' + index}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  fontSize: '12px',
                  alignItems: 'center',
                  marginTop: '15px',
                }}
              >
                {grade}
                <CheckBox
                  style={{width: '20px', height: '20px', marginLeft: '10px'}}
                  updateActive={this.changeGrade}
                  address={grade}
                  checked={this.state.grades.indexOf (grade) >= 0}
                />
              </div>
            );
          })}

        </div>

      </div>
    );
  }
}

class NewAnnouncement extends Component {
  constructor (props) {
    super (props);
    this.handleClick = this.handleClick.bind (this);
  }
  handleClick (event) {
    event.stopPropagation ();
    this.props.updateModal ({
      visible: true,
      content: (
        <NewAnnouncementModal
          updateModal={this.props.updateModal}
          text={''}
          createAnnouncement={this.props.createAnnouncement}
          grades={this.props.possible_grades}
          possible_grades={this.props.possible_grades}
        />
      ),
    });
  }
  render () {
    return (
      <div className="new-announcement" onClick={this.handleClick}>
        + New Announcement
      </div>
    );
  }
}

class Announcement extends Component {
  constructor (props) {
    super (props);
    this.handleClick = this.handleClick.bind (this);
    this.updateAnnouncement = this.updateAnnouncement.bind (this);
    this.deleteAnnouncement = this.deleteAnnouncement.bind (this);
  }
  updateAnnouncement (text, grades) {
    this.props.updateAnnouncement (
      this.props.tileId,
      this.props.announcement._id,
      grades,
      text
    );
  }
  handleClick (event) {
    event.stopPropagation ();
    this.props.updateModal ({
      visible: true,
      content: (
        <NewAnnouncementModal
          text={this.props.announcement.delta}
          updateModal={this.props.updateModal}
          grades={this.props.announcement.grades}
          possible_grades={this.props.possible_grades}
          createAnnouncement={this.updateAnnouncement}
          buttonText="SAVE"
        />
      ),
    });
  }
  deleteAnnouncement (event) {
    event.stopPropagation ();
    this.props.deleteAnnouncement (this.props.announcement._id);
  }
  render () {
    let cfg = {};

    let converter = new QuillDeltaToHtmlConverter (
      this.props.announcement.delta,
      cfg
    );

    let html = converter.convert ();

    return (
      <div
        className="announcement-tile-announcement"
        onClick={this.handleClick}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              marginRight: '10px',
              marginTop: '4px',
              width: '10px',
              minWidth: '10px',
              minHeight: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'rgba(30,30,70,0.8)',
            }}
          />
          <div
            dangerouslySetInnerHTML={{__html: html}}
            className="announcement-rendered-text"
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-10px',
              right: '10px',
              fontSize: '12px',
              fontStyle: 'italic',
              color: 'rgba(50,50,50,0.8)',
            }}
          >
            {this.props.announcement.length > 1 ? 'Grades ' : 'Grade '}
            {this.props.announcement.grades.join (', ')}
          </div>
        </div>
        <FontAwesomeIcon
          icon={faTimes}
          style={{alignSelf: 'center'}}
          onClick={this.deleteAnnouncement}
        />
      </div>
    );
  }
}

class EmptyAnnouncementSection extends Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <div className="announcement-tile">
        <div className="announcement-tile-title">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <div className="title-text">No Sections Yet!</div>
          </div>
        </div>
      </div>
    );
  }
}

class AnnouncementSection extends Component {
  constructor (props) {
    super (props);
    this.state = {
      extended: false,
    };
    this.handleClick = this.handleClick.bind (this);
    this.createAnnouncement = this.createAnnouncement.bind (this);
    this.deleteSection = this.deleteSection.bind (this);
  }
  handleClick () {
    this.setState ({extended: !this.state.extended});
  }
  deleteSection (event) {
    event.stopPropagation ();
    this.props.deleteSection (this.props.tile._id);
  }
  createAnnouncement (text, grades) {
    this.props.createAnnouncement (grades, text, this.props.tile._id);
  }
  render () {
    let {extended} = this.state;
    return (
      <div className="announcement-tile" onClick={this.handleClick}>
        <div className="announcement-tile-title">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <FontAwesomeIcon
              icon={faTimes}
              style={{fonstSize: '10px'}}
              size={'xs'}
              onClick={this.deleteSection}
            />
            <div className="title-text">{this.props.tile.title}</div>
          </div>
          <FontAwesomeIcon
            icon={this.state.extended ? faCaretDown : faCaretUp}
          />
        </div>
        <div
          className="announcement-tile-body"
          style={extended ? {display: 'block'} : {display: 'none'}}
        >
          {this.props.tile.announcements.map ((announcement, index) => {
            console.log (this.props.possible_grades);
            return (
              <Announcement
                updateModal={this.props.updateModal}
                announcement={announcement}
                possible_grades={this.props.possible_grades}
                key={announcement._id}
                updateAnnouncement={this.props.updateAnnouncement}
                tileId={this.props.tile._id}
                deleteAnnouncement={this.props.deleteAnnouncement}
              />
            );
          })}
          <NewAnnouncement
            updateModal={this.props.updateModal}
            possible_grades={this.props.possible_grades}
            createAnnouncement={this.createAnnouncement}
          />
        </div>
      </div>
    );
  }
}

class NewSection extends Component {
  constructor (props) {
    super (props);
    this.state = {
      extended: false,
      text: '',
    };
    this.input = React.createRef ();
    this.extend = this.extend.bind (this);
    this.onChange = this.onChange.bind (this);
    this.onKeyPress = this.onKeyPress.bind (this);
  }
  extend () {
    this.setState ({extended: true, text: ''}, () => {
      this.input.current.focus ();
    });
  }
  onChange (event) {
    this.setState ({text: event.target.value});
    console.log (event.target.value);
  }
  onKeyPress (event) {
    if (event.key == 'Enter') {
      this.setState ({extended: false}, () => {
        this.props.createSection (this.state.text);
      });
      console.log ('Done!');
    }
  }
  render () {
    return (
      <div
        className={
          this.state.extended
            ? 'new-announcement-tile-extended'
            : 'new-announcement-tile'
        }
        style={{transition: 'max-height 0.3s cubic-bezier(.08,.75,.2,.99)'}}
      >
        <input
          value={this.state.text}
          className="new-announcement-tile-input"
          ref={this.input}
          placeholder="New Section..."
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
        />
      </div>
    );
  }
}

class AnnouncementsSection extends Component {
  constructor (props) {
    super (props);
    this.state = {
      // tiles: [],
      // tiles: ['Item 1', 'Item 2', 'Item 3'],
    };
    this.onSortEnd = this.onSortEnd.bind (this);
  }
  // componentWillReceiveProps (props) {
  // console.log(props);
  // this.setState (props);
  // }
  // componentWillUpdate (nextProps, prevState, snapshot) {
  //   let sumOldAnnouncements = prevState.tiles.reduce((accumulator, current) => {
  //     return accumulator + current.announcements.length;
  //   }, 0)
  //   let sumNewAnnouncements = nextProps.tiles.reduce((accumulator, current) => {
  //     return accumulator + current.announcements.length;
  //   }, 0)
  //   if (nextProps.tiles.length === prevState.tiles.length && sumNewAnnouncements === sumOldAnnouncements) {

  //   } else {

  //   }
  //   console.log ({snapshot, prevProps, prevState});
  // }
  // static getDerivedStateFromProps (props, state) {
  //   console.log ({state, props});
  //   // let sumPropAnnouncements = prevState.tiles.reduce((accumulator, current) => {
  //   //   return accumulator + current.announcements.length;
  //   // }, 0)
  //   // let sumNewAnnouncements = nextProps.tiles.reduce((accumulator, current) => {
  //   //   return accumulator + current.announcements.length;
  //   // }, 0)
  //   // console.log (state.tiles);
  //   return {
  //     tiles: props.tiles,
  //   };
  // }
  onSortEnd({oldIndex, newIndex}) {
    this.props.moveSections (arrayMove (this.props.tiles, oldIndex, newIndex));
    // this.setState (
    //   // ({tiles}) => ({
    //   //   tiles: arrayMove (tiles, oldIndex, newIndex),
    //   // }),
    //   () => {
    //     // console.log(this.state.tiles);
    //     this.props.moveSections (this.state.tiles);
    //   }
    // );
  }
  render () {
    return (
      <SortableList
        distance={10}
        items={this.props.tiles}
        onSortEnd={this.onSortEnd}
        updateModal={this.props.updateModal}
        createAnnouncement={this.props.createAnnouncement}
        updateAnnouncement={this.props.updateAnnouncement}
        deleteSection={this.props.deleteSection}
        deleteAnnouncement={this.props.deleteAnnouncement}
        possible_grades={this.props.possible_grades}
      />
    );
  }
}

class CheckBox extends Component {
  constructor (props) {
    super (props);
    this.state = {
      checked: this.props.checked,
    };
    this.handleClick = this.handleClick.bind (this);
  }
  handleClick () {
    // this.props.handleClick ('school_in', !this.state.checked);
    this.props.updateActive (this.props.address, !this.state.checked);
    this.setState ({checked: !this.state.checked});
  }
  componentWillReceiveProps (props) {
    this.setState ({checked: props.checked});
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
                style={{color: 'white', fontSize: '14px'}}
              />
            </div>
          : <div />}
      </div>
    );
  }
}

class EmailRow extends Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <div
        className="email-row"
        style={this.props.last ? {borderBottom: 'none'} : {}}
      >
        <div>
          <FontAwesomeIcon
            icon={faTimes}
            style={{color: 'black', fontSize: '14px', marginRight: '10px'}}
            onClick={() => this.props.deleteEmail (this.props.email.address)}
          />
          <div>
            {this.props.email.address}
          </div>
        </div>
        <CheckBox
          updateActive={this.props.updateActive}
          address={this.props.email.address}
          style={{width: '20px', height: '20px'}}
          checked={this.props.email.active}
        />

      </div>
    );
  }
}

class MailList extends Component {
  constructor (props) {
    super (props);
    this.state = {
      list: [],
      email: '',
    };
    this.addEmail = this.addEmail.bind (this);
    this.onChange = this.onChange.bind (this);
    this.onKeyPress = this.onKeyPress.bind (this);
    this.updateActive = this.updateActive.bind (this);
    this.deleteEmail = this.deleteEmail.bind (this);
  }
  updateActive (address, active) {
    console.log ('called');
    this.setState (
      ({list}) => {
        return {
          list: list.map (email => {
            if (email.address === address) {
              return {
                address: email.address,
                active,
              };
            } else {
              return email;
            }
          }),
        };
      },
      () => {
        fetch (`/api/v1/schools/${this.props.headers.school}`, {
          method: 'PUT',
          headers: {
            ...this.props.headers,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify ({
            mailing_list: this.state.list,
          }),
        })
          .then (data => data.json ())
          .then (data => {
            if (data.status == 'ok') {
              console.log (data.body.mailing_list);
              // this.setState ({list: data.body.mailing_list});
            }
          })
          .catch (e => {
            console.log (e);
          });
      }
    );
  }
  deleteEmail (email) {
    fetch (`/api/v1/schools/${this.props.headers.school}`, {
      method: 'PUT',
      headers: {
        ...this.props.headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({
        mailing_list: this.state.list.filter (mail => mail.address != email),
      }),
    })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          this.setState ({list: data.body.mailing_list});
        }
      })
      .catch (e => {
        console.log (e);
      });
  }
  componentDidMount () {
    fetch (`/api/v1/schools/${this.props.headers.school}`, {
      method: 'GET',
      headers: this.props.headers,
    })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          this.setState ({list: data.body.mailing_list});
        }
      })
      .catch (e => {
        console.log (e);
      });
  }
  addEmail (email) {
    fetch (`/api/v1/schools/${this.props.headers.school}`, {
      method: 'PUT',
      headers: {
        ...this.props.headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({
        mailing_list: [{address: email, active: true}, ...this.state.list],
      }),
    })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          this.setState ({list: data.body.mailing_list});
        }
      })
      .catch (e => {
        console.log (e);
      });
  }
  onChange (event) {
    this.setState ({email: event.target.value});
  }
  onKeyPress (event) {
    if (event.key == 'Enter') {
      this.addEmail (this.state.email);
      this.setState ({email: ''});
      console.log ('Done!');
    }
  }
  render () {
    return (
      <div
        style={{
          width: '70%',
          minWidth: '300px',
          alignSelf: 'center',
          backgroundColor: 'white',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
          marginBottom: '80px',
        }}
      >
        <div
          style={{
            width: '100%',
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #ddd',
          }}
        >
          <input
            placeholder="Add Email"
            onChange={this.onChange}
            onKeyPress={this.onKeyPress}
            value={this.state.email}
            type="email"
            style={{
              width: '100%',
              fontSize: '24px',
              backgroundColor: 'transparent',
              border: 0,
              padding: '15px',
              appearance: 'none',
              '-webkitAppearance': 'none',
            }}
          />
        </div>
        <div>
          {this.state.list.length
            ? this.state.list.map ((email, index) => {
                return (
                  <EmailRow
                    email={email}
                    key={'email_' + index}
                    last={index == this.state.list.length - 1}
                    updateActive={this.updateActive}
                    deleteEmail={this.deleteEmail}
                  />
                );
              })
            : <div style={{width: '100%', padding: '20px'}}>
                No Emails Yet!
              </div>}
        </div>
        <div
          style={{
            width: '100%',
            height: '40px',
            backgroundColor: '#f5f5f5',
            borderTop: '1px solid #ddd',
          }}
        >
          {/* Footer */}
        </div>

      </div>
    );
  }
}

class AnnouncementsPage extends Component {
  constructor (props) {
    super (props);
    this.newSection = React.createRef ();
    this.openNewSection = this.openNewSection.bind (this);
    this.tiles = [];
    this.state = {
      username: cookies.get ('username'),
      'x-api-key': cookies.get ('x-api-key'),
      'x-id-key': cookies.get ('x-id-key'),
      school: cookies.get ('school'),
      announcement: false,
    };
    this.createSection = this.createSection.bind (this);
    this.moveSections = this.moveSections.bind (this);
    this.createAnnouncement = this.createAnnouncement.bind (this);
    this.editAnnouncement = this.editAnnouncement.bind (this);
    this.deleteSection = this.deleteSection.bind (this);
    this.deleteAnnouncement = this.deleteAnnouncement.bind (this);
    this.announce = this.announce.bind (this);
  }
  componentDidMount () {
    fetch ('/api/v1/announcements/new-announcement', {
      method: 'GET',
      headers: {
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
        school: this.state['school'],
      },
    })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          // console.log (data);
          this.setState ({announcement: data.body});
        }
      })
      .catch (e => {
        console.log (e);
      });
  }
  createSection (title) {
    fetch ('/api/v1/announcements/announcement-tile', {
      method: 'POST',
      headers: {
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
        school: this.state['school'],
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({title: title}),
    })
      .then (data => data.json ())
      .then (data => {
        console.log (data);
        if (data.status == 'ok') {
          this.state.announcement &&
            this.state.announcement.tiles.push (data.body);
          this.setState ({announcement: this.state.announcement});
        }
      })
      .catch (e => {
        console.log (e);
      });
  }
  moveSections (tiles) {
    console.log ({tiles});
    this.state.announcement.tiles = tiles;
    this.setState ({announcement: this.state.announcement});
    fetch ('/api/v1/announcements/move-tiles', {
      method: 'POST',
      headers: {
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
        school: this.state['school'],
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({tiles: tiles.map (tile => tile._id)}),
    })
      .then (data => data.json ())
      .then (data => {
        // console.log (data);
        if (data.status == 'ok') {
          this.setState ({announcement: data.body});
        }
      })
      .catch (e => {
        console.log (e);
      });
  }
  createAnnouncement (grades, delta, tile) {
    console.log (delta);
    fetch ('/api/v1/announcements/announcement', {
      method: 'POST',
      headers: {
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
        school: this.state['school'],
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({grades, delta, tile}),
    })
      .then (data => data.json ())
      .then (data => {
        console.log (data);
        if (data.status == 'ok') {
          this.setState ({announcement: data.body});
        }
      })
      .catch (e => {
        console.log (e);
      });
  }
  deleteSection (id) {
    fetch (
      `/api/v1/announcements/announcement-tile/${id}?announcement-day=${this.state.announcement._id}`,
      {
        method: 'DELETE',
        headers: {
          'x-api-key': this.state['x-api-key'],
          'x-id-key': this.state['x-id-key'],
          school: this.state['school'],
          'Content-Type': 'application/json',
        },
      }
    )
      .then (data => data.json ())
      .then (data => {
        console.log (data);
        if (data.status == 'ok') {
          this.setState ({announcement: data.body});
        }
      })
      .catch (e => {
        console.log (e);
      });
  }
  deleteAnnouncement (id) {
    fetch (
      `/api/v1/announcements/announcement/${id}?announcement-day=${this.state.announcement._id}`,
      {
        method: 'DELETE',
        headers: {
          'x-api-key': this.state['x-api-key'],
          'x-id-key': this.state['x-id-key'],
          school: this.state['school'],
          'Content-Type': 'application/json',
        },
      }
    )
      .then (data => data.json ())
      .then (data => {
        console.log (data);
        if (data.status == 'ok') {
          this.setState ({announcement: data.body});
        }
      })
      .catch (e => {
        console.log (e);
      });
  }
  editAnnouncement (tile, id, grades, delta) {
    console.log (tile);
    fetch (`/api/v1/announcements/announcement/${id}`, {
      method: 'PUT',
      headers: {
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
        school: this.state['school'],
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({tile, grades, delta}),
    })
      .then (data => data.json ())
      .then (data => {
        console.log (data);
        if (data.status == 'ok') {
          this.setState ({announcement: data.body});
        }
      })
      .catch (e => {
        console.log (e);
      });
  }
  announce () {
    if (
      confirm (
        'Are you sure you would like to send out the daily announcements?'
      )
    ) {
      fetch ('/api/v1/announcements/announce', {
        method: 'GET',
        headers: {
          'x-api-key': this.state['x-api-key'],
          'x-id-key': this.state['x-id-key'],
          school: this.state['school'],
        },
      })
        .then (data => data.json ())
        .then (data => {
          console.log (data);
          if (data.status == 'ok') {
            this.setState ({announcement: data.body});
          }
        });
    }
  }
  openNewSection () {
    this.newSection.current.extend ();
  }
  render () {
    console.log (this.state.announcement);
    return (
      <div>
        <Header school="PVSS (SD83)" barName="Announcements" />
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div className="announcement-body">
            <div className="announcement-header">
              <div
                onClick={this.openNewSection}
                className="edit-bar-button edit-bar-save edit-bar-save-active"
                style={{width: '150px', marginTop: '5px'}}
              >
                CREATE SECTION
              </div>
            </div>
            <div>
              <NewSection
                ref={this.newSection}
                createSection={this.createSection}
              />
              {this.state.announcement &&
                (this.state.announcement.tiles.length == 0
                  ? <EmptyAnnouncementSection />
                  : <AnnouncementsSection
                      tiles={this.state.announcement.tiles}
                      updateModal={this.props.updateModal}
                      createAnnouncement={this.createAnnouncement}
                      moveSections={this.moveSections}
                      updateAnnouncement={this.editAnnouncement}
                      deleteSection={this.deleteSection}
                      deleteAnnouncement={this.deleteAnnouncement}
                      possible_grades={this.state.announcement.possible_grades}
                    />)}
              {/* // : this.state.announcement.tiles.map ((tile, index) => {
                      return (
                        <AnnouncementSection
                          tile={tile}
                          key={tile._id}
                          updateModal={this.props.updateModal}
                          createAnnouncement={this.createAnnouncement}
                          updateAnnouncement={this.editAnnouncement}
                          deleteSection={this.deleteSection}
                          deleteAnnouncement={this.deleteAnnouncement}
                        />
                      );
                    }))} */}
            </div>
            <div className="announcement-footer" style={{padding: '5px'}}>
              <div
                onClick={this.announce}
                className="edit-bar-button edit-bar-save edit-bar-save-active"
                style={{width: '100px', marginTop: '5px'}}
              >
                ANNOUNCE
              </div>
            </div>
          </div>
          <MailList
            headers={{
              'x-api-key': this.state['x-api-key'],
              'x-id-key': this.state['x-id-key'],
              school: this.state['school'],
            }}
          />
        </div>
      </div>
    );
  }
}
export default AnnouncementsPage;
