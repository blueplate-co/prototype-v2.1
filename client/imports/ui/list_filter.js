import React, { Component } from 'react';
import LocationFilter from './location_filter';
import DateFilter from './date_filter';
import TimeFilter from './time_filter';
import ServingOptionFilter from './serving_option_filter';

// App component - represents the whole app
export default class ListFilter extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="filter-list">
                <LocationFilter />
                {/* <DateFilter />
                <TimeFilter />
                <ServingOptionFilter /> */}
            </div>
        );
    }
}