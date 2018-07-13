import React, { Component } from 'react';

// App component - represents the whole app
export default class LocationFilter extends Component {

    constructor(props) {
        super(props);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.state = {
            popup: false
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
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
              popup: false
          })
        }
    }

    locationPopup() {
        let popup = this.state.popup;
        this.setState({
            popup: !popup
        })
    }

    render() {
        return (
            <div>
                <li ref={this.setWrapperRef} onClick={() => this.locationPopup()} className={ (this.state.popup) ? 'location-filter active' : 'location-filter' }>
                    <span>Location</span>
                </li>
                {
                    (this.state.popup) ? (
                        <div className="filter-popup location-popup-wrapper">
                            <span>Where you like to enjoy your food?</span>
                            
                        </div>
                    ) : (
                        ""
                    )
                }
            </div>
        );
    }
}