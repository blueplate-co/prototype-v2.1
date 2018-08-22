import React, { Component } from 'react';
import Rating from './rating.js';

import ProgressiveImages from './progressive_image';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

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
        const imageServing = [
            "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/dinein.svg", 
            "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/servingOptions.svg", 
            "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/servingptions.svg"
        ];

        if (Object.keys(this.state.data).length > 0) {
            return (
                this.state.data.serving_option.map((serving, index) => {
                    return (
                        <div key={index} className="col s4 m3 l2">
                            <img src={imageServing[index]} width="100" height="109" alt="Serving option" />
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
    
    onMarkerClick = (props, marker, e) => {
        // this.setState({
        //     selectedPlace: props,
        //     activeMarker: marker,
        //     showingInfoWindow: true
        // });
      }
    
      onMapClicked = (props) => {
        // if (this.state.showingInfoWindow) {
        //   this.setState({
        //     showingInfoWindow: false,
        //     activeMarker: null
        //   })
        // }
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
                                    large={ dish_detail.meta.large }
                                    small={ dish_detail.meta.small }
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
                                    



                                    </div>
                                </div>
                            </div>
                        </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                    : 
                        <div className="preloader-wrapper small active">
                            <div className="spinner-layer spinner-green-only">
                            <div className="circle-clipper left">
                                <div className="circle"></div>
                            </div><div className="gap-patch">
                                <div className="circle"></div>
                            </div><div className="circle-clipper right">
                                <div className="circle"></div>
                            </div>
                            </div>
                        </div>
                }
            </div>
        )
    }
}