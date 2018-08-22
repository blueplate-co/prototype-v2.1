import React, { Component } from 'react';
import Rating from './rating.js';

import ProgressiveImages from './progressive_image';
import DishMap from './dish_map';

const imageServing = [
    {
        service: 'Delivery',
        image: 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Del+1.svg'
    },
    {
        service: 'Dine in',
        image: 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Dine+2.svg'
    },
    {
        service: 'Pick up',
        image: 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/pick+up+1.svg'
    }
];

const imgServingUnSelect = [
    {
        service: 'Delivery',
        image: 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Deli+2.svg'
    },
    {
        service: 'Dine in', 
        image: 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Dine+1.svg'
    },
    {
        service: 'Pick up',
        image: 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/pick+up+2.svg'
    }
];
// Dish detail component
export default class Dish_Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        }
    }

    componentDidMount() {
        Meteor.call('dish.get_detail', this.props.id, (error, res) => {
            if (!error) {
                this.setState({
                    data: res
                })
            } else {
                Materialize.toast('Error occur when fetch data. Please try again.', 4000, 'rounded bp-green');
            }
        });
    }

    renderServingOption() {
        if (Object.keys(this.state.data).length > 0) {
            return (
                this.state.data.serving_option.map((serving, index) => {
                    return (
                        <div key={index} className="col s4 m3 l2">
                            <img src={imageServing[index].image} width="100" height="109" alt="Serving option" />
                            <span>{imageServing[index].service}</span>
                        </div>
                    );
                })
            );
        }
    };


    renderTags() {
        if (Object.keys(this.state.data).length > 0) {
            return (
                this.state.data.dish_tags.map((item, index) => {
                    return (
                        <div key={index} className="col s4 m3 l2">
                            <p className="btn-tag-detail">{item.tag}</p>
                        </div>
                    );
                })
            );
        }
    };

    getChefInfo() {
        var chef_detail = Kitchen_details.findOne({user_id: this.state.data.user_id});
        var source_img = chef_detail.profileImg != null ? chef_detail.profileImg.origin : "";
        return (
            <div className="row">
                <span className="col s12 m3 l4 chef-story-image"><img src={source_img} id="img-chef" width="78" height="78"/></span>
                <div className="col s12 m9 l8 chef-name-summary">
                    <span className="col s12 m12 l4 chef-name">{chef_detail.chef_name}</span>
                    <div className="col s12 m12 l8 chef-summary">
                        <div className="col s4 m2 l4 chef-summary-tried">
                            <p>{chef_detail.order_count}</p><p>Tried</p>
                        </div>
                        <div className="col s4 m2 l4 chef-summary-tried">
                            <p>0</p><p>Following</p>
                        </div>
                        <div className="col s4 m2 l4 chef-summary-like">
                            <p>0</p><p>Likes</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    render() {
        var dish_detail = (this.state.data);
        return (
            <div>
                {
                    Object.keys(this.state.data).length > 0 ? 
                        <div>
                            <div id="dish-image" className="col s12 m12 l12">
                                <ProgressiveImages
                                    large={ dish_detail.meta.origin }
                                    small={ dish_detail.meta.origin }
                                />
                            </div>

                            <div className="container">
                                <div id="service-dish-info" className="row">
                                    <div id="service-option" className="col s12 m7 leftDish">
                                        <div className="row dish-serving">
                                            <p>Serving options</p>
                                            {this.renderServingOption()}
                                        </div>
                                        
                                        <div className="row dish-tag">
                                            <p>Tags</p>
                                            {this.renderTags()}
                                        </div>
                                    </div>

                                    <div className="col s12 m5">
                                        <div id="detail-dish-info">
                                            <p id="dish-name">{dish_detail.dish_name}</p>
                                            <div className="rating-content">
                                                <p id="dish-price">${dish_detail.dish_selling_price}</p>
                                                <div className="rating-detail">
                                                    <span><Rating rating={dish_detail.average_rating}/></span>
                                                    <span className="sum-order-dish">{dish_detail.order_count}</span>
                                                    <span className="number-buy">1</span>
                                                </div>
                                                
                                                <div className="dish-description">
                                                    <p>{dish_detail.dish_description}</p>
                                                </div>
                                                <div className="handle-order-dish">
                                                    <span className="col s12 m5 l4 btn-order-dish">Order</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row show-chef-map">
                                    <div className="col s12 m7 chef-location">
                                        <DishMap />
                                    </div>
                                </div>

                                <div className="row chef-story-content">
                                    <div className="col s12 m7 l6">
                                        <p id="chef-story-title">Chef Story</p>
                                        <div className="row">
                                            {this.getChefInfo()}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                    : 
                        <div className="preloader-wrapper small active">
                            <div className="spinner-layer spinner-green-only">
                                <div className="circle-clipper left">
                                    <div className="circle"></div>
                                </div>
                                <div className="gap-patch">
                                    <div className="circle"></div>
                                </div>
                                <div className="circle-clipper right">
                                    <div className="circle"></div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        )
    }
}