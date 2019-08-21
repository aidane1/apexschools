import React, {Component, useCallback} from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faTimes} from '@fortawesome/free-solid-svg-icons';

import {useDropzone} from 'react-dropzone';

import Header from '../HeaderComponent/Header';

import Cookies from 'universal-cookie';

import bson from 'bson';

import url from 'url';

const cookies = new Cookies ();

import './files.css';

function ImageUpload (props) {
  const onDrop = useCallback (files => {
    //get the input and the file
    let file = files[0];
    console.log (file);
    //if the file isn't a image nothing happens.
    //you are free to implement a fallback
    if (!file) {
    } else {
      let formData = new FormData ();
      formData.append ('resource', file);
      formData.append ('path', '/files');
      let id = new bson.ObjectId ();

      let name = file.name.split ('.');
      name = name.slice (0, name.length - 1);
      name = name.join ('.');

      props.parent.setState ({
        resource_id: id.toHexString (),
        resource_name: name,
      });

      let xhr = new XMLHttpRequest ();
      xhr.open ('POST', `/api/v1/resources?type=file&_id=${id.toHexString ()}`);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          let response = JSON.parse (xhr.responseText);
          console.log (response);
          //   props.ImageUpload (response);
        }
      };

      xhr.send (formData);
    }
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone ({onDrop});

  return (
    <div {...getRootProps ()}>
      <input {...getInputProps ()} />
      <div
        style={{
          width: '70%',
          padding: '10px',
          fontSize: '20px',
          backgroundColor: '#f5f5f5',
          margin: 'auto',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        Click Or Drop Files
      </div>
    </div>
  );
}

class NewFileModal extends Component {
  constructor (props) {
    super (props);
    this.state = {
      resource_id: false,
      resource_name: false,
    };
    this.onChange = this.onChange.bind (this);
    this.createFile = this.createFile.bind (this);
  }
  onChange (event) {
    this.setState ({resource_name: event.target.value});
  }
  createFile (event) {
    if (this.resource_id !== false && this.resource_name !== false) {
      this.props.createFile (this.state.resource_id, this.state.resource_name);
      this.setState ({resource_id: false, resource_name: false});
    }
  }
  render () {
    return (
      <div style={{width: '400px', backgroundColor: 'white'}}>
        <div>
          <ImageUpload parent={this} />
          <div className="group-holder">
            <div className="group" style={{width: '100%', maxWidth: '100%'}}>
              <input
                className="material-input"
                type="text"
                value={
                  this.state.resource_name !== false
                    ? this.state.resource_name
                    : ''
                }
                required
                onChange={this.onChange}
                style={{
                  color: 'rgba(30,30,50,0.9)',
                  fontSize: '13px',
                }}
              />
              <span className="highlight" />
              <span className="bar" />
              <label>Name</label>
            </div>
          </div>
        </div>
        <div className="announcement-footer" style={{padding: '5px'}}>
          <div
            className="edit-bar-button edit-bar-save edit-bar-save-active"
            style={{width: '100px', marginTop: '5px'}}
            onClick={this.createFile}
          >
            CREATE
          </div>
        </div>

      </div>
    );
  }
}

class File extends Component {
  constructor (props) {
    super (props);
    this.onDelete = this.onDelete.bind (this);
    this.onClick = this.onClick.bind (this);
  }
  onDelete (event) {
    event.stopPropagation ();
    this.props.deleteFile (this.props._id);
  }
  onClick () {
    window.open (`https://www.apexschools.co${this.props.resource.path}`, '_blank');
  }
  render () {
    return (
      <div className={'file-square'} onClick={this.onClick}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{fontWeight: '600', fontSize: '13px'}}>
            {this.props.name}
          </div>
          <div style={{fontSize: '300', fontSize: '11px', fontStyle: 'italic'}}>
            {this.props.resource.name}
          </div>
        </div>
        <div style={{paddingLeft: '10px'}}>
          {this.props.key_description}
        </div>

        <div className={'file-square-delete'} onClick={this.onDelete}>
          <FontAwesomeIcon
            icon={faTimes}
            style={{fontSize: '22px', color: 'rgba(30,30,30,0.5)'}}
          />
        </div>

      </div>
    );
  }
}

class NewFile extends Component {
  constructor (props) {
    super (props);
    this.updateModal = this.updateModal.bind (this);
    this.createFile = this.createFile.bind (this);
  }
  updateModal () {
    this.props.updateModal ({
      visible: true,
      content: <NewFileModal createFile={this.createFile} />,
    });
  }
  createFile (id, name) {
    this.props.createFile (id, name);
  }
  render () {
    return (
      <div className="file-square new-file-square" onClick={this.updateModal}>
        <div style={{fontSize: '18px', color: 'rgba(30,30,50,0.8)'}}>
          Create New
        </div>
        <FontAwesomeIcon
          icon={faPlus}
          style={{fontSize: '30px', color: 'rgba(30,30,50,0.8)'}}
        />
      </div>
    );
  }
}

class FilesPage extends Component {
  constructor (props) {
    super (props);
    this.state = {
      files: [],
      username: cookies.get ('username'),
      'x-api-key': cookies.get ('x-api-key'),
      'x-id-key': cookies.get ('x-id-key'),
      school: cookies.get ('school'),
    };
    this.createFile = this.createFile.bind (this);
    this.deleteFile = this.deleteFile.bind (this);
  }
  componentDidMount () {
    fetch ('/api/v1/student-files?populate=resource', {
      method: 'GET',
      headers: {
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
      },
    })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          this.setState ({files: data.body});
        }
      });
  }
  createFile (id, name) {
    this.props.updateModal ({visible: false});
    fetch ('/api/v1/student-files', {
      method: 'POST',
      headers: {
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({
        name,
        resource: id,
        viewer_key: `school_${this.state.school}`,
        key_description: 'School',
      }),
    })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          this.setState (({files}) => {
            files.push (data.body);
            return {files};
          });
        }
      });
    console.log ({id, name});
  }
  deleteFile (id) {
    fetch (`/api/v1/student-files/${id}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': this.state['x-api-key'],
        'x-id-key': this.state['x-id-key'],
      },
    })
      .then (data => data.json ())
      .then (data => {
        if (data.status == 'ok') {
          this.setState (({files}) => {
            return {
              files: files.filter (file => file._id != id),
            };
          });
        }
      });
  }
  render () {
    let {files} = this.state;
    console.log (files);
    return (
      <div>
        <Header school="PVSS (SD83)" barName="Files" />
        <div
          style={{
            width: '90%',
            margin: 'auto',
            minWidth: '600px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {this.state.files.map ((file, index) => {
            return (
              <File key={file._id} {...file} deleteFile={this.deleteFile} />
            );
          })}
          <NewFile
            updateModal={this.props.updateModal}
            createFile={this.createFile}
          />
        </div>

      </div>
    );
  }
}
export default FilesPage;
