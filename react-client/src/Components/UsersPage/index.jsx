import React, {Component} from 'react';

import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import Users from './users';

import Teachers from './teachers.jsx';

import Header from '../HeaderComponent/Header';

class AccountsPage extends Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <div>
        <Header
          school="PVSS (SD83)"
          barName="Accounts"
          links={[
            {path: '/admin/accounts/users', name: 'Users'},
            {path: '/admin/accounts/teachers', name: 'Teachers'},
            {path: '/admin/accounts/admins', name: 'Admins'},
          ]}
          currentPage={this.props.match.params.account}
        />
        <div>
          <Route
            name="accounts-users"
            path="/admin/accounts/users"
            component={Users}
          />
          <Route
            name="accounts-teachers"
            path="/admin/accounts/teachers"
            component={Teachers}
            // render={props => (
            //   <MasterCalendar {...props} updateModal={this.props.updateModal} />
            // )}
          />
          <Route
            name="accounts-admins"
            path="/admin/accounts/admins"
            // component={MasterSchedule}
          />
        </div>
      </div>
    );
  }
}
export default AccountsPage;
