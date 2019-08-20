import React, {Component} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';

import Cookies from 'universal-cookie';
const cookies = new Cookies ();

import './dataList.css';

class AsyncListPopup extends Component {
  constructor (props) {
    super (props);
    this.state = {
      visible: false,
      x: 200,
      y: 200,
      items: [],
    };
  }
  render () {
    let {x, y, items} = this.state;
    return (
      <div
        style={{
          padding: '25px 0px 20px 0px',
          backgroundColor: '#fafafa',
          display: this.state.visible ? 'block' : 'none',
          position: 'fixed',
          top: `${y + 5}px`,
          left: `${x + 5}px`,
          boxShadow: `2px 5px 7px rgba(0,0,0,0.3), 1px 2px 2px rgba(0,0,0,0.1)`,
          zIndex: 3,
        }}
      >
        <FontAwesomeIcon
          icon={faTimes}
          style={{
            color: 'rgba(30,30,50,0.8)',
            fontSize: '18px',
            position: 'absolute',
            left: '5px',
            top: '5px',
            cursor: 'pointer',
          }}
          onClick={() => this.setState ({visible: false})}
        />
        <div style={{maxHeight: '250px', overflow: 'auto'}}>
          {items.length
            ? items.map ((item, index) => {
                return (
                  <div key={'item_' + index} className={'list-popup-item'}>
                    {this.props.info.list_display (item)}
                    <div
                      style={{fontSize: '8px', color: 'rgba(30,30,50,0.5)'}}
                    >
                      {this.props.info.list_sub_display (item)}
                    </div>
                  </div>
                );
              })
            : 'Loading...'}
        </div>

      </div>
    );
  }
}

//show the current class highlighted

class AsyncListItem extends Component {
  constructor (props) {
    super (props);
    this.popup = React.createRef ();
    this.onClick = this.onClick.bind (this);
  }
  onClick (event) {
    this.props.info
      .fetch (this.props.item)
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          this.popup.current.setState ({items: data.body});
        }
        console.log (data);
      });
    this.popup.current.setState ({
      x: event.clientX,
      y: event.clientY,
      visible: true,
    });
  }
  render () {
    return (
      <div style={{flex: '1 0'}}>
        <div
          onClick={this.onClick}
          style={{
            width: '100%',
            paddingLeft: '5px',
            fontSize: '13px',
            color: 'rgba(69,124,214,0.8)',
            textDecoration: 'underline',
            fontWeight: this.props.index == 0 ? '500' : '400',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          {this.props.info.list_key (this.props.item)}

        </div>
        <AsyncListPopup ref={this.popup} info={this.props.info} />
      </div>
    );
  }
}

class DataRow extends React.Component {
  constructor (props) {
    super (props);
  }
  render () {
    return (
      <div
        style={{
          width: '100%',
          paddingTop: '10px',
          paddingBottom: '10px',
          flexDirection: 'row',
          display: 'flex',
          borderBottom: this.props.last ? '0' : '1px solid #ddd',
        }}
      >
        {this.props.displayFunctions.map ((info, index) => {
          switch (info.type) {
            case 'string':
              return (
                <div
                  style={{
                    flex: '1 0',
                    paddingLeft: '5px',
                    fontSize: '13px',
                    color: 'rgba(20,20,40,0.8)',
                    fontWeight: index == 0 ? '500' : '400',
                  }}
                >
                  {info.display (this.props.item)}
                </div>
              );
              break;
            case 'async-list':
              return (
                <AsyncListItem
                  info={info}
                  index={index}
                  item={this.props.item}
                />
              );
              break;
          }
        })}
      </div>
    );
  }
}

class DataList extends Component {
  constructor (props) {
    super (props);
    this.state = {
      username: cookies.get ('username'),
      'x-api-key': cookies.get ('x-api-key'),
      'x-id-key': cookies.get ('x-id-key'),
      school: cookies.get ('school'),
      resources: [{name: 'Yeet'}],
      notifications: [],
    };
  }

  componentDidMount () {}
  render () {
    return (
      <div style={{width: this.props.width}} className={'data-list'}>
        <div className="data-list-header">
          <div />
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              paddingBottom: '5px',
            }}
          >
            {this.props.displayFunctions.map ((info, index) => {
              return (
                <div
                  style={{
                    flex: '1 0',
                    paddingLeft: '5px',
                    fontSize: '14px',
                    color: 'rgba(0,0,30, 0.8)',
                    fontWeight: '500',
                  }}
                >
                  {info.key}
                </div>
              );
            })}
          </div>

        </div>
        <div className="data-list-body">
          {this.props.items.map ((item, index) => {
            return (
              <DataRow
                item={item}
                displayFunctions={this.props.displayFunctions}
                last={index == this.props.items.length - 1}
              />
            );
          })}
        </div>
        <div className="data-list-footer" />
      </div>
    );
  }
}
export default DataList;
