import React, { Component } from 'react';
import Rating from './rating.js';

import ProgressiveImages from './progressive_image';
import DishMap from './dish_map';
import DishListRelate from './dish_list_relate.js';

const imageServing = [
    {
        id:"selectDelivery",
        service: 'Delivery',
        image: 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Del+1.svg'
    },
    {
        id:"selectDineIn",
        service: 'Dine in',
        image: 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Dine+2.svg'
    },
    {
        id:"selectPickup",
        service: 'Pick up',
        image: 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/pick+up+1.svg'
    }
];

const serviceNotSupport = [
    {
        service: 'Delivery',
        image: 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Deli+2.svg'
    },
    {
        service: 'Dine-in', 
        image: 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Dine+1.svg'
    },
    {
        service: 'Pick-up',
        image: 'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/pick+up+2.svg'
    }
];
// Dish detail component
export default class Dish_Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            listRelates: {},
            sumOrder : 1,
            kitchenDetail: {}
        }
    }

    componentDidMount() {
        Meteor.call('dish.get_detail', this.props.id, (error, res) => {
            if (!error) {
                this.setState({
                    data: res
                })
                this.getListDishRelated();
            } else {
                Materialize.toast('Error occur when fetch data. Please try again.', 4000, 'rounded bp-green');
            }
        });
    }

    renderServingOption() {
        
        if (Object.keys(this.state.data).length > 0) {
            var arrServing = this.getImageService( this.state.data.serving_option);
            return (
                arrServing.map((serving, index) => {
                    return (
                        <div key={index} className="col s4 m3 l3 service-option-select">
                            <img src={serving.image} width="100" height="109" alt="Serving option" />
                            <p className="service-option-title">{serving.service}</p>
                        </div>
                    );
                })
            );
        }
    };

    getImageService(services) {
        var servingOptions = [],
            serviceName = {};

        for (var  i = 0; i < services.length; i++) {
            if (services[i] === "Delivery") {
                serviceName = {"service": services[i], "image":'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Del+1.svg'};
                servingOptions.push(serviceName);
            } else if (services[i] === "Dine-in") {
                serviceName = {"service": services[i], "image":'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Dine+2.svg'};
                servingOptions.push(serviceName);
            } else if (services[i] === "Pick-up") {
                serviceName = {"service": services[i], "image":'https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/pick+up+1.svg'};
                servingOptions.push(serviceName);
            }
        }

        // var serviceNotSupport = ["Delivery", "Dine-in", "Pick-up"];
        // if (servingOptions.length < 3) {
        //     for (var i = 0; i < serviceNotSupport.length; i++) {
        //         if (servingOptions[serviceNotSupport[i].service]) {
        //             servingOptions.push(serviceNotSupport[i]);
        //         }
        //     }
        // }

        return servingOptions;
    }

    renderTags() {
        if (Object.keys(this.state.data).length > 0) {
            if (this.state.data.dish_tags.length == 0) {
                return("No tags availble");
            }
            return (
                this.state.data.dish_tags.map((item, index) => {
                    return (
                        <div key={index} className="col s4 m4 l3 tag-summary">
                            <span className="btn-tag-detail">{item.tag}</span>
                        </div>
                    );
                })
            );
        }
    };

    getChefInfo() {
        var chef_detail = Kitchen_details.findOne({user_id: this.state.data.user_id});
        var source_img = chef_detail.profileImg != null ? chef_detail.profileImg.origin : "";

        
        // Get summary like Chef from dishes
        var dishes = Dishes.find({'user_id': this.state.data.user_id}).fetch(),
            summaryLike = 0;

        for (var i = 0; i < dishes.length; i++) {
            var dishLiked = DishesLikes.findOne({'dish_id': dishes[i]._id});
            dishLiked != null ? summaryLike++ : "";
        }

        return (
            <div className="show_dish_detail_wrapper">
                <span className="col s12 m12 l1 chef-story-image"><img src={source_img} id="img-chef" width="78" height="78"/></span>
                <div className="row col s12 m12 l4 chef-name-summary">
                    <span className="col s12 m12 l10 chef-name">{chef_detail.chef_name}</span>
                    <div className="col s12 m12 l10 chef-summary">
                        <span className="chef-summary-infor">
                            <p>{chef_detail.order_count}</p><p>Tried</p>
                        </span>
                        <span className="chef-summary-infor">
                            <p>0</p><p>Following</p>
                        </span>
                        <span className="chef-summary-infor">
                            <p>{summaryLike}</p><p>Likes</p>
                        </span>
                    </div>
                </div>
                <div className="row col s12 m12 l8 dish-story-content">
                    <p id="chef-story-descr">{chef_detail.cooking_story}</p>
                </div>
            </div>
        );
    };

    getListDishRelated() {
        Meteor.call('dish.list_relate', this.state.data.user_id, (error, res) => {
            if (!error) {
                this.setState({listRelates:res});
            }
        });

    };

    handleReduceOrder() {
        if (this.state.sumOrder == 1) {
            return;
        } else {
            var order = this.state.sumOrder - 1;
            this.setState({sumOrder: order});
        }
    }

    handleAddOrder() {
        this.setState({ sumOrder: this.state.sumOrder+1 });
    }
    
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

                            <div className="container-fluid">
                                <div id="service-dish-info" className="row show_dish_detail_wrapper">
                                    <div id="service-option" className="col s12 m7 l7 leftDish">
                                        <div className="row dish-serving">
                                            <p id="serving-option-content">Serving options</p>
                                            {this.renderServingOption()}
                                        </div>
                                        
                                        <div className="row dish-tag">
                                            <p id="tag-title">Tags</p>
                                            {this.renderTags()}
                                        </div>
                                    </div>

                                    <div className="col s12 m5 l5">
                                        <div id="detail-dish-info">
                                            <span id="dish-name">{dish_detail.dish_name}</span>
                                            <div className="rating-content">
                                                <p id="dish-price">${dish_detail.dish_selling_price}</p>
                                                <div className="rating-detail">
                                                    <span><Rating rating={dish_detail.average_rating}/></span>
                                                    <span className="sum-order-dish">{dish_detail.order_count}</span>
                                                    <span className="number-buy">
                                                        <span id="reduce_order" onClick={this.handleReduceOrder.bind(this)}>-</span>
                                                        <span>{this.state.sumOrder}</span>
                                                        <span id="add_order" onClick={this.handleAddOrder.bind(this)}>+</span>
                                                    </span>
                                                </div>
                                                
                                                <div className="dish-description">
                                                    <p>{dish_detail.dish_description}</p>
                                                </div>
                                                
                                                <div className="row">
                                                    <div className="handle-order-dish col s12 m7 l6">
                                                        <p id="btn-order-dish" >Order</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row show-chef-map show_dish_detail_wrapper">
                                    <div className="col s12 m7 l7 chef-location">
                                        <DishMap kitchenId={this.state.data.user_id}/>
                                    </div>
                                </div>

                                <div className="row chef-story-row">
                                    <div className="col s12 m7 l7 chef-story-content">
                                        <span id="chef-story-title" className="show_dish_detail_wrapper">Chef Story</span>
                                        {this.getChefInfo()}
                                    </div>
                                </div>
                                <div className="row show_dish_detail_wrapper">
                                    <div className="col s12 m7 l7">
                                        <p className="chef-relate-title">Chef relate dish</p>
                                        {this.state.listRelates.length > 0 ?
                                            <DishListRelate dishes={this.state.listRelates}/> : "No dish related to show!"
                                        }
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

$(document).ready(function () {  
      $(window).bind("scroll", function(e) {
          var top = $(window).scrollTop();
        if (412 < top && top < 1360) {
          $("#detail-dish-info").addClass("dish-scroll-fix-top");
        } else {
          $("#detail-dish-info").removeClass("dish-scroll-fix-top");
        } 

        if (top > 1091) {
            $("#detail-dish-info").addClass("dish-scroll-bottom");
        } else {
            $("#detail-dish-info").removeClass("dish-scroll-bottom");
        }
      });
  });