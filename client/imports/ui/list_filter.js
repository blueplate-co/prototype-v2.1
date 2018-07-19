import React, { Component } from 'react';
import LocationFilter from './location_filter';
import DateFilter from './date_filter';
import TimeFilter from './time_filter';
import ServingOptionFilter from './serving_option_filter';

// App component - represents the whole app
export default class ListFilter extends Component {

    constructor(props) {
        super(props);
        this.filter = this.filter.bind(this);
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
        let dishes = Session.get('search_result_origin').dish;
        let result_dish = []; //init for all dishes in search result from keywords
        let result_menu = [];
        let result_kitchen = [];
        let number_of_filter = 0;
        if (Session.get('filterGeolocation')) {
            // filter geolocation for dish
            for (var i = 0 ; i < dishes.length; i++) {
                let user_kitchen_id = dishes[i].user_id;
                let dish_location = Kitchen_details.findOne({ user_id: user_kitchen_id }).kitchen_address_conversion;
                // nearby 10km
                if (this.arePointsNear(dish_location, Session.get('filterGeolocation'), 10)) {
                    result_dish.push(dishes[i]);
                }
            }
            number_of_filter += 1;
        }

        // collection all filtered data after run search filter
        let result = {
            dish: [],
            menu: [],
            kitchen: []
        }
        if (number_of_filter == 0) {
            result_dish = dishes;
        }
        result.dish = result_dish;
        result.menu = result_menu;
        result.kitchen = result_kitchen;
        // immutability for search_result_origin, use this filter effect for session search_result
        Session.set('search_result', result);
    }

    render() {
        return (
            <div className="filter-list">
                <LocationFilter actionFilter={this.filter}/>
                <DateFilter />
                <TimeFilter />
                <ServingOptionFilter />
            </div>
        );
    }
}