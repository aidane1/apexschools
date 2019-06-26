import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
// import { browserHistory } from 'react-router';
import HomePage from './HomePage';
import CoursesMainPage from "./CoursesPage/SubApp";
// import SecondPage from "./SecondPage";
import SideBar from './SideBarComponent/SideBar';

import "./app.css";


class App extends Component {
  render() {
    return (
      <Router>
        <div className="container"  style={{backgroundColor: "#f5f7f9"}}>
          <SideBar />
          <div className="content">
            <div className="content-body">
                <div>
                  <Route name="overview" exact path="/admin/" component={HomePage}/>
                  <Route name="courses-main" path="/admin/courses/:collection" component={CoursesMainPage}/>
                </div>
            </div>
          </div>
        </div>
      </Router> 
    )
  }
}
export default App;