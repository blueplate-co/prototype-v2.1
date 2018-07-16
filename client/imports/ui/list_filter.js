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

    // filter all with criteria
    filter() {
        console.log('Run filter now');
    }

    render() {
        return (
            <div className="filter-list">
                <LocationFilter actionFilter={this.filter}/>
                {/* <DateFilter />
                <TimeFilter />
                <ServingOptionFilter /> */}
            </div>
        );
    }
}