import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';

import MasterSchedule from "./MasterSchedule";
import MasterCalendar from "./MasterCalendar";
import CoursesPageHeader from "../HeaderComponent/Header";


class ScheduleMainPage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <CoursesPageHeader school="PVSS (SD83)" barName="Master Schedule"  links={[{path: "/admin/master-schedule/schedule", name: "Schedule"}, {path: "/admin/master-schedule/calendar", name: "Calendar"}]} currentPage={this.props.match.params.schedule}/>
                <div>
                    <Route name="master-schedule-schedule"  path="/admin/master-schedule/schedule" component={MasterSchedule}/>
                    <Route name="master-schedule-calendar"  path="/admin/master-schedule/calendar" render={(props) => <MasterCalendar {...props} updateModal={this.props.updateModal}></MasterCalendar>}/>
                </div>
            </div>
        )
    }
}
export default ScheduleMainPage;