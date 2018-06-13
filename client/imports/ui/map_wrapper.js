import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react'

import MapContainer from './map_container'


class MapWrapper extends Component {
  render() {
    return (
      <div>
        <MapContainer google={this.props.google} lat = {this.props.lat} lng = {this.props.lng} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBxRWAwnS9h8pP1mF6sAa4ZnkqGYUPBGac',
})(MapWrapper)
