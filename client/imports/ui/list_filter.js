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
        this.updateGeoLocation = this.updateGeoLocation.bind(this);
        this.updateDate = this.updateDate.bind(this);
        this.updateTime = this.updateTime.bind(this);
        this.updateServingOption = this.updateServingOption.bind(this);
        this.state = {
            geolocation: null,
            date: null,
            time: null,
            serving_option: []
        }
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

    updateGeoLocation(geolocation) {
        this.setState({
            geolocation: geolocation
        }, () => {
            this.filter();
        });
    }

    updateDate(date) {
        this.setState({
            date: date
        }, () => {
            this.filter();
        })
    }

    updateTime(time) {
        this.setState({
            time: time
        }, () => {
            this.filter();
        })
    }

    updateServingOption(serving_option) {
        this.setState({
            serving_option: serving_option
        },() => {
            this.filter();
        })
    }

    // filter all with criteria
    filter() {
        if (Session.get('search_result_origin')) {
            let dishes = Session.get('search_result_origin').dish;
            let menus = Session.get('search_result_origin').menu;
            let result_dish = []; //init for all dishes in search result from keywords
            let result_menu = [];
            let result_kitchen = [];
            let number_of_filter = 0;
            // ***** FILTER FOR GEOLOCATION ****** //
            if (this.state.geolocation) {
                if (result_dish.length > 0) {
                    dish_data = result_dish;
                } else {
                    dish_data = dishes;
                }
                if (result_menu.length > 0) {
                    menu_data = result_menu;
                } else {
                    menu_data = menus;
                }
                // filter geolocation for dish
                for (var i = 0 ; i < dish_data.length; i++) {
                    let user_kitchen_id = dish_data[i].user_id;
                    let dish_location = Kitchen_details.findOne({ user_id: user_kitchen_id }).kitchen_address_conversion;
                    // nearby 10km
                    if (this.arePointsNear(dish_location, this.state.geolocation, 10)) {
                        result_dish.push(dish_data[i]);
                    }
                }
                // filter geolocation for menu
                for (var i = 0 ; i < menu_data.length; i++) {
                    let user_kitchen_id = menu_data[i].user_id;
                    let dish_location = Kitchen_details.findOne({ user_id: user_kitchen_id }).kitchen_address_conversion;
                    // nearby 10km
                    if (this.arePointsNear(dish_location, this.state.geolocation, 10)) {
                        result_menu.push(menu_data[i]);
                    }
                }
                // marked for number for filter
                number_of_filter += 1;
            }

            // ***** FILTER FOR DATE ***** //
            if (this.state.date) {
                if (result_dish.length > 0) {
                    dish_data = result_dish;
                } else {
                    dish_data = dishes;
                }
                if (result_menu.length > 0) {
                    menu_data = result_menu;
                } else {
                    menu_data = menus;
                }
                // filter for date
                
            }

            // ***** FILTER FOR TIME ***** //
            if (this.state.time) {
                if (result_dish.length > 0) {
                    dish_data = result_dish;
                } else {
                    dish_data = dishes;
                }
                if (result_menu.length > 0) {
                    menu_data = result_menu;
                } else {
                    menu_data = menus;
                }
                // filter time cooking for dish
                result_dish = dish_data.filter((element) => {
                    var cooking_time = 0;
                    if (element.days) {
                        cooking_time += element.days * 1440;
                    } else {
                        cooking_time += 0;
                    }
                    if (element.hours) {
                        cooking_time += element.hours * 60;
                    } else {
                        cooking_time += 0;
                    }
                    if (element.mins) {
                        cooking_time += 60;
                    } else {
                        cooking_time += 0;
                    }
                    var now = moment(moment(), "hh:mm:ss A");
                    // cooking time is less than request time, OK to serve
                    var cooking_completed_time = now.add(cooking_time + 15, 'minutes');
                    return cooking_completed_time < this.state.time;
                });
                // filter time cooking for menu
                result_menu = menu_data.filter((element) => {
                    var cooking_time = 0;
                    // cooking time with no minutes
                    cooking_time = (element.lead_hours * 60) + (element.lead_days * 1440);
                    var now = moment(moment(), "hh:mm:ss A");
                    // cooking time is less than request time, OK to serve
                    var cooking_completed_time = now.add(cooking_time + 15, 'minutes');
                    return cooking_completed_time < this.state.time;
                });
                // marked for number for filter
                number_of_filter += 1;
            }

            // **** FILTER FOR SERVING OPTIONS **** //
            if (this.state.serving_option) {
                if (result_dish.length > 0) {
                    dish_data = result_dish;
                } else {
                    dish_data = dishes;
                }
                if (result_menu.length > 0) {
                    menu_data = result_menu;
                } else {
                    menu_data = menus;
                }
                // filter time cooking for dish
                result_dish = dish_data.filter((element) => {
                    let found = this.state.serving_option.some(r => element.serving_option.includes(r))
                    return found;
                });
                // filter time cooking for menu
                result_menu = menu_data.filter((element) => {
                    let found = this.state.serving_option.some(r => element.serving_option.includes(r))
                    return found;
                });
                // marked for number for filter
                number_of_filter += 1;
            }
    
            // collection all filtered data after run search filter
            let result = {
                dish: [],
                menu: [],
                kitchen: []
            }
            // if no filter has been applied
            if (number_of_filter == 0) {
                result_dish = dishes;
            }
            result.dish = result_dish;
            result.menu = result_menu;
            result.kitchen = result_kitchen;
            // immutability for search_result_origin, use this filter effect for session search_result
            Session.set('search_result', result);
        } else {
            Materialize.toast('No data for filter.', 4000, 'rounded bp-green');
        }
    }

    render() {
        return (
            <div className="filter-list">
                <LocationFilter actionFilter={this.updateGeoLocation}/>
                <DateFilter actionFilter={this.updateDate}/>
                <TimeFilter actionFilter={this.updateTime}/>
                <ServingOptionFilter actionFilter={this.updateServingOption}/>
            </div>
        );
    }
}