import React, { Component } from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

// Searching map component - represents the whole app
export class SearchMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      lat: null,
      lng: null
    }
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  componentDidMount = () => {
    // util.show_loading_progress();
  }

  componentWillReceiveProps = () => {
    if (this.props.loaded) {
      var lat = 22.3249546;
      var lng = 114.1379439;
      if (Session.get('search_nearby')) {
        if( navigator.geolocation ) {
          // Call getCurrentPosition with success and failure callbacks
          navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            this.setState({
              lat: lat,
              lng: lng
            });
          });
        }
      } else {
        this.setState({
          lat: lat,
          lng: lng
        });
      }
      util.hide_loading_progress();
    }
  }

  render() {
    return (
      <Map google={this.props.google} onClick={this.onMapClicked} center={{ lat: this.state.lat, lng: this.state.lng }} zoom={10}>
        {
          (Session.get('list_kitchen_for_map')) ?
            Session.get('list_kitchen_for_map').map((kitchen, index)=> {
              let banner = '';
              if (kitchen) {
                if (kitchen.bannerProfileImg) {
                  banner = kitchen.bannerProfileImg.origin;
                } else {
                  banner = '';
                }
                let avatar = '';
                if (kitchen.profileImg) {
                  avatar = kitchen.profileImg.origin;
                } else {
                  avatar = util.getDefaultChefImage();
                }
                let story = '';
                if (kitchen.cooking_story) {
                  if (kitchen.cooking_story.length > 105) {
                    story = kitchen.cooking_story.slice(0, 100) + '...';
                  } else {
                    story = kitchen.cooking_story;
                  }
                } else {
                  avatar = util.getDefaultChefImage();
                }
                return (
                  (kitchen.kitchen_address_conversion === null) ?
                  ""
                  :
                  <Marker
                    key = {index}
                    name = {kitchen.kitchen_name}
                    title = {kitchen.kitchen_address}
                    index = {kitchen._id}
                    banner = {banner}
                    avatar = {avatar}
                    story = {story}
                    position = {{lat: kitchen.kitchen_address_conversion.lat, lng: kitchen.kitchen_address_conversion.lng}}
                    onClick = {this.onMarkerClick}
                  />
                )
              }
            })
          : ''
        }
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <a href={'/kitchen/' + this.state.selectedPlace.index} target="_blank">
              <div className="info-window">
                {
                  (this.state.selectedPlace.banner) ?
                    <div className="banner" style={{backgroundImage: `url(${this.state.selectedPlace.banner})`}}></div>
                  : <div className="banner" style={{backgroundColor: `#ccc`}}></div>
                }
                {
                  (this.state.selectedPlace.avatar) ?
                    <div className="avatar" style={{backgroundImage: `url(${this.state.selectedPlace.avatar})`}}></div>
                  : <div className="avatar" style={{backgroundColor: `#ccc`}}></div>
                }
                <h1>{this.state.selectedPlace.name}</h1>
                <span className="story">{this.state.selectedPlace.story}</span>
              </div>
            </a>
        </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBxRWAwnS9h8pP1mF6sAa4ZnkqGYUPBGac'
})(SearchMap)