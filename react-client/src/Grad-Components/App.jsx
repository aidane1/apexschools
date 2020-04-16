import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Countdown from 'react-countdown';
import { motion } from "framer-motion"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
	faCaretDown,
	faCaretUp,
	faTimes,
	faCheck,
	faUser,
	faShoePrints
} from '@fortawesome/free-solid-svg-icons';

import './app.css'

Object.defineProperty(Array.prototype, 'chunk_inefficient', {
	value: function (chunkSize) {
		var array = this;
		return [].concat.apply([],
			array.map(function (elem, i) {
				return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
			})
		);
	}
});

let hasGetUserMedia = () => {
	return !!(navigator.mediaDevices &&
		navigator.mediaDevices.getUserMedia);
}


class StudentIcon extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			visible: true,
		}
		this.updateActive = this.updateActive.bind(this);
		this.icon = React.createRef();
	}
	updateActive() {
		console.log(this.icon.current.getBoundingClientRect());
		this.setState((state) => {
			return {
				active: !state.active
			}
		});
	}
	componentDidMount() {
		this.props.addStudent(this.icon);
	}
	render() {
		let { active, visible } = this.state;
		return (
			<div ref={this.icon} style={{ display: visible ? 'block' : 'none' }}>
				<FontAwesomeIcon
					icon={faUser}
					color={active ? '#4bc240' : '#ccc'}
					onClick={this.updateActive}
				/>
			</div>
		)
	}
}

class StudentRow extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className={'student-row'}>
				{this.props.students.map(student => {
					return <StudentIcon addStudent={this.props.addStudent}></StudentIcon>
				})}
			</div>
		)
	}
}

const MAX_ROW_WIDTH = 10;

let students = [];

for (let i = 0; i < 94; i++) {
	switch (i % 4) {
		case 0:
			students.push('aidan');
			break;
		case 1:
			students.push('ty');
			break;
		case 2:
			students.push('colton');
			break;
		case 3:
			students.push('elijah');
			break;
		default:
			break;
	}
}

const renderer = ({ days, hours, minutes, seconds, completed }) => {
	if (completed) {
		return (
			<div>

			</div>
		)
	} else {
		// Render a countdown
		return (
			<div class={'countdown-timer'}>
				<span>
					<span>
						{days}
					</span>
					<span>
						Days
					</span>
				</span>
				<span>
					<span>
						{hours}
					</span>
					<span>
						Hours
					</span>
				</span>
				<span>
					<span>
						{minutes}
					</span>
					<span>
						Minutes
					</span>
				</span>
				<span>
					<span>
						{seconds}
					</span>
					<span>
						Seconds
					</span>
				</span>
			</div>
		)
	}
}

class StudentData extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className={'student-data'}>
				Name: {this.props.name}
			</div>
		)
	}
}

class SpecificIcon extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			draggable: false,
			top: 0,
			left: 0,
			initial_top: 0,
			initial_left: 0,
			duration: 0,
			pastPoint: false,
		}
		this.icon = React.createRef();
		this.toggleTransition = this.toggleTransition.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.startGraduation = this.startGraduation.bind(this);
		this.jumpTo = this.jumpTo.bind(this);
		this.smoothTo = this.smoothTo.bind(this);
		this.drag = this.drag.bind(this);
		this.reset = this.reset.bind(this);
		this.graduate = this.graduate.bind(this);
	}

	toggleTransition() {
		// this.icon.current.classList.add("transition-icon");
	}
	handleClick() {

	}
	startGraduation() {
		this.setState({ left: 25, top: 380, duration: 0.5 });
		setTimeout(() => {
			this.setState({ draggable: true });
			setTimeout(() => {
				if (!this.state.pastPoint) {
					this.setState({ pastPoint: true, left: 340 }, () => {
						this.graduate();
					});
				}
			}, 5000);
		}, 500);
	}
	jumpTo(x, y) {
		console.log({ x, y });
		this.setState({ left: x, top: y, duration: 0, initial_left: x, initial_top: y, visible: true });
	}
	smoothTo(x, y, duration) {
		this.setState({ left: x, top: y, duration });
	}
	drag(event, info) {
		if (info.point.x > 290 && !this.state.pastPoint) {
			this.setState({ pastPoint: true });
		}
	}
	graduate() {
		if (this.state.pastPoint) {
			this.props.controller();
		}
	}
	reset() {
		console.log("reset");
		this.setState(state => {
			return { draggable: false, left: state.initial_left, top: state.initial_top };
		});
		setTimeout(() => {
			this.setState({ visible: false, pastPoint: false, duration: 0 });
		}, 1000);
	}
	render() {
		let { top, left, visible, duration, draggable } = this.state;
		return !draggable ? (
			<motion.div
				onClick={this.startGraduation}
				animate={{ x: left, y: top }}
				transition={{ ease: 'easeOut', duration }}
				ref={this.icon}
				style={{
					position: 'absolute',
					// top: `${top}px`,
					// left: `${left}px`,
					display: visible ? 'block' : 'none'
				}} className={'specific-icon'}>
				<FontAwesomeIcon
					icon={faUser}
					color={'#ed9f45'}
				/>
			</motion.div>
		) : (
				<motion.div
					drag
					onDrag={this.drag}
					onDragEnd={this.graduate}
					dragConstraints={{ left: 10, right: window.innerWidth - 100, top: top - 10, bottom: top + 10 }}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					animate={{ x: left, y: top }}
					transition={{ ease: 'easeOut', duration }}
					ref={this.icon}
					style={{
						position: 'absolute',
						// top: `${top}px`,
						// left: `${left}px`,
						display: visible ? 'block' : 'none'
					}} className={'specific-icon'}>
					<FontAwesomeIcon
						icon={faUser}
						color={'#ed9f45'}
					/>
				</motion.div>
			)
	}
}

