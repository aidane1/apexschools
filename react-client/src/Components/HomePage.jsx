import React, { Component } from 'react';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: cookies.get("username"),
            "x-api-key": cookies.get("x-api-key"),
            "x-id-key": cookies.get("x-id-key"),
            resources: [{name: "Yeet"}],
        }
    }
  render() {
    return (
        <div>
        </div>
    )
  }
}
export default HomePage;