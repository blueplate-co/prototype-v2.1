import React from 'react';
import '../dish-distance/dish-distance.css';

export default class DishDistance extends React.Component {
    constructor(props) {
        super(props);
    }

    deg2rad = (deg) => {
        return deg * (Math.PI/180);
    }

    calculationDistance = (kitchenlocation, lat, lng) => {
        if (kitchenlocation && kitchenlocation !== {} ) {
            var R = 6371; // Radius of the earth in km
            var dLat = this.deg2rad(lat - kitchenlocation.lat); // deg2rad below
            var dLon = this.deg2rad(lng - kitchenlocation.lng);
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(this.deg2rad(kitchenlocation.lat)) * Math.cos(this.deg2rad(lat)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km
            d = parseFloat(d).toFixed(2);
            return d + ' km';
        } else {
            return 'Unknown kitchen location';
        }
    };

    render() {
        return (
            <span className="distance-container">{this.calculationDistance(this.props.location, this.props.currentLat, this.props.currentLng)}</span>
        )
    }
}