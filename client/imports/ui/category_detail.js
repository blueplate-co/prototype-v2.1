import React, { Component } from 'react';
import ChefItem from '../ui/chef_card_item/chef_card_item';
import BouncingLoader from '../ui/bouncing_loader/bouncing_loader';
import LazyLoad from 'react-lazyload';

export default class Category_detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            chefs: [],
            loading: true,
            lat: null,
            lng: null
        }
    }

    componentDidMount() {
    if ( navigator.geolocation ) {
        // Call getCurrentPosition with success and failure callbacks
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            })
        }, (err) => {
            Materialize.toast(err.message, 4000, 'rounded bp-green');
        });
    } else {
        Materialize.toast("Sorry, your browser does not support geolocation services.", 4000, 'rounded bp-red');
    }
    Meteor.call('chef_categories.getInfoById', this.props.id, (err, res) => {
        if (!err) {
            this.setState({
                data: res
            }, () => {
                Meteor.call('chef_categories.getTag', this.props.tag,(err, res) => {
                    if (!err) {
                        this.setState({
                            chefs: res,
                            loading: false
                        })
                    }
                });
            });
        }
    });
    }

    renderListDish() {
        if (this.state.loading) {
            return <BouncingLoader />
        } else {
            return this.state.chefs.map((item) => {
                return (
                    <LazyLoad key={item._id} once height={200}>
                        <ChefItem key={item._id} id={item._id} name={item.kitchen_name} rating={item.average_rating} banner={item.bannerProfileImg} tags={item.kitchen_tags} location={item.kitchen_address_conversion} currentLat={this.state.lat} currentLng={this.state.lng} />
                    </LazyLoad>
                )
            });
        }
    }

    render() {
        return (
            <div>
                <div className="category_banner" style={{ backgroundImage: "url(" + this.state.data.banner + ")" }}>
                    <div className="shadow-mask"></div>
                    <div className="container">
                        <h1>{this.state.data.categories_name}</h1>
                        <h4>{this.state.data.description}</h4>
                    </div>
                </div>
                <div className="container list-chef-wrapper">
                    { this.renderListDish() }
                </div>
            </div>
        );
    }
}
