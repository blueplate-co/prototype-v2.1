import React, { Component } from 'react';
import Rating from './rating.js';
import { Meteor } from 'meteor/meteor';

import { withTracker } from 'meteor/react-meteor-data';
import ProgressiveImages from './progressive_image';
import DishMap from './dish_map';
import DishListRelate from './dish_list_relate.js';
import InfoOrder from './info_order.js';
import { checking_promotion_dish, get_amount_promotion, delete_cookies, getCookie } from '/imports/functions/common/promotion_common';

// Dish detail component
export class Dish_Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            sumOrder : 1,
            kitchenDetail: {},
            summary_order : 0,
            kitchen_likes : 0,
            kitchen_follows : 0,
            alreadyRequested: false,
            cooking_story_content: '',
            more_dish_description: '',
            order_obj: {
                name_ordering: '',
                district_ordering: '',
                email_ordering: '',
                phone_ordering: '',
            },
            action: '',
        }
    }
    
    componentDidMount() {
        $(window).scrollTop(0);
        Meteor.call('dish.get_detail', this.props.id, (error, res) => {
            if (!error) {
                this.setState({
                    data: res
                })
                Session.set('dish_id_relate', this.state.data._id);
                Session.set('user_dish_id', this.state.data.user_id);
                // Get summary order of Chef
                Meteor.call('kitchen_tried.get', this.state.data.user_id, (error, res) => {
                    if (!error) {
                        this.setState({summary_order: res});
                    }
                });

                // Get summary like Chef from dishes and menu
                Meteor.call('kitchen_likes.get', this.state.data.user_id, (error, res) => {
                    if (!error) {
                        this.setState({kitchen_likes : res});
                    }
                });

                Meteor.call('kitchen_follows.get', this.state.data.user_id, (error, res) => {
                    if (!error) {
                        this.setState({kitchen_follows : res});
                    }
                });

                Meteor.call('requestdish.find_dish_request', this.state.data._id, Meteor.userId(), (err, res) => {
                    if (res) {
                        this.setState({alreadyRequested: true});
                    }
                });
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
                return("No tags available");
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

    renderChefInfo() {
        var chef_detail = Kitchen_details.findOne({user_id: this.state.data.user_id});            

        if (chef_detail != undefined) {
            var source_img = chef_detail.profileImg != null ? chef_detail.profileImg.origin : util.getDefaultChefImage(),
                cooking_story_content = chef_detail.cooking_story;

            if (chef_detail.cooking_story.length > 100) { 
                cooking_story_content = chef_detail.cooking_story.substring(0, 100) 
            } else {
                cooking_story_content = chef_detail.cooking_story
            }
            
            return (
                <div>
                    <a className="col s12 m12 l1 chef-story-image"
                        href={"/kitchen/" + this.state.data.kitchen_id}
                    >
                        <img src={source_img} id="img-chef" width="78" height="78"/>
                    </a>
                    <div className="row col s12 m12 l7 chef-name-summary">
                        <a className="col s12 m12 l10 chef-name"
                            href={"/kitchen/" + this.state.data.kitchen_id}
                        >
                            {chef_detail.chef_name}
                        </a>
                        <div className="col s12 m12 l10 chef-summary">
                            <ul className="chef-summary-infor no-margin">
                                <li className="text-center">{ this.state.summary_order }</li>
                                <li>Tried</li>
                            </ul>
                            <li className="dot-text-style">&bull;</li>
                            <ul className="chef-summary-infor no-margin">
                                <li className="text-center">{ this.state.kitchen_follows }</li><li>Following</li>
                            </ul>
                            <li className="dot-text-style">&bull;</li>
                            <ul className="chef-summary-infor no-margin">
                                <li className="text-center">{ this.state.kitchen_likes }</li><li>Likes</li>
                            </ul>
                        </div>
                    </div>
                    <div className="row col s12 m12 l12 dish-story-content">
                        { (this.state.cooking_story_content.length > 0) ?
                           <p id="chef-story-descr">{this.state.cooking_story_content}
                                <span className="handle-see-chef-story" onClick={ () => this.handleSeeLessChefStory() }> 
                                    see less
                                </span>
                           </p>
                            :
                            (chef_detail.cooking_story.length > 100) ?
                                <p id="chef-story-descr">{cooking_story_content}
                                    <span className="handle-see-chef-story" onClick={ () => this.handleSeeMoreChefStory(chef_detail.cooking_story) }> 
                                        see more
                                    </span>
                                </p>
                                :
                                (chef_detail.cooking_story.length === 0) ?
                                    <p id="chef-story-descr">No cooking story has been shared yet.</p>
                                :
                                    <p id="chef-story-descr">{chef_detail.cooking_story}</p>
                        }
                    </div>
                </div>
            );
        } else {
            return (
                <span>loading...</span>
            );
        }
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
        util.show_loading_progress();

        var foodie_details = Profile_details.findOne({"user_id": Meteor.userId()});
        var dish_details = this.state.data;
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
        var order = Shopping_cart.findOne({"product_id": dish_id, 'buyer_id': foodie_id});
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
                    if (err) {
                        Materialize.toast('Oops! Error when change your shopping cart. Please try again. ' + err.message, 6000, 'rounded bp-green');
                    } else {
                        //- send to Facebook Pixel
                        if (location.hostname == 'www.blueplate.co') {
                            fbq('track', 'AddToCart', { content_ids: dish_id, content_name: dish_name, currency: 'HKD', value: dish_price, contents: [{ 'id': dish_id, 'quantity': quantity, 'item_price': dish_price }] });
                        }                            
                        Materialize.toast(dish_name + ' from ' + homecook_name + ' has been added to your shopping cart.', 6000, "rounded bp-green");
                    }
                }
            )
        } else {
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
                        //- send to Facebook Pixel
                        if (location.hostname == 'www.blueplate.co') {
                            fbq('track', 'AddToCart', { content_ids: dish_id, content_name: dish_name, currency: 'HKD', value: dish_price, contents: [{ 'id': dish_id, 'quantity': quantity, 'item_price': dish_price }] });
                        }
                        Materialize.toast(dish_name + ' from ' + homecook_name + ' has been added to your shopping cart.', 4000, "rounded bp-green");
                    }
                }
            );
        }
        setTimeout ( () => {
            util.hide_loading_progress();
        }, 500);
    }

    handleOnDishAction() {
        if (this.state.action === "orderDish") {
            this.dishOrder();
            // check if have already cookies, create a promotion balance for this user
            if (getCookie('promotion') !== -1) {
                Meteor.call('promotion.insert_history', 'HKD50', (err, res) => {
                    if (!err) {
                        delete_cookies('promotion');
                        console.log('OK');
                    }
                });
            }
        } else if (this.state.action === "requestDish") {
            this.dishRequest();
        }
    }

    /**
     * Check info foodies
     * If not exist: get info and create new foodies_profile
     * Else: create order info
     */
    checkFoodiesInfor(actionFoodies) {
        util.show_loading_progress();
        // logged in
        if (Meteor.userId()) {
            // logged in with user_id, email
            this.setState({ action: actionFoodies}, () => {
                var foodie_details = Profile_details.findOne({"user_id": Meteor.userId()});
                if ( (typeof foodie_details == 'undefined') || (foodie_details !== undefined && foodie_details.foodie_name == '')) {
                    util.hide_loading_progress();
                    // Materialize.toast('Please complete your foodie profile before order.', 4000, 'rounded bp-green');
                    this.openInfoOrdering();
                } else {
                    this.handleOnDishAction();
                }
            });
        } else {
            //- not logged in
            this.setState({ action: actionFoodies});
            util.hide_loading_progress();
            this.openInfoOrdering();
        }
    }

    openInfoOrdering() {
        // Clear data info
        var order_info = this.state.order_obj;
        order_info.name_ordering = '';
        order_info.district_ordering = '';
        order_info.email_ordering = '';
        order_info.phone_ordering = '';
        this.setState( { order_obj: order_info});

        $('.dirty_field').removeClass('dirty_field');
        $('#ordering-popup').modal('open');
    }
    
    dishRequest() {
        var dish_id = this.state.data._id
            buyer_id = Meteor.userId(),
            seller_id = this.state.data.kitchen_id;

        var kitchen = Kitchen_details.findOne({_id: seller_id}),
            kitchen_contact = kitchen.kitchen_contact;

        var seller_detail = Meteor.users.findOne({_id: kitchen.user_id});
        var seller_email = seller_detail.emails[0].address;

        this.setState({alreadyRequested: true});
        var message = "Blueplate: Your offline dish (" + this.state.data.dish_name + ") is looking so good that " +
                     "foodies are requesting it!. Let’s make more good food and more hungry foodies happy.\n" + 
                     "Switch your dish to online here: " + document.location.origin + "/cooking/dishes";

        Meteor.call('requestdish.insert', dish_id, buyer_id, seller_id, (err, res) => {
            if (!err) {
                util.hide_loading_progress();
                Materialize.toast('Thanks for your request! We will notification to you when dish available', 4000, 'rounded bp-green');
                //- send to Facebook Pixel
                if (location.hostname == 'www.blueplate.co') {
                    fbq('trackCustom', 'SendDishRequest', { dish_id: dish_id, dish_name: this.state.data.dish_name, buyer: Meteor.userId(), seller: seller_id });
                }
                // Send sms
                Meteor.call('message.sms', kitchen_contact, message.trim(), (err, res) => {
                    if (!err) {
                        console.log(res);
                    }
                });

                // Sent email
                Meteor.call(
                    'requestdish.sendEmail',
                    kitchen.chef_name + " <" + seller_email + ">",
                    '', /* @param mail from..... default*/
                    '', /* @param subject - default*/
                    'Hi ' + kitchen.chef_name + "," + "\n\n" + message + "\n\n Happy cooking! \n Blueplate"
                );
            } else {
                Materialize.toast('Can not request Dish now, please try later!', 4000, 'rounded bp-green');
                util.hide_loading_progress();
            }
        });

    };

    handleSeeMoreChefStory(chefStoryCooking) {
        this.setState({ cooking_story_content: chefStoryCooking});
    };

    handleSeeLessChefStory() {
        this.setState({ cooking_story_content: ''});
    }

    renderDishDescription(dishDescr) {
        var dish_description = '';
        if (dishDescr.length > 200) {
            dish_description = dishDescr.substring(0, 200);
        }

        return (
            <div className="dish-descr-detail-text">
                { (this.state.more_dish_description.length > 0) ?
                    <p>{this.state.more_dish_description}  
                        <span className="show-more-descr-dish" onClick= { () => this.handleSeeLessDishDescr(dishDescr)}> see less</span>
                    </p>
                    :
                    (dishDescr.length) > 300 ? 
                        <p>{dish_description} <span className="show-more-descr-dish" onClick= { () => this.handleSeeMoreDishDescr(dishDescr)}>  see more</span></p>
                        :
                        (dishDescr.length == 0 ) ?
                            <p>No dish description available.</p>
                            :
                            <p>{dishDescr}</p>     
                    
                }
            </div>
        );
    }

    handleSeeLessDishDescr() {
        this.setState({ more_dish_description: '' });
    }

    handleSeeMoreDishDescr(dishDescr) {
        this.setState({ more_dish_description: dishDescr });
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
                                        
                                        <div className="row dish-description">
                                            <p id="dish-description-title">Dish description</p>
                                            {this.renderDishDescription(dish_detail.dish_description)}
                                        </div>

                                        <div className="row dish-time-order">
                                            <p id="dish-description-title">Order advance</p>
                                            <p id="time-ordering">
                                                {dish_detail.days > 0 ? dish_detail.days : 0} day 
                                                {dish_detail.hours > 0 ? " " + dish_detail.hours : " " +0} hour 
                                                {dish_detail.mins > 0 ? " " + dish_detail.mins : " " + 0} minutes
                                            </p>
                                        </div>

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

                                    <div className="col s12 m5 l5 grp-dish-info">
                                        <div id="detail-dish-info">
                                            <div id="dish-image-detail" className="col s12 m12 l12">
                                                <ProgressiveImages
                                                    large={ dish_detail.meta.origin }
                                                    small={ dish_detail.meta.small }
                                                />
                                            </div>
                                            <span id="dish-name">{dish_detail.dish_name}</span>
                                            <div className="rating-content dish-detail-info">
                                                {
                                                    (checking_promotion_dish(dish_detail._id).length > 0) ?
                                                        <ul className="promotion-price-list">
                                                            <li id="dish-price" className="dish-price no-padding">$ { dish_detail.dish_selling_price * get_amount_promotion(dish_detail._id) }</li>
                                                            <li className="dish-old-price no-padding" style={{ fontStyle: 'normal', fontWeight: '400', fontSize: '1.5rem', lineHeight: '32px', marginRight: '15px' }}>$ { dish_detail.dish_selling_price }</li>
                                                            <li className="promotion_tag_inline">{ '- ' + get_amount_promotion(dish_detail._id) * 100 + ' %' }</li>
                                                        </ul>
                                                    :
                                                        <div className="no-margin">
                                                            <div id="dish-price" className="dish-price text-left">$ { dish_detail.dish_selling_price }</div>
                                                        </div>
                                                }
                                                <div className="rating-detail">
                                                    <span><Rating rating={dish_detail.average_rating}/></span>
                                                    <span className="sum-order-dish">{dish_detail.order_count}</span>
                                                    <span className="number-buy">
                                                        <span id="reduce_order" onClick={this.handleReduceOrder.bind(this)}><i className="fa fa-minus-circle"></i></span>
                                                        <span>{this.state.sumOrder}</span>
                                                        <span id="add_order" onClick={this.handleAddOrder.bind(this)}><i className="fa fa-plus-circle"></i></span>
                                                    </span>
                                                </div>
                                                
                                                <div className="row">
                                                    <div className="handle-order-dish">
                                                        { (dish_detail.online_status) ? 
                                                            <span className="btn-order-dish-detail" onClick={() => this.checkFoodiesInfor("orderDish")}>order</span>
                                                            :
                                                            (this.state.alreadyRequested) ?
                                                                <p id="dish-request-infor">Your request has sent. We will notify you when chef make it ready again</p>
                                                                :
                                                                <div>
                                                                    <span className="btn-order-dish-detail" onClick = {() => this.checkFoodiesInfor("requestDish")}>request</span>
                                                                    <p id="dish-request-content">This dish is temporary not available for sell. Show your interest by click on above button so that we can notify you when chef make it ready again</p>
                                                                </div>
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

                                <div className="row chef-story-row show_dish_detail_wrapper">
                                    <div className="col s12 m7 l7 chef-story-content">
                                        <span id="chef-story-title">Chef Story</span>
                                        {this.renderChefInfo()}
                                    </div>
                                </div>
                                <div className="row show_dish_detail_wrapper">
                                    <div className="col s12 m7 l7">
                                        <p className="chef-relate-title">Chef related dishes</p>
                                        <DishListRelate kitchen_id={this.state.data.kitchen_id} />
                                    </div>
                                </div>
                            </div>

                            <InfoOrder order_obj={this.state.order_obj}
                                handleOnSaveOrderingInfo={() => this.handleOnDishAction()}
                                dish_id ={ this.state.data._id}
                            />
                        </div>
                    : 
                        <div className="preloader-wrapper small active loading-dish-detail">
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

export default withTracker(props => {
    const handle = Meteor.subscribe('userEmail');
    return {
        currentUser: Meteor.user(),
        listLoading: !handle.ready(),
    };
})(Dish_Detail);

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