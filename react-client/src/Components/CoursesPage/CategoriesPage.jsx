import React, { Component } from 'react';

import SubPage from "./SubPageSkeleton";

class CategoriesPage extends Component {
    constructor(props) {
        super(props);
        this.dataFunctions  = {
            "Category": {
                "display": category => {
                    return category.category;
                },
                "input": {
                    "value": category => {
                        return category !== undefined ? category.category : "";
                    },
                    "type": "text",
                    "label": "Category",
                    "name": "category",
                }
            },
        }
    }
    render() {
        return <SubPage dataFunctions={this.dataFunctions} populateFields="" collectionPlural={"Categories"} collectionSingular={"Category"}></SubPage>
    }
}
export default CategoriesPage;