import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  };

  onMarkerClick = (props, marker, e) => {
    this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
    });
  }

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  render() {
    const style = { // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
      width: '100vw', // 90vw basically means take up 90% of the width screen. px also works.
      height: '85vh', // 75vh similarly will take up roughly 75% of the height of the screen. px also works.
    }

    return (
        <Map
          google = {this.props.google}
          zoom = {11}
          style = {style}
          initialCenter= {{lat: 22.3964, lng: 114.1095}}
          onClick = {this.onMapClicked}
        >
          {this.props.kitchens.map((kitchen, index)=> {
            return (
              (kitchen.kitchen_address_conversion === null) ?
              ""
              :
              <Marker
                key = {index}
                name = {kitchen.kitchen_name}
                kitchen_id = {kitchen._id}
                url = {kitchen.bannerProfileImg.large}
                position = {{lat: kitchen.kitchen_address_conversion.lat, lng: kitchen.kitchen_address_conversion.lng}}
                onClick = {this.onMarkerClick}
              />
            )
          })
        }
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <img className ='map_thumbnail' src = {this.state.selectedPlace.url} />
              <h6>{this.state.selectedPlace.name}</h6>
              <a href={"/kitchen/" + this.state.selectedPlace.kitchen_id}>more info</a>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBxRWAwnS9h8pP1mF6sAa4ZnkqGYUPBGac',
})(MapContainer)