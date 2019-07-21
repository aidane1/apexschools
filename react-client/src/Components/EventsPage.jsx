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
          return moment (data).format ('YYYY-MM-DD');
        },
        input: {
          value: event => {
            return event !== undefined ? event.title : '';
          },
          type: 'date',
          label: 'Date',
          name: 'event_date',
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
