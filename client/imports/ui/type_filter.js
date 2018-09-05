import React, { Component } from 'react';
import PlacesAutocomplete from "react-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

  

// App component - represents the whole app

export default class TypeFilter extends Component {

    constructor(props) {
        super(props);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.onChange = address => this.setState({ address });
        this.getCurrentLatLng = this.getCurrentLatLng.bind(this);
        this.state = {
            popup: false,
            userAddress: '',
            address: '',
            lat: 0,
            lng: 0,
            customLat: 0,
            customLng: 0,
            chooseIndex: 0
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
              console.log('Latlng: ' + JSON.stringify(latLng));
              this.setState({
                  customLat: latLng.lat,
                  customLng: latLng.lng
              })
          })
          .catch(error => console.error('Error', error));
    };

    getCurrentLatLng() {
        this.setState({
            lat: 0,
            lng: 0,
            chooseIndex: 1
        });
        if( navigator.geolocation ) {
           // Call getCurrentPosition with success and failure callbacks
           navigator.geolocation.getCurrentPosition((position) => {
            // when success
            this.setState({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                chooseIndex: 1
            });
           }, (err) => {
            // when fail
            Materialize.toast(err.message, 4000, 'rounded bp-green');
            this.setState({
                chooseIndex: 0
            });
           });
        } else {
            Materialize.toast("Sorry, your browser does not support geolocation services.", 4000, 'rounded bp-red');
            this.setState({
                chooseIndex: 0
            });
        }
    }

    getLatLngFromAddress() {
        this.setState({
            chooseIndex: 2
        })
        Meteor.call('filter.getLatLngFromAddress', (err, res) => {
            if (!err) {
                this.setState({
                    lat: res.lat,
                    lng: res.lng
                })
            } else {
                this.setState({
                    chooseIndex: 0
                });
            }
        });
    }

    transferLocation() {
        if (this.state.customLat !== 0 && this.state.customLng !== 0) {
            this.setState({
                lat: this.state.customLat,
                lng: this.state.customLng,
                chooseIndex: 3
            })
        }
    }

    clearCriteria() {
        this.setState({
            customLat: 0,
            customLng: 0,
            lat: 0,
            lng: 0,
            chooseIndex: 0,
            address: '',
            popup: false
        });
        this.props.actionFilter(null);
    }

    apply() {
        if (Session.get('search_result')) {
            if (this.state.lat !== 0 && this.state.lng !== 0) {
                let geolocation = {
                    lat: this.state.lat,
                    lng: this.state.lng
                }
                this.props.actionFilter(geolocation);
                this.setState({
                    popup: false
                })
            }
        } else {
            Materialize.toast('No data for filter.', 4000, 'rounded bp-green');
        }
    }

    render() {
        const inputProps = {
            value: this.state.address,
            onChange: this.handleChange,
            onSelect: this.handleSelect
        };      
        return (
            <span>
                <li ref={this.setWrapperRef} onClick={() => this.locationPopup()} className={ (this.state.lat !== 0 && this.state.lng !== 0) ? 'type-filter active' : 'type-filter' }>
                    <span>Show Dishes</span>
                </li>
                {
                    (this.state.popup) ? (
                        <div ref={this.setWrapperRef} className="filter-popup type-popup-wrapper">
                            <ul className="list-filter-content-type">
                                <li onClick={ () => this.transferLocation() } className={ (this.state.chooseIndex == 3) ? 'active' : '' }>
                                    Show dishes
                                </li>
                                <li onClick={ () => this.transferLocation() } className={ (this.state.chooseIndex == 3) ? 'active' : '' }>
                                    Show kitchens
                                </li>
                            </ul>
                        </div>
                    ) : (
                        ""
                    )
                }
            </span>
        );
    }
}