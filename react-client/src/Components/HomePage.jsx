import React, {Component} from 'react';

import Cookies from 'universal-cookie';
import Header from './HeaderComponent/Header';
const cookies = new Cookies ();

import DataList from './DataList/DataList';

import moment from 'moment';

import './homePage.css';

class PushNotification extends Component {
  constructor (props) {
    super (props);
    this.state = {
      time: 2,
      sendMethod: 0,
      notification: '',
      disabled: true,
    };
    this.changeRadio = this.changeRadio.bind (this);
    this.changeNumber = this.changeNumber.bind (this);
    this.changeNotification = this.changeNotification.bind (this);
    this.push = this.push.bind (this);
  }
  changeNotification (event) {
    this.setState ({
      notification: event.target.value,
      disabled: !event.target.value,
    });
  }
  changeRadio (event) {
    if (event.target.value == 'on') {
      if (event.target.id == 'input_2') {
        this.setState ({sendMethod: 1});
      } else {
        this.setState ({sendMethod: 0});
      }
    } else {
      if (event.target.id == 'input_1') {
        this.setState ({sendMethod: 1});
      } else {
        this.setState ({sendMethod: 0});
      }
    }
  }
  changeNumber (event) {
    this.setState ({time: event.target.value});
  }
  push () {
    let current = moment ();
    current.add (this.state.time, 'h');
    this.props.push ({
      data: this.state.notification,
      send_instantly: this.state.sendMethod == 0,
      send_date: current,
    });
    this.setState ({notification: '', sendMethod: 0, disabled: true, time: 2});
  }
  render () {
    return (
      <div className="push-notification">
        <textarea
          name=""
          id=""
          className="notification-body"
          value={this.state.notification}
          onChange={this.changeNotification}
        />
        <div
          onClick={this.state.disabled ? () => {} : this.push}
          className={`edit-bar-button ${this.state.disabled ? 'edit-bar-save edit-bar-save-disabled' : 'edit-bar-save edit-bar-save-active'}`}
          style={{width: '100px', marginTop: '5px'}}
        >
          SEND
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '3px 10px',
            fontSize: '13px',
            color: 'rgba(0,0,0,0.8)',
            fontWeight: '500',
          }}
        >
          <span style={{color: 'rgba(20, 20, 40, 0.7)'}}>
            Send Notification
            {' '}
          </span>
          <span>
            <input
              type="radio"
              name="sendMethod"
              id="input_1"
              checked={this.state.sendMethod === 0}
              onChange={this.changeRadio}
            />
            Imediately
          </span>
          <span>
            <input
              type="radio"
              name="sendMethod"
              id="input_2"
              checked={this.state.sendMethod === 1}
              onChange={this.changeRadio}
            />
            {' '}
            After
            &nbsp;
            {' '}
            <input
              type="number"
              style={{width: '50px'}}
              value={this.state.time}
              onChange={this.changeNumber}
            />
            {' '}
            &nbsp;
            {' '}
            Hours
          </span>
        </div>
      </div>
    );
  }
}

class HomePage extends Component {
  constructor (props) {
    super (props);
    this.state = {
      username: cookies.get ('username'),
      'x-api-key': cookies.get ('x-api-key'),
      'x-id-key': cookies.get ('x-id-key'),
      school: cookies.get ('school'),
      resources: [],
      notifications: [],
    };
    this.push = this.push.bind (this);
    console.log ('tits');
  }
  push (body) {
    fetch ('/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
      },
      body: JSON.stringify (body),
    })
      .then (data => data.json ())
      .then (data => {
        console.log (data);
        if (data.status == 'ok') {
          this.state.notifications.unshift (data.body);
          this.setState ({notifications: this.state.notifications});
        }
      });
  }
  componentDidMount () {
    fetch ('/api/v1/notifications', {
      method: 'GET',
      headers: {
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
      },
    })
      .then (data => data.json ())
      .then (data => {
        console.log (data);
        if (data.status == 'ok') {
          let notifications = data.body.sort ((a, b) => {
            return new Date (a.date).getTime () > new Date (b.date).getTime ()
              ? -1
              : 1;
          });
          this.setState ({notifications});
        }
      });
  }
  render () {
    return (
      <div>
        <Header school="PVSS (SD83)" barName="Dashboard" />
        <div>
          <div className="container-block">
            <div
              className="container-block-child"
              style={{width: '60%', minWidth: '500px'}}
            >
              <div className="container-block-title">
                Push Notification
              </div>
              <PushNotification push={this.push} />
            </div>
          </div>
          <div
            className="container-block"
            style={{marginBottom: '100px', marginTop: '50px'}}
          >
            <div
              className="container-block-child"
              style={{
                width: '60%',
                minWidth: '500px',
              }}
            >
              <div className="container-block-title">
                Past Notifications
              </div>
              <DataList
                width={'100%'}
                items={this.state.notifications}
                displayFunctions={[
                  {
                    display: item => {
                      return item.data;
                    },
                    key: 'Notification',
                    type: 'string',
                    click: () => {},
                  },
                  {
                    display: item => {
                      let date = item.send_instantly
                        ? item.date
                        : item.send_date;
                      return moment (date).format ('llll');
                    },
                    key: 'Date Sent',
                    type: 'string',
                    click: () => {},
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default HomePage;
