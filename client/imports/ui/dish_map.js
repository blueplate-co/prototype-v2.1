import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class DishMap extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    kitchen_detail: {}
  };

  componentDidMount() {
    Meteor.call('kitchen.get_detail_chitken', this.props.user_id, (err, res) => {
      if (!err) {
        this.setState({ kitchen_detail: res});
      }
    })
  }

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
      width: '100%', // 90vw basically means take up 90% of the width screen. px also works.
      height: '100%', // 75vh similarly will take up roughly 75% of the height of the screen. px also works.
      borderRadius: '8px'
    }

    return (
      <span>
        { Object.keys(this.state.kitchen_detail).length > 0 ? 
            <Map
              google = {this.props.google}
              zoom = {17}
              style = {style}
              initialCenter= {{lat: this.state.kitchen_detail.kitchen_address_conversion.lat, lng: this.state.kitchen_detail.kitchen_address_conversion.lng}}
              onClick = {this.onMapClicked}
            >
            {this.state.kitchen_detail.kitchen_address_conversion === null ? 
              ""
              :
              <Marker
                  name = {this.state.kitchen_detail.kitchen_name}
                  kitchen_id = {this.state.kitchen_detail._id}
                  url = {this.state.kitchen_detail.bannerProfileImg != null ? this.state.kitchen_detail.bannerProfileImg.large : this.state.kitchen_detail.profileImg != null ? this.state.kitchen_detail.profileImg.origin : ""}
                  position = {{lat: this.state.kitchen_detail.kitchen_address_conversion.lat, lng: this.state.kitchen_detail.kitchen_address_conversion.lng}}
                  onClick = {this.onMarkerClick}
                />
              
            }
            {<InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}>
                <div>
                  <img className ='map_thumbnail' src = {this.state.selectedPlace.url} />
                  <h6>{this.state.selectedPlace.name}</h6>
                  <a href={"/kitchen/" + this.state.selectedPlace.kitchen_id}>more info</a>
                </div>
            </InfoWindow> }
          </Map>
        :
          ''
        }
      </span>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBxRWAwnS9h8pP1mF6sAa4ZnkqGYUPBGac',
})(DishMap)