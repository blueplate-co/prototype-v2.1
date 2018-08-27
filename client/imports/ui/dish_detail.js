import React, { Component } from 'react';
import Rating from './rating.js';

import ProgressiveImages from './progressive_image';
import DishMap from './dish_map';
import DishListRelate from './dish_list_relate.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import DishStatus from './dish_status';

// Dish detail component
export default class Dish_Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
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
                Session.set('user_dish_id', this.state.data.user_id);
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
                            <p className={serving.styleService} >{serving.serviceName}</p>
                        </div>
                    );
                })
            );
        }
    };

    getImageService(services) {
        var servingOptions = [],
            mapCheckService = {};
            
        services.map(i => {
            mapCheckService[i] = 1;
        });

        const imgSupportDelivery = "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Del+1.svg",
            imgSupportDinein = "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Dine+2.svg",
            imgSupportPickup = "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/pick+up+1.svg",
            imgUnSupportDelivery = "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Deli+2.svg",
            imgUnSupportDinein = "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Dine+1.svg",
            imgUnSupportPickup = "https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/pick+up+2.svg";

        var addServiceObject = function(servingOptions, serviceName, mapCheckService, serviceSupportImg, serviceUnSupportImg, 
                                        styleService, styleUnService) {
            if (mapCheckService[serviceName]) {
                servingOptions.push({"serviceName": serviceName, "image": serviceSupportImg, "styleService" : styleService});
            } else {
                servingOptions.push({"serviceName": serviceName, "image": serviceUnSupportImg, "styleService": styleUnService});
            }
        };

        addServiceObject(servingOptions, "Delivery", mapCheckService, imgSupportDelivery, imgUnSupportDelivery, "style-service", "style-unService");
        addServiceObject(servingOptions, "Dine-in", mapCheckService, imgSupportDinein, imgUnSupportDinein, "style-service", "style-unService");
        addServiceObject(servingOptions, "Pick-up", mapCheckService, imgSupportPickup, imgUnSupportPickup, "style-service", "style-unService");

        return servingOptions;
    };

    renderTags() {
        if (Object.keys(this.state.data).length > 0) {
            if (this.state.data.dish_tags.length == 0) {
                return("No tags availble");
            }
            return (
                this.state.data.dish_tags.map((item, index) => {
                    return (
                        <li key={index}>{item.tag}</li>
                    );
                })
            );
        }
    };

    getChefInfo() {
        var chef_detail = Kitchen_details.findOne({user_id: this.state.data.user_id}),
            source_img = chef_detail.profileImg != null ? chef_detail.profileImg.origin : "",
            cooking_story_content;
        
        if (chef_detail.cooking_story.length > 100) { 
            cooking_story_content = chef_detail.cooking_story.substring(0, 100) 
        } else {
            cooking_story_content = chef_detail.cooking_story
        }
        // Get summary like Chef from dishes
        var dishes = Dishes.find({'user_id': this.state.data.user_id}).fetch(),
            summaryLike = 0;

        for (var i = 0; i < dishes.length; i++) {
            var dishLiked = DishesLikes.findOne({'dish_id': dishes[i]._id});
            dishLiked != null ? summaryLike++ : "";
        }

        return (
            <div className="show_dish_detail_wrapper">
                <a className="col s12 m12 l1 chef-story-image"
                    href={"/kitchen/" + this.state.data.kitchen_id}
                >
                    <img src={source_img} id="img-chef" width="78" height="78"/>
                </a>
                <div className="row col s12 m12 l4 chef-name-summary">
                    <a className="col s12 m12 l10 chef-name"
                        href={"/kitchen/" + this.state.data.kitchen_id}
                    >
                        {chef_detail.chef_name}
                    </a>
                    <div className="col s12 m12 l10 chef-summary">
                        <ul className="chef-summary-infor no-margin">
                            <li className="text-center">{chef_detail.order_count}</li>
                            <li>Tried</li>
                        </ul>
                        <li className="dot-text-style">&bull;</li>
                        <ul className="chef-summary-infor no-margin">
                            <li className="text-center">0</li><li>Following</li>
                        </ul>
                        <li className="dot-text-style">&bull;</li>
                        <ul className="chef-summary-infor no-margin">
                            <li className="text-center">{summaryLike}</li><li>Likes</li>
                        </ul>
                    </div>
                </div>
                <div className="row col s12 m12 l8 dish-story-content">
                    <p id="chef-story-descr">{cooking_story_content}<a href={"/kitchen/" + this.state.data.kitchen_id}>... see more</a></p>
                </div>
            </div>
        );
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

    dishOrder() {
        var foodie_details = Profile_details.findOne({"user_id": Meteor.userId()});
        if ((typeof foodie_details == 'undefined' || foodie_details.foodie_name == '')) {
            Materialize.toast('Please complete your foodie profile before order.', 4000, 'rounded bp-green');
        } else {
            var dish_details = Dishes.findOne({"_id": this.state.data._id});
            var foodie_id = Meteor.userId();
            var homecook_id = dish_details.user_id;
            var homecook_details = Kitchen_details.findOne({"user_id": homecook_id});
            var foodie_name = foodie_details.foodie_name;
            var homecook_name =  homecook_details.chef_name;
            var dish_id = dish_details._id;
            var dish_price = dish_details.dish_selling_price;
            var dish_name = dish_details.dish_name;
            var ready_time = dish_details.cooking_time;
            var quantity = this.state.sumOrder;


            var serving_option = this.state.data.serving_option;
            var address = Session.get('address');
            //check if the dish has been put in shopping check_shopping_cart
            var order = Shopping_cart.findOne({"product_id": this.state._id, 'buyer_id': foodie_id});
            var total_price_per_dish = 0;
            if (order) {
                var order_id = order._id;
                quantity = parseInt(order.quantity) + this.state.sumOrder;
                total_price_per_dish = parseInt(dish_price) * quantity;
                Meteor.call('shopping_cart.update',
                    order_id,
                    quantity,
                    total_price_per_dish,
                    function(err) {
                        if (err) Materialize.toast('Oops! Error when change your shopping cart. Please try again. ' + err.message, 4000, 'rounded bp-green');
                    }
                )
            } else{
                Meteor.call('shopping_cart.insert',
                    foodie_id,
                    homecook_id,
                    foodie_name,
                    homecook_name,
                    address,
                    serving_option,
                    ready_time,
                    dish_id,
                    dish_name,
                    quantity,
                    dish_price,
                    function(err) {
                        if (err) {
                            Materialize.toast('Oops! Error when add into shopping cart. Please try again. ' + err.message, 4000, 'rounded bp-green');
                        } else {
                            Materialize.toast(dish_name + ' from ' + homecook_name + ' has been added to your shopping cart.', 4000, "rounded bp-green");
                            FlowRouter.go('/main');
                        }
                    }
                );
            }
        }
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
                                    small={ dish_detail.meta.small }
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
                                            <ul className="dish-detail-list-tags">
                                                {this.renderTags()}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="col s12 m5 l5">
                                        <div id="detail-dish-info">
                                            <span id="dish-name" className="row">{dish_detail.dish_name}</span>
                                            <div className="rating-content">
                                                <div className="row no-margin">
                                                    <div id="dish-price" className="col l6 m6 s6 dish-price no-padding text-left">$ { dish_detail.dish_selling_price }</div>
                                                    <div className="col l6 m6 s6 dish-detail-status-order">
                                                    <DishStatus status={dish_detail.online_status} />
                                                    </div>
                                                </div>
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
                                                        {dish_detail.online_status ? 
                                                            <p id="btn-order-dish" onClick={this.dishOrder.bind(this)}>Order</p>
                                                            :
                                                            <p id="btn-offline-order-dish">Offline</p>
                                                        }
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
                                        <DishListRelate kitchen_id={this.state.data.kitchen_id} />
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