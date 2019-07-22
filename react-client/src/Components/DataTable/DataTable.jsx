import React, {Component} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faEllipsisV,
  faLongArrowAltDown,
  faLongArrowAltUp,
  faSearch,
  faThumbsDown,
} from '@fortawesome/free-solid-svg-icons';

import moment from 'moment';

const path = require ('path');

import './datatable.css';
import './select.css';
import './material.css';

class TextInput extends Component {
  constructor (props) {
    super (props);
    this.state = {
      value: '',
    };
    this.onChange = this.onChange.bind (this);
  }
  onChange (event) {
    this.setState ({value: event.target.value});
    this.props.onChange (event);
  }
  render () {
    if (this.props.shouldUpdate) {
      this.state.value = this.props.value;
      this.props.shouldUpdate = false;
    }
    return (
      <div className="group-holder">
        <div className="group">
          <input
            className="material-input"
            type="text"
            value={this.state.value}
            required
            onChange={this.onChange}
          />
          <span className="highlight" />
          <span className="bar" />
          <label>{this.props.placeholder}</label>
        </div>
      </div>
    );
  }
}

class SelectInput extends Component {
  constructor (props) {
    super (props);
    this.state = {
      options: this.props.options,
    };
  }
  render () {
    return (
      <div className="select-holder">
        <div class="select">
          <select class="select-text" required onChange={this.props.onChange}>
            {this.state.options.map (option => {
              return (
                <option
                  value={option.value}
                  selected={this.props.value === option.value}
                >
                  {option.name}
                </option>
              );
            })}
          </select>
          <span class="select-highlight" />
          <span class="select-bar" />
          <label class="select-label">{this.props.placeholder}</label>
        </div>
      </div>
    );
  }
}

class AsyncSelectInput extends Component {
  constructor (props) {
    super (props);
    this.state = {
      options: [],
    };
  }
  componentDidMount () {
    fetch (path.join ('/api/v1/', this.props.path), {
      method: 'get',
      headers: this.props.headers,
    })
      .then (json => json.json ())
      .then (data => {
        if (data.status == 'ok') {
          data.body.sort ((a, b) => {
            return this.props.sort (a).localeCompare (this.props.sort (b));
          });
          this.setState ({options: data.body});
        } else {
          //TODO: impliment Error dropdown
        }
      });
  }
  render () {
    if (!this.props.value && this.state.options[0]) {
      this.props.onChange ({
        target: {value: this.props.valueFunc (this.state.options[0])},
      });
    }
    return (
      <div className="select-holder">
        <div class="select">
          <select class="select-text" required onChange={this.props.onChange}>
            {this.state.options.map (option => {
              return (
                <option
                  value={this.props.valueFunc (option)}
                  selected={this.props.value === this.props.valueFunc (option)}
                >
                  {this.props.format (option)}
                </option>
              );
            })}
          </select>
          <span class="select-highlight" />
          <span class="select-bar" />
          <label class="select-label">{this.props.placeholder}</label>
        </div>
      </div>
    );
  }
}

class SelectInputText extends Component {}

