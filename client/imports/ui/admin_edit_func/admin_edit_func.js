import React, { Component } from 'react';
import BouncingLoader from '../bouncing_loader/bouncing_loader.js';
import AdminListDish from './admin_list_dish.js';

export default class AdminEditFunc extends Component {
    constructor(props) {
        super(props);

        this.state = {
            listDishes: []
        }
    };

    componentDidMount() {
        $(window).scrollTop(0);
        $('.page-footer').hide();
        $('#top-navigation-container').hide();
        
        Meteor.call('admin.get_list_dish', (err, res) => {
            if (res) {
                this.setState({ listDishes: res });
            }
        });
    }

    render() {
        return (
            (this.state.listDishes.length > 0) ? 
                <div className="container-fluid">
                    <AdminListDish listDishes={this.state.listDishes} />
                </div>
            :
                <BouncingLoader />
        );
    }
}