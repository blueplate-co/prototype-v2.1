import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component {
  render() {
    const style = { // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
      width: '91vw', // 90vw basically means take up 90% of the width screen. px also works.
      height: '85vh', // 75vh similarly will take up roughly 75% of the height of the screen. px also works.
      borderRadius: '10px'
    }

    return (
        <Map
          google = {this.props.google}
          zoom = {11}
          style = {style}
          initialCenter= {{lat: 22.3964, lng: 114.1095}}
        >
          {this.props.kitchens.map((kitchen, index)=> {
            return (
              <Marker
                name={kitchen.kitchen_name}
                position={{lat: kitchen.kitchen_address_conversion.lat, lng: kitchen.kitchen_address_conversion.lng}}
              />
            )
          })
        }
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBxRWAwnS9h8pP1mF6sAa4ZnkqGYUPBGac',
})(MapContainer)
