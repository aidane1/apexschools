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
    componentDidMount() {
        fetch("/api/v1/courses?populate=teacher,category,semester", {
            method: "get",
            headers: {
                "x-api-key": this.state["x-api-key"],
                "x-id-key": this.state["x-id-key"],
            }
        })
        .then(json => json.json())
        .then(data => {
            console.log(data);
            if (data.status === "ok") {
                this.setState({resources: data.body});
            } else {
                this.setState({resources: []});
            }
        })
        .catch(e => {
            console.log(e);
        });
    }
  render() {
    return (
      <div>
        {
            this.state.resources.map(course => {
                return (
                    <div>
                        {course.course}
                    </div>
                )
            })
        }
      </div>
    )
  }
}
export default HomePage;