class DateInput extends React.Component {
  constructor (props) {
    super (props);
    this.onChange = this.onChange.bind (this);
    this.state = {
      value: '2002-01-10',
    };
    this.onChange = this.onChange.bind (this);
  }
  onChange (event) {
    let value = event.target.value;
    this.setState ({value});
    var b = value.split (/\D/);
    value = new Date (b[0], --b[1], b[2]);
    if (value != 'Invalid Date') {
      this.props.onChange (value);
    }
  }
  render () {
    if (this.props.shouldUpdate) {
      this.state.value = moment (this.props.value).format ('YYYY-MM-DD');
      this.props.shouldUpdate = false;
    }
    return (
      <div className="group-holder">
        <div className="group">
          <input
            type="date"
            className="date-input"
            value={this.state.value}
            required
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

class TimeInput extends React.Component {
  constructor (props) {
    super (props);
    this.onChange = this.onChange.bind (this);
    this.state = {
      value: '',
    };
  }
  onChange (event) {
    let value = event.target.value;
    this.setState({value});
    let amOrPm = parseInt (value.split (':')[0]) >= 12 ? 'PM' : 'AM';
    let hours = (parseInt (value.split (':')[0]) - 1) % 12 + 1;
    let minutes = value.split (':')[1];
    this.props.onChange (`${hours}:${minutes} ${amOrPm}`);
  }
  render () {
    if (this.props.shouldUpdate) {
      let value = this.props.value;
      if (value) {
        let hours =
          parseInt (value.split (':')[0]) +
          (value.split (' ')[1] == 'PM' ? 12 : 0);
        if (hours < 10) {
          hours = `0${hours}`;
        } else {
          hours = `${hours}`;
        }
        value = `${hours}:${value.split (':')[1].split (' ')[0]}`;
      }
      this.state.value = value;
      this.props.shouldUpdate = false;
    }
    return (
      <div className="group-holder">
        <div className="group">
          <input
            type="time"
            className="date-input"
            value={this.state.value}
            required
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

class SaveButton extends Component {
  constructor (props) {
    super (props);
    this.state = {
      values: {},
    };
  }
  render () {
    return (
      <div
        className={
          'edit-bar-button edit-bar-save ' +
            (Object.keys (this.state.values).reduce (
              (acc, val) => this.state.values[val] && acc,
              true
            )
              ? Object.keys (this.state.values).length > 0
                  ? 'edit-bar-save-active'
                  : ''
              : '')
        }
        onClick={() => this.props.saveFunc (this.state)}
      >
        SAVE
      </div>
    );
  }
}

class DataTableEditBar extends Component {
  constructor (props) {
    super (props);
    //types: text, popup-textarea, dropdown, date, time, checkbox
    //inputs: [{type: "text", name: "category", label: "Category"}, {type: "text", name: "code", label: "code"}]
    this.state = {
      values: Object.keys (
        this.props.inputs
      ).reduce ((accumulator, current) => {
        accumulator[
          this.props.inputs[current]['input'].name
        ] = this.props.inputs[current]['input']['value'] ();
        return accumulator;
      }, {}),
      _id: '',
    };

    this.saveButton = React.createRef ();

    this.handleInputChange = this.handleInputChange.bind (this);
  }
  handleInputChange (event, name) {
    let values = {...this.state.values};
    values[name] = event.target.value;
    this.state.values = values;
    this.saveButton.current.setState ({values: this.state.values});
  }
  render () {
    return (
      <div className="edit-bar">
        <div className="edit-bar-inputs">
          {Object.keys (this.props.inputs).map (input => {
            switch (this.props.inputs[input]['input']['type']) {
              case 'text':
                return (
                  <TextInput
                    shouldUpdate={true}
                    value={
                      this.state.values[
                        this.props.inputs[input]['input']['name']
                      ]
                    }
                    placeholder={this.props.inputs[input]['input']['label']}
                    onChange={event =>
                      this.handleInputChange (
                        event,
                        this.props.inputs[input]['input'].name
                      )}
                  />
                );
              case 'popup-textarea':
                return <TextInput />;
              case 'dropdown':
                return (
                  <SelectInput
                    options={this.props.inputs[input]['input']['options']}
                    value={
                      this.state.values[
                        this.props.inputs[input]['input']['name']
                      ]
                    }
                    placeholder={this.props.inputs[input]['input']['label']}
                    onChange={event =>
                      this.handleInputChange (
                        event,
                        this.props.inputs[input]['input'].name
                      )}
                  />
                );
              case 'date':
                return (
                  <DateInput
                    shouldUpdate={true}
                    value={
                      this.state.values[
                        this.props.inputs[input]['input']['name']
                      ]
                    }
                    placeholder={this.props.inputs[input]['input']['label']}
                    onChange={value =>
                      this.handleInputChange (
                        {target: {value}},
                        this.props.inputs[input]['input'].name
                      )}
                  />
                );
              case 'time':
                return (
                  <TimeInput
                    value={
                      this.state.values[
                        this.props.inputs[input]['input']['name']
                      ]
                    }
                    shouldUpdate={true}
                    placeholder={this.props.inputs[input]['input']['label']}
                    onChange={value =>
                      this.handleInputChange (
                        {target: {value}},
                        this.props.inputs[input]['input'].name
                      )}
                  />
                );
              case 'checkbox':
                return <TextInput />;
              case 'dropdown-async':
                return (
                  <AsyncSelectInput
                    placeholder={this.props.inputs[input]['input']['label']}
                    sort={this.props.inputs[input]['input']['format']}
                    value={
                      this.state.values[
                        this.props.inputs[input]['input']['name']
                      ]
                    }
                    onChange={event =>
                      this.handleInputChange (
                        event,
                        this.props.inputs[input]['input'].name
                      )}
                    path={this.props.inputs[input]['input']['options-url']}
                    headers={this.props.apiKeys}
                    format={this.props.inputs[input]['input']['format']}
                    valueFunc={this.props.inputs[input]['input']['valueFunc']}
                  />
                );
            }
          })}
        </div>
        <div className="edit-bar-buttons">
          <div className="control-buttons">
            <div
              className="edit-bar-button edit-bar-cancel"
              onClick={this.props.cancelFunc}
            >
              CANCEL
            </div>
            <SaveButton ref={this.saveButton} saveFunc={this.props.saveFunc} />
          </div>
        </div>
      </div>
    );
  }
}

class NewItemButton extends Component {
  constructor (props) {
    super (props);
    this.state = {
      active: true,
    };
  }
  render () {
    return (
      <div className="new-item-button" onClick={this.props.onClick}>
        {'NEW ' + this.props.item.toUpperCase ()}
      </div>
    );
  }
}

class DataTable extends Component {
  constructor (props) {
    super (props);
    this.state = {
      sort_key: Object.keys (this.props.formattingFunctions)[0],
      //-1: a-z, 1: z-a
      sort_direction: -1,
      data: [],
    };
    this.searchBar = React.createRef ();
    this.tableBody = React.createRef ();
    this.editBar = React.createRef ();
    this.allowClickEvents = true;

    this.handleClick = this.handleClick.bind (this);
    this.handleFocus = this.handleFocus.bind (this);
    this.handleBlur = this.handleBlur.bind (this);
    this.handleInput = this.handleInput.bind (this);
    this.handleDotsClick = this.handleDotsClick.bind (this);
    this.handleEdit = this.handleEdit.bind (this);
    this.handleCancel = this.handleCancel.bind (this);
    this.handleSave = this.handleSave.bind (this);
    this.handleNew = this.handleNew.bind (this);

    this.handleUpdate = this.handleUpdate.bind (this);
    this.handleCreate = this.handleCreate.bind (this);

    this.selectOptions = [
      {
        value: '1',
        label: 'label-1',
      },
      {
        value: '2',
        label: 'label-2',
      },
      {
        value: '2',
        label: 'label-3',
      },
    ];
  }
  handleClick (key) {
    if (this.allowClickEvents) {
      let newSortDirection = this.state.sort_key == key
        ? this.state.sort_direction * -1
        : -1;
      this.state.data.sort ((a, b) => {
        return (
          this.props.formattingFunctions[key]
            ['display'] (a)
            .localeCompare (
              this.props.formattingFunctions[key]['display'] (b)
            ) * this.state.sort_direction
        );
      });
      this.setState ({
        sort_key: key,
        sort_direction: newSortDirection,
        data: this.state.data,
      });
    }
  }
  handleFocus () {
    if (this.allowClickEvents) {
      this.searchBar.current.className = 'search-bar search-bar-selected';
    }
  }
  handleBlur () {
    if (this.allowClickEvents) {
      this.searchBar.current.className = 'search-bar';
    }
  }
  handleInput (event) {
    if (this.allowClickEvents) {
      for (var i = 0; i < this.state.data.length; i++) {
        this.state.data[i].displayed =
          this.props.formattingFunctions[this.state.sort_key]
            ['display'] (this.state.data[i])
            .toLowerCase ()
            .indexOf (event.target.value.toLowerCase ()) >= 0;
      }
      this.setState (state => ({
        data: state.data,
      }));
    }
  }
  handleDotsClick (event) {
    if (this.allowClickEvents) {
      let node = event.target;
      while (node.nodeName.toLowerCase () != 'div') {
        node = node.parentNode;
      }
      node.classList.toggle ('open-icon-active');
    }
  }
  handleEdit (item) {
    let values = {};
    Object.keys (this.props.formattingFunctions).map (key => {
      values[
        this.props.formattingFunctions[key]['input']['name']
      ] = this.props.formattingFunctions[key]['input']['value'] (item);
    });
    this.editBar.current.setState ({values, _id: item._id});
    this.tableBody.current.classList.add ('data-table-open');
    this.allowClickEvents = false;
    this.searchBar.current.children[1].disabled = true;
  }
  handleNew () {
    let values = {};
    Object.keys (this.props.formattingFunctions).map (key => {
      values[
        this.props.formattingFunctions[key]['input']['name']
      ] = this.props.formattingFunctions[key]['input']['value'] ();
    });
    this.editBar.current.setState ({values, _id: ''});
    this.tableBody.current.classList.add ('data-table-open');
  }
  handleCancel () {
    this.tableBody.current.classList.remove ('data-table-open');
    this.searchBar.current.children[1].disabled = false;
    this.allowClickEvents = true;
  }
  handleSave (state) {
    if (state._id) {
      this.handleUpdate (state);
    } else {
      this.handleCreate (state);
    }
  }
  handleUpdate (state) {
    this.props
      .update (state)
      .then (data => {
        if (data.status == 'ok') {
          this.setState (state => ({
            data: state.data.map (item => {
              return item._id === data.body._id
                ? {...item, ...data.body}
                : item;
            }),
          }));
        } else {
          //TODO: Add error popdown
        }

        this.handleCancel ();
      })
      .catch (e => {
        console.log (e);
        //TODO: Add error popdown
        this.handleCancel ();
      });
  }
  handleCreate (state) {
    this.props
      .create (state)
      .then (data => {
        if (data.status == 'ok') {
          this.setState (state => ({
            data: (() => {
              state.data.push (data.body);
              return state.data;
            }) (),
          }));
        } else {
          //TODO: Add error popdown
        }
        this.handleCancel ();
      })
      .catch (e => {
        console.log (e);
        this.handleCancel ();
      });
  }
  handleDelete (course) {
    if (confirm ('Are you sure you would like to delete this item?')) {
      this.props.delete (course._id).then (data => {
        if (data.status == 'ok') {
          this.setState (state => ({
            data: state.data.filter (item => {
              return item._id !== data.body._id;
            }),
          }));
        } else {
          //TODO: Add error popdown
        }
      });
    }
  }
  render () {
    return (
      <div
        className={this.props.mini ? 'data-table-mini' : 'data-table'}
        ref={this.tableBody}
      >
        <div className="search-bar" ref={this.searchBar}>
          <div className="search-bar-icon">
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <input
            className="search-bar-input"
            placeholder={`Search for ${this.props.collectionPlural}`}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onInput={this.handleInput}
          />
          <NewItemButton
            onClick={this.handleNew}
            item={this.props.collectionSingular}
          />
        </div>
        <table className="keys-bar">
          {
            <tr>
              {Object.keys (this.props.formattingFunctions).map (key => {
                return (
                  <td onClick={() => this.handleClick (key)}>
                    {key}
                    <FontAwesomeIcon
                      icon={faLongArrowAltUp}
                      className={
                        this.state.sort_key === key &&
                          this.state.sort_direction === 1
                          ? ' selected-arrow'
                          : 'unselected-arrow'
                      }
                    />
                    <FontAwesomeIcon
                      icon={faLongArrowAltDown}
                      className={
                        this.state.sort_key === key &&
                          this.state.sort_direction === -1
                          ? ' selected-arrow'
                          : 'unselected-arrow'
                      }
                    />
                  </td>
                );
              })}
            </tr>
          }
        </table>
        <DataTableEditBar
          apiKeys={this.props.apiKeys}
          ref={this.editBar}
          cancelFunc={this.handleCancel}
          saveFunc={this.handleSave}
          inputs={this.props.formattingFunctions}
        />
        <table className="data-body">
          {this.state.data.map ((course, index) => {
            return course.displayed !== false
              ? <tr data-id={index} key={course._id}>
                  {Object.keys (
                    this.props.formattingFunctions
                  ).map ((key, index, array) => {
                    if (index == array.length - 1) {
                      return (
                        <td>
                          {this.props.formattingFunctions[key]['display'] (
                            course
                          )}
                          <div
                            className="open-icon"
                            onClick={this.handleDotsClick}
                          >
                            <FontAwesomeIcon icon={faEllipsisV} />
                            <div className="edit-delete-box">
                              <div
                                className="edit-box"
                                onClick={() => this.handleEdit (course)}
                              >
                                Edit
                              </div>
                              <div
                                className="delete-box"
                                onClick={() => this.handleDelete (course)}
                              >
                                Delete{' '}
                              </div>
                            </div>
                          </div>
                        </td>
                      );
                    } else {
                      return (
                        <td>
                          {this.props.formattingFunctions[key]['display'] (
                            course
                          )}
                        </td>
                      );
                    }
                  })}
                </tr>
              : '';
          })}
          {this.state.data.length == 0
            ? <tr>
                <td>Loading Data...</td>
              </tr>
            : ''}
        </table>
      </div>
    );
  }
}

export default DataTable;
