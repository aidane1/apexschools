import React, {Component} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faTimes} from '@fortawesome/free-solid-svg-icons';

import './polls.css';

import Cookies from 'universal-cookie';

const cookies = new Cookies ();

class FormattedTimeSection extends Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <div className="poll-formatted-time-group">
        <div>
          {this.props.number}
        </div>
        <div>
          {this.props.suffix}
        </div>
      </div>
    );
  }
}

class FormattedTime extends Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <div className="poll-formatted-time" {...this.props}>
        <FormattedTimeSection number="01" suffix="D" />
        <FormattedTimeSection number="05" suffix="H" />
        <FormattedTimeSection number="12" suffix="M" />
        <FormattedTimeSection number="51" suffix="S" />
      </div>
    );
  }
}

class PollInfo extends Component {
  constructor (props) {
    super (props);
    this.state = {
      visible: false,
      total: 0,
      votes: 0,
      option: '',
      x: 0,
      y: 0,
    };
  }
  render () {
    let {option, total, votes, x, y} = this.state;
    return (
      <div
        className="poll-over-info"
        style={{
          display: this.state.visible ? 'block' : 'none',
          position: 'fixed',
          top: `${y - 80}px`,
          left: `${x}px`,
        }}
      >
        <div style={{color: 'rgba(20,20,40,0.6)', fontWeight: '300'}}>
          {this.state.option}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '10px',
          }}
        >
          <div>
            {total <= 0 ? '0' : Math.floor (votes / total * 100)}
            %
          </div>
          <div>
            {votes}/{total}
          </div>

        </div>

      </div>
    );
  }
}

class PollOption extends Component {
  constructor (props) {
    super (props);
    this.onMouseOver = this.onMouseOver.bind (this);
  }
  onMouseOver (event) {
    this.props.openPollInfo ({
      x: event.clientX,
      y: event.clientY,
      option: this.props.option,
      votes: this.props.votes,
      total: this.props.total,
    });
  }
  render () {
    return (
      <div
        className="poll-option"
        onMouseOver={this.onMouseOver}
        onMouseOut={this.props.closePollInfo}
      >
        <div className="poll-option-title">
          <div>
            {this.props.option}
          </div>
          <div>
            {this.props.total <= 0
              ? '0'
              : Math.floor (this.props.votes / this.props.total * 100)}
            %
          </div>
        </div>
        <div className="poll-option-bar">
          <div
            className="poll-option-filled-bar"
            style={{
              width: `${this.props.total <= 0 ? '0' : Math.floor (this.props.votes / this.props.total * 100)}%`,
            }}
          />
        </div>
      </div>
    );
  }
}

