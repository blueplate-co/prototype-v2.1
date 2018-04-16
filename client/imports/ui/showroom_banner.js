import React, { Component } from 'react';

export default class ShowroomBanner extends Component {
  render() {
    return(
      <div className="col l12 m12 s12 showroom_banner">
        <h2 className = "white-text">Are you ready?</h2>
        <h5 className = "white-text">beta launch in May 2018</h5>
        <img src = "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/logo.svg" className = "right banner_logo" />
      </div>
    )
  }
}