class PrincipalIcon extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: 'Aidan',
			visible: false,
		}
		this.graduate = this.graduate.bind(this);
		this.reset = this.reset.bind(this);
	}
	graduate(name) {
		this.setState({ name, visible: true }, () => {
			setTimeout(() => {
				this.props.controller();
			}, 3000);
		})
	}
	reset() {
		this.setState({ name: '', visible: false });
	}
	render() {
		let { visible, name } = this.state;
		return (
			<div className={'principal-icon'}>
				<FontAwesomeIcon
					icon={faUser}
					color={'#ac68e3'}
				/>

				<div className="message-box" style={{ display: visible ? 'block' : 'none' }}>
					Congratulations on graduating, {name}. <a href="#">Here</a> is your diploma.
				</div>
				<FontAwesomeIcon
					icon={faShoePrints}
					color={'#ac68e3'}
				/>

			</div>
		)
	}
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentStudentIndex: 0,
		}
		this.students = [];
		this.video = React.createRef();
		this.icon = React.createRef();
		this.principalIcon = React.createRef();
		this.addStudent = this.addStudent.bind(this);
		this.graduationController = this.graduationController.bind(this);
		this.finishGraduationController = this.finishGraduationController.bind(this);
		this.startGraduation = this.startGraduation.bind(this);
		// this.handleClick = this.handleClick.bind(this);
	}
	componentDidMount() {
		// if (hasGetUserMedia()) {
		// 	const constraints = {
		// 		video: true,
		// 		audio: true
		// 	};
		// 	navigator.mediaDevices.getUserMedia(constraints).
		// 		then((stream) => {
		// 			console.log(stream);
		// 			this.video.current.srcObject = stream;

		// 		});
		// } else {
		// 	alert('getUserMedia() is not supported by your browser');
		// }
		setTimeout(() => {
			this.startGraduation();

		}, 1000);
	}

	startGraduation() {
		let rect = this.students[this.students.length - 1 - this.state.currentStudentIndex].current.getBoundingClientRect();
		let offset = document.documentElement.scrollTop;
		this.icon.current.jumpTo(rect.x, rect.y + offset);
		this.setState(state => {
			return { currentStudentIndex: state.currentStudentIndex+1 }
		});
	}

	// handleClick() {

	// }

	addStudent(student) {
		this.students.push(student);
	}

	graduationController() {
		this.principalIcon.current.graduate('Yeet');
	}
	finishGraduationController() {
		this.principalIcon.current.reset();
		this.icon.current.reset();
		setTimeout(() => {
			this.startGraduation();
		}, 1100);
	}


	render() {
		return (
			<div>
				{/* <video autoPlay ref={this.video}>

				</video> */}
				{/* <StudentIcon></StudentIcon> */}
				<div className="main-interface">
					<div className="student-rows">
						{
							students.chunk_inefficient(Math.round(students.length / 5)).reverse().map(row => {
								return <StudentRow students={row} addStudent={this.addStudent}></StudentRow>
							})
						}
						<PrincipalIcon ref={this.principalIcon} controller={this.finishGraduationController}>

						</PrincipalIcon>
					</div>
					<div className="personal-data">
						{
							students.map(student => {
								return (<StudentData name={student}></StudentData>)
							})
						}
					</div>

					<SpecificIcon ref={this.icon} controller={this.graduationController}>

					</SpecificIcon>

				</div>
				{/* <div className="graduation-line">

				</div> */}


				<Countdown date={new Date(2020, 5, 17, 18)} renderer={renderer}></Countdown>
			</div>
		);
	}
}
export default App;

