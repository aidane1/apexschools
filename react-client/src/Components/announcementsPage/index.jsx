import React, {Component} from 'react';

import Header from '../HeaderComponent/Header';

import moment from 'moment';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faCaretDown,
  faCaretUp,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import {QuillDeltaToHtmlConverter} from 'quill-delta-to-html';

import './index.css';
import 'react-quill/dist/quill.snow.css'; // ES6

import Cookies from 'universal-cookie';
const cookies = new Cookies ();

class NewAnnouncementModal extends Component {
  constructor (props) {
    super (props);
    this.state = {
      text: this.props.text || [],
    };
    this.text = this.props.text;
    this.quill = React.createRef ();
    this.handleChange = this.handleChange.bind (this);
    this.handleClick = this.handleClick.bind (this);
  }
  componentWillReceiveProps (props) {
    this.setState (props);
  }
  handleChange (content, delta, source, editor) {
    this.text = editor.getContents ().ops;
  }
  handleClick () {
    this.props.createAnnouncement (this.text);
    this.props.updateModal ({visible: false}, () => {});
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
          className="edit-bar-button edit-bar-save edit-bar-save-active"
          style={{width: '100px', marginTop: '20px'}}
          onClick={this.handleClick}
        >
          {this.props.buttonText || 'CREATE'}
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
          createAnnouncement={this.props.createAnnouncement}
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
  updateAnnouncement (text) {
    this.props.updateAnnouncement (
      this.props.tileId,
      this.props.announcement._id,
      [10, 11, 12],
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
  createAnnouncement (text) {
    this.props.createAnnouncement ([10, 11, 12], text, this.props.tile._id);
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
            return (
              <Announcement
                updateModal={this.props.updateModal}
                announcement={announcement}
                key={announcement._id}
                updateAnnouncement={this.props.updateAnnouncement}
                tileId={this.props.tile._id}
                deleteAnnouncement={this.props.deleteAnnouncement}
              />
            );
          })}
          <NewAnnouncement
            updateModal={this.props.updateModal}
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
          console.log (data);
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
            this.state.announcement.tiles.unshift (data.body);
          this.setState ({announcement: this.state.announcement});
        }
      })
      .catch (e => {
        console.log (e);
      });
  }
  createAnnouncement (grades, delta, tile) {
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
                  : this.state.announcement.tiles.map ((tile, index) => {
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
                    }))}
              {}
              {/* <AnnouncementSection
                title="Library News"
                updateModal={this.props.updateModal}
              />
              <AnnouncementSection title="Career Center News" />
              <AnnouncementSection title="Misc. News" /> */}
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
        </div>
      </div>
    );
  }
}
export default AnnouncementsPage;
