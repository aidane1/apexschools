import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import logo from './logo_transparent.png';
import './sidebar.css';
import 'simplebar';
import 'simplebar/dist/simplebar.css';

class ExtendingItem extends Component {
  constructor (props) {
    super (props);
    this.handleClick = this.handleClick.bind (this);
    this.state = {
      extended: false,
    };
  }

  handleClick () {
    this.setState (state => ({
      extended: !state.extended,
    }));
  }

  render () {
    return (
      <div
        className={
          this.state.extended ? 'sidebar-item-extended' : 'sidebar-item'
        }
        onClick={this.handleClick}
      >
        <div className="sidebar-item-title">
          {this.props.name}
        </div>
        <div className="sidebar-item-subtitle">
          {this.props.description}
        </div>
        <div className="sidebar-item-list">
          {this.props.links.map (link => {
            return (
              <Link to={link.path}>
                <div className="sidebar-item-list-item">{link.name}</div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}

class SideBar extends Component {
  constructor (props) {
    super (props);
    this.state = {
      extended: false,
    };
  }

  render () {
    return (
      <div className="sidebar-left" data-simplebar>
        <Link to="/admin/">
          <div className="sidebar-image-container">
            <img src={logo} alt="logo" className="sidebar-image" />
          </div>
        </Link>
        <Link to="/admin/">
          <div className="sidebar-item">
            <div className="sidebar-item-title">
              School Overview
            </div>
            <div className="sidebar-item-subtitle" />
          </div>
        </Link>
        <Link to="/admin/announcements">
          <div className="sidebar-item">
            <div className="sidebar-item-title">
              Announcements
            </div>
            <div className="sidebar-item-subtitle">
              Create and view announcements
            </div>
          </div>
        </Link>
        <ExtendingItem
          name="Master Schedule"
          description="Edit and view the master schedule"
          links={[
            {path: '/admin/master-schedule/schedule', name: 'Schedule'},
            {path: '/admin/master-schedule/calendar', name: 'Calendar'},
          ]}
        />
        <ExtendingItem
          name="Courses"
          description="Add, edit, and remove courses"
          links={[
            {path: '/admin/courses/categories', name: 'Categories'},
            {path: '/admin/courses/teachers', name: 'Teachers'},
            {path: '/admin/courses/courses', name: 'Courses'},
            {path: '/admin/courses/codes', name: 'Codes'},
          ]}
        />
        <Link to="/admin/events">
          <div className="sidebar-item">
            <div className="sidebar-item-title">
              Events
            </div>
            <div className="sidebar-item-subtitle">
              Add, edit, and remove events
            </div>
          </div>
        </Link>
        <Link to="/admin/links">
          <div className="sidebar-item">
            <div className="sidebar-item-title">
              Links
            </div>
            <div className="sidebar-item-subtitle">
              Create Links for Students
            </div>
          </div>
        </Link>
        <Link to="/admin/files">
          <div className="sidebar-item">
            <div className="sidebar-item-title">
              Files
            </div>
            <div className="sidebar-item-subtitle">
              Student Viewable Files
            </div>
          </div>
        </Link>
        <ExtendingItem
          name="Questionnaires"
          description="Create and view questionnaires"
          links={[
            {path: '/admin/questionnaires/polls', name: 'Polls'},
            {path: '/admin/questionnaires/surveys', name: 'Surveys'},
          ]}
        />
        <Link to="/admin/configure">
          <div className="sidebar-item">
            <div className="sidebar-item-title">
              Configure
            </div>
            <div className="sidebar-item-subtitle">
              Change information displays
            </div>
          </div>
        </Link>
        <ExtendingItem
          name="Accounts"
          description="View users and permissions"
          links={[
            {path: '/admin/accounts/users', name: 'Users'},
            {path: '/admin/accounts/teachers', name: 'Teachers'},
            {path: '/admin/accounts/admin', name: 'Admin'},
          ]}
        />
      </div>
    );
  }
}
export default SideBar;
