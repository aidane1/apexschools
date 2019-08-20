import React, {Component} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faTimes} from '@fortawesome/free-solid-svg-icons';

import Header from '../HeaderComponent/Header';

import Cookies from 'universal-cookie';

import url from 'url';

const cookies = new Cookies ();

import './links.css';

class NewLinkModal extends Component {
  constructor (props) {
    super (props);
    this.state = {
      link: '',
    };
    this.onChange = this.onChange.bind (this);
    this.createLink = this.createLink.bind (this);
  }
  onChange (event) {
    this.setState ({link: event.target.value});
  }
  createLink () {
    this.props.createLink (this.state.link);
    this.setState ({link: ''});
  }
  render () {
    return (
      <div
        style={{
          backgroundColor: 'white',
          minWidth: '500px',
          paddingTop: '30px',
        }}
      >
        <div>
          <div className="group-holder">
            <div className="group" style={{width: '100%', maxWidth: '100%'}}>
              <input
                className="material-input"
                type="text"
                value={this.state.link}
                required
                onChange={this.onChange}
                style={{
                  color: 'rgba(30,30,50,0.9)',
                  fontStyle: 'italic',
                  fontSize: '13px',
                }}
              />
              <span className="highlight" />
              <span className="bar" />
              <label>Link</label>
            </div>
          </div>
        </div>
        <div className="announcement-footer" style={{padding: '5px'}}>
          <div
            className="edit-bar-button edit-bar-save edit-bar-save-active"
            style={{width: '100px', marginTop: '5px'}}
            onClick={this.createLink}
          >
            CREATE
          </div>
        </div>
      </div>
    );
  }
}

class NewLink extends Component {
  constructor (props) {
    super (props);
    this.updateModal = this.updateModal.bind (this);
  }
  updateModal () {
    this.props.updateModal ({
      visible: true,
      content: <NewLinkModal createLink={this.props.createLink} />,
    });
  }
  render () {
    return (
      <div
        className="link-square new-link-square"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={this.updateModal}
      >
        <FontAwesomeIcon
          icon={faPlus}
          style={{fontSize: '70px', color: 'rgba(30,30,50,0.4)'}}
        />
      </div>
    );
  }
}

class Link extends Component {
  constructor (props) {
    super (props);
    this.deleteLink = this.deleteLink.bind (this);
  }
  deleteLink () {
    this.props.deleteLink (this.props._id);
  }
  render () {
    let link = url.parse (this.props.link);
    let linkPath = '';
    let href = ``;
    if (link.host) {
      linkPath = `${link.protocol}//${link.hostname}`;
      href = link.href;
    } else {
      linkPath = `https://${link.href}`;
      href = `https://${link.href}`;
    }
    return (
      <div
        className="link-square"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
        onClick={this.updateModal}
      >
        <div
          style={{position: 'absolute', right: '5px', top: '5px'}}
          onClick={this.deleteLink}
        >
          <FontAwesomeIcon icon={faTimes} className={'link-tile-delete'} />
        </div>
        <img src={`${linkPath}/favicon.ico`} height={'30'} />
        <div
          style={{
            wordBreak: 'break-all',
            padding: '5px 15px',
            fontSize: '12px',
            color: 'rgba(30,30,50,0.8)',
            fontStyle: 'italic',
          }}
        >
          <a href={href}>{this.props.link}</a>
        </div>

      </div>
    );
  }
}

class LinksPage extends Component {
  constructor (props) {
    super (props);
    this.createLink = this.createLink.bind (this);
    this.deleteLink = this.deleteLink.bind (this);
    this.state = {
      links: [],
      username: cookies.get ('username'),
      'x-api-key': cookies.get ('x-api-key'),
      'x-id-key': cookies.get ('x-id-key'),
      school: cookies.get ('school'),
    };
  }
  createLink (link) {
    this.props.updateModal ({visible: false});
    fetch ('/api/v1/links', {
      method: 'POST',
      headers: {
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({link}),
    })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          this.setState (state => {
            state.links.push (data.body);
            return {links: state.links};
          });
        }
      });
  }
  deleteLink (link) {
    console.log (link);
    fetch (`/api/v1/links/${link}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
      },
    })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          this.setState (({links}) => {
            return {
              links: links.filter (stateLink => stateLink._id !== link),
            };
          });
        }
      });
  }
  componentDidMount () {
    fetch ('/api/v1/links', {
      method: 'GET',
      headers: {
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
      },
    })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          this.setState ({links: data.body});
        }
      });
  }
  render () {
    let {links} = this.state;
    return (
      <div>
        <Header school="PVSS (SD83)" barName="Links" />
        <div
          style={{
            width: '90%',
            margin: 'auto',
            minWidth: '600px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {links.map ((link, index) => {
            return (
              <Link key={link._id} {...link} deleteLink={this.deleteLink} />
            );
          })}
          <NewLink
            updateModal={this.props.updateModal}
            createLink={this.createLink}
          />
        </div>
      </div>
    );
  }
}
export default LinksPage;
