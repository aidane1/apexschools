import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import "./header.css";

class CoursesPageHeader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="header">
                <div className="top-bar">
                    {this.props.school}
                </div>
                <div className="main-bar">
                    <div className="main-bar-text">
                        {this.props.barName}
                    </div>
                </div>
                {
                    this.props.links ? 
                    <div className="links-bar">
                        <div className="links-bar-links">
                            {
                                this.props.links.map(link => {
                                    return (
                                        <Link to={link.path} className="links-bar-link" className={this.props.currentPage.toLowerCase() === link.name.toLowerCase() ? "links-bar-link links-bar-link-selected" : "links-bar-link"}>
                                            {link.name}
                                        </Link>
                                    )
                                })
                            }    
                            
                        </div>
                    </div>
                    :
                    <div style={{width: "100%", height: "30px"}}>

                    </div>
                }
            </div>
        )
    }
}

export default CoursesPageHeader;