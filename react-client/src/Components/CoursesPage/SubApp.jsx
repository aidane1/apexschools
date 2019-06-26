import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import CategoriesPage from "./CategoriesPage";
import TeachersPage from "./TeachersPage";
import CoursesPage from './CoursesPage';
import CodesPage from "./CodesPage";

import CoursesPageHeader from "./HeaderComponent/Header";


class CoursesMainPage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <CoursesPageHeader school="PVSS (SD83)" barName="Courses" links={[{path: "/admin/courses/categories", name: "Categories"}, {path: "/admin/courses/teachers", name: "Teachers"}, {path: "/admin/courses/courses", name: "Courses"}, {path: "/admin/courses/codes", name: "Codes"}]} currentPage={this.props.match.params.collection} />
                <div>
                    <Route name="courses-categories" path="/admin/courses/categories" component={CategoriesPage} />
                    <Route name="courses-teachers" path="/admin/courses/teachers" component={TeachersPage} />
                    <Route name="courses-courses" path="/admin/courses/courses" component={CoursesPage} />
                    <Route name="courses-codes" path="/admin/courses/codes" component={CodesPage} />
                </div>
            </div>
        )
    }
}
export default CoursesMainPage;