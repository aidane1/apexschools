import React, {Component} from 'react';

import Cookies from 'universal-cookie';
const cookies = new Cookies ();

import './dataList.css';

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
          borderBottom: this.props.last ? "0" : '1px solid #ddd',
        }}
      >
        {this.props.keys.map ((key, index) => {
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
              {this.props.displayFunctions[key] (this.props.item)}
            </div>
          );
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
            {Object.keys (this.props.keys).map ((key, index) => {
              return (
                <div
                  style={{
                    flex: '1 0',
                    paddingLeft: '5px',
                    fontSize: '14px',
                    color: 'rgba(0,0,30, 0.8)',
                    fontWeight: "500"
                  }}
                >
                  {this.props.keys[key]}
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
                keys={Object.keys (this.props.keys)}
                last={index==this.props.items.length-1}
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
