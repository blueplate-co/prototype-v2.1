import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Mongo } from 'meteor/mongo';

import { saveToKraken } from './../../../../imports/functions/saveToKraken.js';
import { changeImgName } from './../../../../imports/functions/changeImgName.js';

shIcons = new FilesCollection({
  storagePath: () => {
    return process.env.PWD + '/public/shIcons_upload/';
  },
  collectionName: 'shIcons',
  allowClientCode: false,
  onBeforeUpload(file) {

    if (file.size <= 2097152 && /png|jpg|jpeg|svg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 2MB';
    }
  }
});

class IconUpload extends Component {

  constructor (props) {
    super(props);
    this.state = {
      uploadStatus: false,
      uploading: [],
      inProgress: false,
      progress: 0,
      hasIcon: false,
      iconLink: ""
    }
    this.uploadFile = this.uploadFile.bind(this);
  }

  uploadFile(e) {
    e.preventDefault();
    let self = this;

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      var file = e.currentTarget.files[0];
      if (file) {
        let uploadInstance = shIcons.insert({
          file: file,
          meta: {
            uploder_id: Meteor.userId() // Optional, used to check on server for file tampering
          },
          streams: 'dynamic',
          chunkSize: 'dynamic',
          allowWebWorkers: true // If you see issues with uploads, change this to false
        }, false)

        self.setState({
          uploading: uploadInstance, // Keep track of this instance to use below
          inProgress: true,
          hasIcon: false,
          iconLink: ""
        });

        // These are the event functions, don't need most of them, it shows where we are in the process
        uploadInstance.on('start', function () {
          console.log('Starting');
        })

        uploadInstance.on('end', function (error, fileObj) {
          console.log('On end File Object: ', fileObj);
          let newImgName = changeImgName(fileObj.path)
          console.log('new image name: ', newImgName)
          saveToKraken(newImgName, fileObj.path, 'shIcons');

          Meteor.setTimeout(() => {
            self.setState({
              hasIcon: true,
              iconLink: "../shIcons_upload/" + fileObj._id + fileObj.extensionWithDot
            })
          }, 1000)

          Meteor._reload.onMigrate(function() {
            return [false];
          });
        })

        uploadInstance.on('uploaded', function (error, fileObj) {
          console.log('uploaded: ', fileObj);

          // Reset our state for the next file
          self.setState({
            uploading: [],
            progress: 0,
            inProgress: false
          });

          Meteor._reload.onMigrate(function() {
            return [false];
          });
        })

        uploadInstance.on('error', function (error, fileObj) {
          console.log('Error during upload: ' + error)
        });

        uploadInstance.on('progress', function (progress, fileObj) {
          console.log('Upload Percentage: ' + progress)
          // Update our progress bar
          self.setState({
            progress: progress
          });
        });
        uploadInstance.start(); // Must manually start the upload
      }
    }
  }

  render() {
    return (
      <div className = "cat_icon_uploader center-align valign-wrapper grey lighten-3">
          {
            (this.state.hasIcon) ?
              <div>
                <img className = "iconDisplay" src = {this.state.iconLink} />
                <div className="file-field input-field icon_change_btn">
                  <div className = "upload_display valign-wrapper">
                    <i className="material-icons white-text">file_upload</i>
                    <p className = "white-text">change icon / image</p>
                    <input type="file" onChange = {this.uploadFile} />
                  </div>
                </div>
              </div>
            :
            (this.state.inProgress) ?
              <div className = "center">
                <p className = "center-align">{this.state.progress}% uploaded...</p>
              </div>
              :
              <div className="file-field input-field icon_upload_btn">
                <div>
                  <i className="material-icons grey-text darken-1">file_upload</i>
                  <p className = "grey-text darken-1">upload icon / image</p>
                  <input type="file" onChange = {this.uploadFile} />
                </div>
              </div>
          }
      </div>
    )
  }
}

export default withTracker ((props) => {
  const filesHandle = Meteor.subscribe('shIcons.all')
  const docsReadyYet = filesHandle.ready();

  return {
    docsReadyYet
  };
})(IconUpload);