class Survey extends Component {
  constructor (props) {
    super (props);
    this.votes = this.props.options.reduce ((acc, current) => {
      acc[current] = 0;
      return acc;
    }, {});
    this.total = 0;
    this.props.votes.forEach (vote => {
      this.total += 1;
      this.votes[vote.vote] += 1;
    });
  }
  render () {
    return (
      <div style={{margin: '20px'}}>
        <FormattedTime style={{visibility: 'hidden'}} />
        <div className="poll">
          <div className="poll-title">
            <div>
              {this.props.title}
            </div>
            <div>
              ({this.total} votes)
            </div>

          </div>
          <div className="poll-options">
            {this.props.options.map ((option, index) => {
              return (
                <PollOption
                  option={option}
                  votes={this.votes[option]}
                  total={this.total}
                  key={'Poll_' + index}
                  openPollInfo={this.props.openPollInfo}
                  closePollInfo={this.props.closePollInfo}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

class NewPollOption extends Component {
  constructor (props) {
    super (props);
    this.focus = this.focus.bind (this);
    this.onKeyDown = this.onKeyDown.bind (this);
    this.input = React.createRef ();
    this.onBlur = this.onBlur.bind (this);
  }
  focus () {
    if (this.props.option === 'Name Option...') {
      this.props.updateText (this.props.index, '');
    }
  }
  onKeyDown (event) {
    if (event.key == 'Enter') {
      this.input.current.blur ();
      console.log ('Done!');
    }
  }
  onBlur () {
    if (this.props.option == '') {
      this.props.updateText (this.props.index, 'Name Option...');
    }
  }
  render () {
    return (
      <div className="poll-option">
        <div className="poll-option-title">
          <div>
            <input
              ref={this.input}
              onFocus={this.focus}
              onBlur={this.onBlur}
              onChange={event =>
                this.props.updateText (this.props.index, event.target.value)}
              onKeyDown={this.onKeyDown}
              type="text"
              value={this.props.option}
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                border: '0',
                outline: 0,
                backgroundColor: 'transparent',
                fontSize: '13px',
                fontWeight: '600',
                color: 'rgba(20,20,40,0.7)',
              }}
            />
          </div>
          <div onClick={this.props.deleteOption}>
            <FontAwesomeIcon
              icon={faTimes}
              style={{
                color: 'rgba(0,0,0,0.7)',
                marginRight: '5px',
                fontSize: '17px',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>
        <div className="poll-option-bar" />
      </div>
    );
  }
}
class NewPollTitle extends Component {
  constructor (props) {
    super (props);
    this.focus = this.focus.bind (this);
    this.onKeyDown = this.onKeyDown.bind (this);
    this.input = React.createRef ();
    this.onBlur = this.onBlur.bind (this);
  }
  focus () {
    if (this.props.title === 'Add title...') {
      this.props.updateTitle ('');
    }
  }
  onKeyDown (event) {
    if (event.key == 'Enter') {
      this.input.current.blur ();
      console.log ('Done!');
    }
  }
  onBlur () {
    if (this.props.title === '') {
      this.props.updateTitle ('Add title...');
    }
  }
  render () {
    return (
      <div className="poll-modal-title">
        <input
          ref={this.input}
          onFocus={this.focus}
          onBlur={this.onBlur}
          onChange={event => this.props.updateTitle (event.target.value)}
          onKeyDown={this.onKeyDown}
          type="text"
          value={this.props.title}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            border: '0',
            outline: 0,
            backgroundColor: 'transparent',
            fontSize: '20px',
            fontWeight: '300',
            color: 'rgba(20,20,40,0.8)',
          }}
        />
      </div>
    );
  }
}

class NewPollModal extends Component {
  constructor (props) {
    super (props);
    this.state = {
      title: 'Add title...',
      options: ['Name Option...', 'Name Option...'],
    };
    this.addOption = this.addOption.bind (this);
    this.deleteOption = this.deleteOption.bind (this);
    this.updateText = this.updateText.bind (this);
    this.updateTitle = this.updateTitle.bind (this);
    this.createPoll = this.createPoll.bind (this);
  }
  addOption () {
    this.state.options.push ('Name Option...');
    this.setState ({options: this.state.options});
  }
  deleteOption (index) {
    this.setState (({options}) => {
      return {
        options: options.filter (
          (option, optionIndex) => optionIndex !== index
        ),
      };
    });
  }
  updateText (index, text) {
    this.setState (({options}) => {
      return {
        options: options.map (
          (option, optionIndex) => (optionIndex === index ? text : option)
        ),
      };
    });
  }
  updateTitle (text) {
    this.setState ({title: text});
  }
  createPoll () {
    this.props.createPoll (this.state);
  }
  render () {
    let {title, options} = this.state;
    return (
      <div
        // style={{width: '350px', minHeight: '350px', backgroundColor: 'white'}}
        className={'new-poll-modal'}
      >
        <NewPollTitle title={title} updateTitle={this.updateTitle} />

        {options.map ((option, index) => {
          return (
            <NewPollOption
              option={option}
              index={index}
              updateText={this.updateText}
              deleteOption={() => this.deleteOption (index)}
            />
          );
        })}
        <div
          style={{
            fontSize: '15px',
            fontWeight: '600',
            color: 'rgba(40,40,60,0.7)',
            cursor: 'pointer',
          }}
          onClick={this.addOption}
        >
          <FontAwesomeIcon icon={faPlus} />
          {' '}
          Add Option
        </div>
        <div
          className="announcement-footer"
          style={{padding: '5px', marginTop: 'auto'}}
        >
          <div
            className="edit-bar-button edit-bar-save edit-bar-save-active"
            style={{width: '100px', marginTop: '5px'}}
            onClick={this.createPoll}
          >
            CREATE
          </div>
        </div>
      </div>
    );
  }
}

class NewPoll extends Component {
  constructor (props) {
    super (props);
    this.openModal = this.openModal.bind (this);
  }
  openModal () {
    this.props.updateModal ({
      visible: true,
      content: <NewPollModal createPoll={this.props.createPoll} />,
    });
  }
  render () {
    return (
      <div style={{margin: '20px'}}>
        <FormattedTime style={{visibility: 'hidden'}} />
        <div
          className="poll new-poll"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={this.openModal}
        >
          <FontAwesomeIcon
            icon={faPlus}
            style={{fontSize: '80px', color: 'rgba(20,20,40,0.5)'}}
          />
        </div>
      </div>
    );
  }
}

export default class Polls extends Component {
  constructor (props) {
    super (props);
    this.createPoll = this.createPoll.bind (this);
    this.pollInfo = React.createRef ();
    this.state = {
      polls: [],
      username: cookies.get ('username'),
      'x-api-key': cookies.get ('x-api-key'),
      'x-id-key': cookies.get ('x-id-key'),
      school: cookies.get ('school'),
    };
    this.openPollInfo = this.openPollInfo.bind (this);
    this.closePollInfo = this.closePollInfo.bind (this);
  }
  openPollInfo (info) {
    this.pollInfo.current.setState ({...info, visible: true});
  }
  closePollInfo () {
    this.pollInfo.current.setState ({visible: false});
  }
  createPoll (poll) {
    console.log ({poll});
    fetch ('/api/v1/polls', {
      method: 'POST',
      headers: {
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
        'Content-Type': 'application/json',
      },
      body: JSON.stringify (poll),
    })
      .then (data => data.json ())
      .then (data => {
        console.log (data);
      });
  }
  componentDidMount () {
    fetch ('/api/v1/polls', {
      method: 'GET',
      headers: {
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
      },
    })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          this.setState ({polls: data.body});
        }
      });
  }
  render () {
    return (
      <div>
        <div className="open-polls">
          <div className="poll-section-title">
            Open Polls
          </div>
          <div
            style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}
          >
            {this.state.polls.map (poll => {
              return (
                <Survey
                  key={poll._id}
                  {...poll}
                  openPollInfo={this.openPollInfo}
                  closePollInfo={this.closePollInfo}
                />
              );
            })}
            <NewPoll
              updateModal={this.props.updateModal}
              createPoll={this.createPoll}
            />
          </div>

        </div>
        <div className="closed-polls">
          <div className="poll-section-title">
            Closed Polls
          </div>
          {/* <Survey /> */}
        </div>
        <PollInfo ref={this.pollInfo} />
      </div>
    );
  }
}
