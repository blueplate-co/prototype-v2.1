import React, { Component } from 'react';
import PlacesAutocomplete from "react-places-autocomplete";
import { geocodeByAddress, geocodeByPlaceId, getLatLng } from "react-places-autocomplete";

  

// App component - represents the whole app

export default class LocationFilter extends Component {

    constructor(props) {
        super(props);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.onChange = address => this.setState({ address });    
        this.state = {
            popup: false,
            userAddress: '',
            address: '',
            lat: 0,
            lng: 0
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        Meteor.call('filter.getAddress', (err, res) => {
            this.setState({
                userAddress: res
            })
        })
    }
    
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    
    setWrapperRef(node) {
        this.wrapperRef = node;
    }
    
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
          this.setState({
              popup: false,
              address: ''
          })
        }
    }

    locationPopup() {
        let popup = this.state.popup;
        this.setState({
            popup: !popup
        })
    }

    handleChange = address => {
        this.setState({ address });
    };
    
    handleSelect = address => {
        geocodeByAddress(address.target.value)
          .then(results => getLatLng(results[0]))
          .then(latLng => {
              this.setState({
                  lat: latLng.lat,
                  lng: latLng.lng
              })
          })
          .catch(error => console.error('Error', error));
    };

    render() {
        const inputProps = {
            value: this.state.address,
            onChange: this.handleChange,
            onSelect: this.handleSelect
        };      
        return (
            <div>
                <li ref={this.setWrapperRef} onClick={() => this.locationPopup()} className={ (this.state.popup) ? 'location-filter active' : 'location-filter' }>
                    <span>Location</span>
                </li>
                {
                    (this.state.popup) ? (
                        <div ref={this.setWrapperRef} className="filter-popup location-popup-wrapper">
                            <span>Where you like to enjoy your food?</span>
                            <ul className="list-filter-content-location">
                                <li>Current location</li>
                                <li>Your provided address: {this.state.userAddress}</li>
                                <li>
                                    <PlacesAutocomplete inputProps={inputProps} />
                                </li>
                            </ul>
                            <div className="row">
                                <div className="col lg-6"><button className="btn">Clear</button></div>
                                <div className="col lg-6"><button className="btn">Apply</button></div>
                            </div>
                        </div>
                    ) : (
                        ""
                    )
                }
            </div>
        );
    }
}