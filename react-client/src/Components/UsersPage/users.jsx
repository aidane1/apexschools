import React, {Component} from 'react';

import Cookies from 'universal-cookie';

import DataList from '../DataList/DataList';

const cookies = new Cookies ();

export default class Users extends Component {
  constructor (props) {
    super (props);
    this.state = {
      username: cookies.get ('username'),
      'x-api-key': cookies.get ('x-api-key'),
      'x-id-key': cookies.get ('x-id-key'),
      school: cookies.get ('school'),
      users: [],
    };
  }
  componentDidMount () {
    fetch ('/api/v1/users', {
      method: 'GET',
      headers: {
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
      },
    })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          this.setState ({users: data.body});
        }
      })
      .catch (e => {
        console.log (e);
      });
  }
  render () {
    return (
      <div
        style={{
          width: '60%',
          minWidth: '400px',
          margin: 'auto',
          marginTop: '80px',
          marginBottom: '80px',
        }}
      >
        <DataList
          width={'100%'}
          items={this.state.users}
          displayFunctions={[
            {
              display: item => {
                return item.first_name;
              },
              key: 'First Name',
              type: 'string',
              click: () => {},
            },
            {
              display: item => {
                return item.last_name;
              },
              key: 'Last Name',
              type: 'string',
              click: () => {},
            },
            {
              fetch: item => {
                return fetch (
                  `/api/v1/courses?_id=${item.courses.join (',')}&populate=course,semester,block`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-api-key': this.state['x-api-key'],
                      'x-id-key': this.state['x-id-key'],
                    },
                  }
                );
              },
              list_display: item => {
                return item.course.course;
              },
              list_sub_display: item => {
                return item.block !== null && item.semester !== null
                  ? `${item.semester.name} Block ${item.block.block}`
                  : '';
              },
              list_key: item => {
                return 'Courses';
              },
              key: 'Courses',
              type: 'async-list',
              click: () => {},
            },
          ]}
        />
      </div>
    );
  }
}
