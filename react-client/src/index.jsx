import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './Components/App';
import GradApp from './Grad-Components/App';

// ReactDOM.render(<App />, document.getElementById('app'));

// console.log(window.location.pathname.split('/')[1]);

if (window.location.pathname.split('/')[1] == 'admin') {
	ReactDOM.render(<App />, document.getElementById('app'));
} else {
	ReactDOM.render(<GradApp />, document.getElementById('app'));
}
