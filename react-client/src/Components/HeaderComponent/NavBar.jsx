import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class NavBar extends Component {
  render() {
    return (
      <header>
        <ul id="headerButtons">
          <li className="navButton"><Link to="/admin">Home</Link></li>
          <li className="navButton"><Link to="/admin/second">Second</Link></li>
        </ul>
      </header>
    )
  }
}
export default NavBar;