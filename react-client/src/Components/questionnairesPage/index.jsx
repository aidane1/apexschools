import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

// import MasterSchedule from './MasterSchedule';
import Polls from './polls';
// import MasterCalendar from './MasterCalendar';
import CoursesPageHeader from '../HeaderComponent/Header';

class SurveyMainPage extends Component {
  constructor (props) {
    super (props);
    console.log ('tits');
  }
  render () {
    return (
      <div>
        <CoursesPageHeader
          school="PVSS (SD83)"
          barName="Questionnaires"
          links={[
            {path: '/admin/questionnaires/polls', name: 'Polls'},
            {path: '/admin/questionnaires/surveys', name: 'Surveys'},
          ]}
          currentPage={this.props.match.params.questionnaire}
        />
        <div>
          <Route
            name="master-schedule-schedule"
            path="/admin/questionnaires/polls"
            render={props => (
              <Polls {...props} updateModal={this.props.updateModal} />
            )}
          />
          {/* <Route name="master-schedule-calendar"  path="/admin/questionnaires/surveys" render={(props) => <MasterCalendar {...props} updateModal={this.props.updateModal}></MasterCalendar>}/> */}
        </div>
      </div>
    );
  }
}
export default SurveyMainPage;
