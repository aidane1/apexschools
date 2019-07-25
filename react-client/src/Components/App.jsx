import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
// import { browserHistory } from 'react-router';
import HomePage from './HomePage';
import CoursesMainPage from './CoursesPage/SubApp';
import ScheduleMainPage from './SchedulePage/SubApp';
import ConfigurePage from './ConfigurePage/ConfigurePage';
import EventsPage from './EventsPage';
import AnnouncementsPage from './announcementsPage/index';
import SideBar from './SideBarComponent/SideBar';

import './app.css';

class Modal extends Component {
  constructor (props) {
    super (props);
    this.state = {
      visible: false,
      content: <div />,
    };
    this.handleClick = this.handleClick.bind (this);
  }
  handleClick () {
    this.setState ({visible: false});
  }
  render () {
    return (
      <div
        className={`modal ${this.state.visible ? 'modal-visible' : 'modal-hidden'}`}
      >
        <div className={'modal-backdrop'} onClick={this.handleClick} />
        <div className={'modal-content'}>
          {this.state.content}
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor (props) {
    super (props);
    this.modal = React.createRef ();
    this.updateModal = this.updateModal.bind (this);
  }
  componentDidMount () {}
  updateModal (state) {
    this.modal.current.setState (state);
  }
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
                  name="announcements"
                  exact
                  path="/admin/announcements"
                  render={props => {
                    return <AnnouncementsPage {...props} updateModal={this.updateModal}></AnnouncementsPage>
                  }}
                />
                <Route
                  name="master-schedule-main"
                  path="/admin/master-schedule/:schedule"
                  render={props => {
                    return (
                      <ScheduleMainPage
                        {...props}
                        updateModal={this.updateModal}
                      />
                    );
                  }}
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
                  render={props => {
                    return <EventsPage modal={this.modal} />;
                  }}
                />
              </div>
            </div>
          </div>
          <Modal ref={this.modal} />
        </div>
      </Router>
    );
  }
}
export default App;
