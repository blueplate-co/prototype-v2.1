import React, { Component } from 'react';
// import LocationFilter from './location_filter';
// import DateFilter from './date_filter';
// import TimeFilter from './time_filter';
// import ServingOptionFilter from './serving_option_filter';

// App component - represents the whole app
export default class ListFilter extends Component {

    constructor(props) {
        super(props);
    }

    // check the location of point is near
    arePointsNear(checkPoint, centerPoint, km) {
        var ky = 40000 / 360;
        var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
        var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
        var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
        return Math.sqrt(dx * dx + dy * dy) <= km;
        // example call: var vasteras = { lat: 59.615911, lng: 16.544232 };
        // var n = arePointsNear(vasteras, stockholm, 10);
        // => return false/ true
    }

    // filter all with criteria
    filter() {

        console.log('Run filter now');
    }

    render() {
        return (
            <div className="filter-list">
                {/* <LocationFilter actionFilter={this.filter}/> */}
                {/* <DateFilter />
                <TimeFilter />
                <ServingOptionFilter /> */}
            </div>
        );
    }
}