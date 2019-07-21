import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
// import { browserHistory } from 'react-router';
import HomePage from './HomePage';
import CoursesMainPage from './CoursesPage/SubApp';
import ScheduleMainPage from './SchedulePage/SubApp';
import ConfigurePage from './ConfigurePage/ConfigurePage';
import EventsPage from "./EventsPage";
import SideBar from './SideBarComponent/SideBar';

import './app.css';

class App extends Component {
  render () {
    return (
      <Router>
        <div className="container" style={{backgroundColor: '#f5f7f9'}}>
          <SideBar />
          <div className="content">
            <div className="content-body">
              <div>
                <Route
                  name="overview"
                  exact
                  path="/admin/"
                  component={HomePage}
                />
                <Route
                  name="master-schedule-main"
                  path="/admin/master-schedule/:schedule"
                  component={ScheduleMainPage}
                />
                <Route
                  name="courses-main"
                  path="/admin/courses/:collection"
                  component={CoursesMainPage}
                />
                <Route
                  name="configure"
                  path="/admin/configure"
                  component={ConfigurePage}
                />
                <Route
                  name="events"
                  path="/admin/events"
                  component={EventsPage}
                />
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
export default App;
