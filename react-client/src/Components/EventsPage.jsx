import React, {Component} from 'react';

import SubPage from './CoursesPage/SubPageSkeleton';
import Header from './HeaderComponent/Header';

import moment from 'moment';

class EventsPage extends Component {
  constructor (props) {
    super (props);
    this.dataFunctions = {
      Title: {
        display: event => {
          return event.title;
        },
        input: {
          value: event => {
            return event !== undefined ? event.title : '';
          },
          type: 'text',
          label: 'Title',
          name: 'title',
        },
      },
      Date: {
        display: event => {
          return moment (event.event_date).format('ddd, MMMM Do YYYY');
        },
        input: {
          value: event => {
            return event !== undefined ? new Date(event.event_date) : new Date ();
            },
          type: 'date',
          label: 'Date',
          name: 'event_date',
        },
      },
      Time: {
        display: event => {
          return event.time;
        },
        input: {
          value: event => {
            return event !== undefined ? event.time : "";
          },
          type: 'time',
          label: 'Time',
          name: 'time',
        },
      },
    };
  }
  render () {
    return (
      <div>
        <Header school="PVSS (SD83)" barName="Events" />
        <SubPage
          dataFunctions={this.dataFunctions}
          populateFields=""
          collectionPlural={'Events'}
          collectionSingular={'Event'}
        />
      </div>
    );
  }
}
export default EventsPage;
