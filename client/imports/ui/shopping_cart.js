import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import ChefAvatar from '../ui/chef_avatar';
import moment from 'moment';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { checking_promotion_dish, get_amount_promotion } from '/imports/functions/common/promotion_common';
import { delete_cookies, getCookie } from '/imports/functions/common/promotion_common';
import ProgressBar from './progress_bar.js';
import InfoOrder from './info_order.js';

//- empty cart store global in this page
window.globalCart = localStorage.getItem("globalCart" + Meteor.userId());
// var kitchen = { id: item, service: "", date: "", time: "", timeStamp: "", address: "" };

// Shopping cart component
class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        this.renderListKitchen = this.renderListKitchen.bind(this);
        this.renderKitchen = this.renderKitchen.bind(this);
        this.handleChangeServiceOption = this.handleChangeServiceOption.bind(this);
        this.state = {
            discount: 0,
            bDateReady: false,
            dishesLocal: JSON.parse(localStorage.getItem("localCart")),
            shoppingCart: [],
            order_obj: {
                name_ordering: '',
                district_ordering: '',
                email_ordering: '',
                phone_ordering: '',
            },
            bGetInforUser: false, 
            bHasChangeQty: false,
            bExistAccount: true
        }
    }

    // remove item in shopping cart
    removeItem(id, product_id) {
        //- check again, if all products of kitchen are removed. update the global cart
        let unique = [...new Set(this.state.shoppingCart.map(item => item.seller_id))];
        Loop1:
            for (var i = 0; i < globalCart.length; i++) {
                for (var j = 0; j < unique.length; j++) {
                    if (globalCart[i].id == unique[j]) {
                        globalCart.splice(i, 1);
                        localStorage.setItem('globalCart' + Meteor.userId(), JSON.stringify(globalCart));
                        break Loop1;
                    }
                }
            }

        if (Meteor.userId()) {
            Meteor.call('shopping_cart.remove', id);
        }
        var attemp_globalCart = globalCart;
        var new_carts = this.state.shoppingCart.filter( (item) => item.product_id != product_id);
        this.setState({ shoppingCart: new_carts, bHasChangeQty: true }, () => {
            globalCart = attemp_globalCart;

            if (!Meteor.userId()) {
                localStorage.setItem("localCart", JSON.stringify(new_carts));
            }
            
            if (globalCart == null || globalCart.length == 0) {
                localStorage.setItem('globalCart' + Meteor.userId(), JSON.stringify(null));
            }
        });
    }

    // increaseQty of item in shopping cart
    increaseQty(id, product_id, quantity) {
        if (Meteor.userId()) {
            var item = Shopping_cart.find({ _id: id }).fetch()[0];
            var quantity = item.quantity + 1;
            var total_price_per_dish = quantity * item.product_price;
            total_price_per_dish = parseFloat(total_price_per_dish).toFixed(2);
            Meteor.call('shopping_cart.update',
                id,
                quantity,
                total_price_per_dish,
                function (err) {
                    if (err) Materialize.toast('Oops! Error when update the quantities of the dish in your shopping cart. Please try again.' + err.message.message, 4000, 'rounded bp-green');
                }
            )
        } 

        var attemp_carts = this.state.shoppingCart;
        for (var i = 0; i < attemp_carts.length; i++) {
            if (attemp_carts[i].product_id == product_id) {
                attemp_carts[i].quantity = attemp_carts[i].quantity + 1;
                attemp_carts[i].total_price_per_dish = attemp_carts[i].quantity * attemp_carts[i].product_price;
            }
        }
        var attemp_global_cart = globalCart;
        this.setState({ shoppingCart: attemp_carts, bHasChangeQty: true }, () => {
            globalCart = attemp_global_cart;
            if (Meteor.userId()) {
                localStorage.setItem('localCart', JSON.stringify(this.state.shoppingCart));
            }
        });
    }

    // decreaseQty of item in shopping cart
    decreaseQty(id, product_id, quantity) {
        if (quantity === 1) {
            return;
        } else {
            if (Meteor.userId()) {
                var item = Shopping_cart.find({ _id: id }).fetch()[0];
                var quantity = item.quantity - 1;
                var total_price_per_dish = quantity * item.product_price;
                total_price_per_dish = parseFloat(total_price_per_dish).toFixed(2);
            
                Meteor.call('shopping_cart.update',
                    id,
                    quantity,
                    total_price_per_dish,
                    function (err) {
                        if (err) Materialize.toast('Oops! Error when update the quantities of the dish in your shopping cart. Please try again.' + err.message.message, 4000, 'rounded bp-green');
                    }
                )
            } 

            var attemp_carts = this.state.shoppingCart;
            for (var i = 0; i < attemp_carts.length; i++) {
                if (attemp_carts[i].product_id == product_id) {
                    attemp_carts[i].quantity = attemp_carts[i].quantity - 1;
                    attemp_carts[i].total_price_per_dish = attemp_carts[i].quantity * attemp_carts[i].product_price;
                }
            }
            var attemp_global_cart = globalCart;
            this.setState({ shoppingCart: attemp_carts, bHasChangeQty: true }, () => {
                globalCart = attemp_global_cart;
                if (Meteor.userId()) {
                    localStorage.setItem('localCart', JSON.stringify(this.state.shoppingCart));
                }
            });
        }
    }

    // when change service option for kitchen
    handleChangeServiceOption(event, seller_id) {
        for (var i = 0; i < globalCart.length; i++) {
            if (globalCart[i].id == seller_id) {
                globalCart[i].service = event.target.value;
                if (event.target.value == "Dine-in") {
                    var kitchenAddress = Kitchen_details.findOne({ "user_id": seller_id }).kitchen_address;
                    globalCart[i].address = kitchenAddress;
                    var commaIndex = kitchenAddress.indexOf(",");
                    var shortAddress = kitchenAddress.substring(commaIndex + 1, kitchenAddress.length).trim();
                    $("#label_" + seller_id).addClass('format-text-label');
                    $("#label_" + seller_id).text('Your dishes will be ready at chef’s kitchen at...');
                    $("#address_" + seller_id).val(shortAddress);
                    $("#address_" + seller_id).attr('disabled', !$(this).attr('checked'));
                    $("#address_" + seller_id).removeClass('invalid');
                } else if (event.target.value == "Delivery") {
                    $("#label_" + seller_id).text('Your dishes will be delivered to...');
                    $("#address_" + seller_id).removeAttr('disabled');
                } else {
                    var kitchenAddress = Kitchen_details.findOne({ "user_id": seller_id }).kitchen_address;
                    globalCart[i].address = kitchenAddress;
                    var commaIndex = kitchenAddress.indexOf(",");
                    var shortAddress = kitchenAddress.substring(commaIndex + 1, kitchenAddress.length).trim();
                    $("#label_" + seller_id).addClass('format-text-label');
                    $("#label_" + seller_id).text('Your dishes will be ready at chef’s kitchen at...');
                    $("#address_" + seller_id).val(shortAddress);
                    $("#address_" + seller_id).attr('disabled', !$(this).attr('checked'));
                    $("#address_" + seller_id).removeClass('invalid');
                }
            }
        }
        $(".select-serving-option").css("color", "rgba(0, 0, 0, 0.87)");
    }

    // when change address for kitchen
    handleChangeAddress(event, seller_id) {
        for (var i = 0; i < globalCart.length; i++) {
            if (globalCart[i].id == seller_id) {
                globalCart[i].address = event.target.value;
            }
        }
    }

    // when change time for kitchen
    handleChangeTime(el, seller_id, hours, mins) {
        if (!this.validateTimeSelected(el.target.value, hours, mins)) {
            setTimeout(() => {
                $('#time'+seller_id).addClass('invalid');
                $('#time'+seller_id).focus();
            }, 10);
            Materialize.toast('Preferred Ready Time must be later than the Latest Ready Time', '4000', 'rounded bp-green');
        } else {
            for (var i = 0; i < globalCart.length; i++) {
                if (globalCart[i].id == seller_id) {
    
                    if (globalCart[i].date == 'Invalid date' || globalCart[i].date == '') {
                        el.target.value = '';
                        $('#date'+seller_id).addClass('invalid');
                        $('#date'+seller_id).focus();
                        Materialize.toast('On which date would you like to be served?', '4000', 'rounded bp-green');
                        return;
                    }

                    $('#date'+seller_id).removeClass('invalid');
                    $('#time'+seller_id).removeClass('invalid');
                    globalCart[i].time = el.target.value;
                    // use old code from Michael to store preferred_time_ms
                    var yyyy = globalCart[i].date[6] + globalCart[i].date[7] + globalCart[i].date[8] + globalCart[i].date[9]
                    var mm = parseInt(globalCart[i].date[3] + globalCart[i].date[4]) - 1
                    var dd = globalCart[i].date[0] + globalCart[i].date[1]
                    var hh = globalCart[i].time[0] + globalCart[i].time[1]
                    var min = globalCart[i].time[3] + globalCart[i].time[4]
                    serve_date = new Date(yyyy, mm, dd, hh, min)
                    serve_date = Date.parse(serve_date);
                    globalCart[i].timeStamp = serve_date;
                }
            }
        }
    }

    // when change date for kitchen
    handleChangeDate(event, seller_id, days) {
        var id_evt = event.target["id"];
        var date_select = event.target.value;
        var attemp_cart = globalCart;
        this.validateDateSelected(moment(date_select), days, function(bValidDate) {
            globalCart = attemp_cart;
            if (bValidDate) {
                for (var i = 0; i < globalCart.length; i++) {
                    if (globalCart[i].id == seller_id) {
                        globalCart[i].date = moment(date_select).format('DD/MM/YYYY');
                        // use old code from Michael to store preferred_time_ms
                        var yyyy = globalCart[i].date[6] + globalCart[i].date[7] + globalCart[i].date[8] + globalCart[i].date[9]
                        var mm = parseInt(globalCart[i].date[3] + globalCart[i].date[4]) - 1
                        var dd = globalCart[i].date[0] + globalCart[i].date[1]
                        var hh = globalCart[i].time[0] + globalCart[i].time[1]
                        var min = globalCart[i].time[3] + globalCart[i].time[4]
                        serve_date = new Date(yyyy, mm, dd, hh, min);
                        serve_date = Date.parse(serve_date);
                        globalCart[i].timeStamp = serve_date;
                        $('#' + id_evt).removeClass('invalid');
                    }
                }
            } else  {
                Materialize.toast('Preferred Ready Time must be later than the Latest Ready Time', '3000', 'rounded bp-green');
                setTimeout(() => {
                    $('#'+ id_evt).addClass('invalid');
                    $('#'+id_evt).focus();
                }, 50);
            }
            $("#"+id_evt).css("color", "rgba(0, 0, 0, 0.87)");
        });
    }

    scrollToFieldRequired(el) {
        var $el = $('#' + el);
        $el.addClass('invalid');
        $('#shoppingcart-container').animate({
          scrollTo: $el.offset().top
        }, 100);
        $el.focus();
    };

    validateShoppingCartCheckOut() {
        var valid = true;
        Loop1:
            for (var i = 0; i < globalCart.length; i++) {
                for( var key in globalCart[i] ) {
                    if (globalCart[i][key] == '' && key == 'service') {
                        valid = false;
                        this.scrollToFieldRequired('select-serving-option' + globalCart[i]['id']);
                        Materialize.toast('Oops! Please select your service to get your food.', '3000', 'rounded bp-green');
                        break Loop1;
                    }

                    if (globalCart[i][key] == '' && key == 'address') {
                        $('#address_' + globalCart[i].id).addClass('invalid');
                        Materialize.toast('Oops! Please complete your delivery address.', '3000', 'rounded bp-green');
                        this.scrollToFieldRequired('address_' + globalCart[i].id);
                        valid = false;
                        break Loop1;
                    } else {
                        $('#address_' + globalCart[i].id).removeClass('invalid');
                    }

                    if ((globalCart[i][key] == 'Invalid date' || globalCart[i][key] == '') && key == 'date') {
                        valid = false;
                        this.scrollToFieldRequired('date' + globalCart[i]['id']);
                        Materialize.toast('Oops! Please select your date would you like to be served.', '3000', 'rounded bp-green');
                        break Loop1;
                    }

                    if (globalCart[i][key] == '' && key == 'time') {
                        valid = false;
                        this.scrollToFieldRequired('time' + globalCart[i]['id']);
                        Materialize.toast('Oops! Please select your time.', '3000', 'rounded bp-green');
                        break Loop1;
                    }


                }
            };
        return valid;
    }

    // when user click checkout button
    handleCheckout() {
        util.show_loading_progress();
        globalCart.forEach((item, index) => {
            item.address = $('#address_' + item.id).val();
        });
        

        globalCart.forEach((item, index) => {
            Meteor.call('message.createConversasion', Meteor.userId(), item.id, (err, res) => {
                if (!err) {
                    var conversation_id = res;
                    Meteor.call('message.createStatus', Meteor.userId() , item.id, 'Start conversation', conversation_id, (err, res) => {
                        if (!err) {
                            console.log('Start conversation');
                        }
                    });
                    Meteor.call('message.createStatus', item.id , Meteor.userId(), 'Start conversation', conversation_id, (err, res) => {
                        if (!err) {
                            console.log('Start conversation');
                        }
                    });
                } else {
                    console.log(err);
                }
            })
        })
        
        if (!util.filterEmailInternalForNotification() && util.checkCurrentSite()) {
            this.sendSummaryCheckoutDish();
        }

        //- send to Facebook Pixel
        if (location.hostname == 'www.blueplate.co' && !util.filterEmailInternalForNotification()) {
            fbq('track', 'InitiateCheckout', { content_ids: Meteor.userId(), contents: globalCart, num_items: globalCart.length });
        }

        // When not login, Meteor.userId() return null
        localStorage.setItem('globalCartnull', JSON.stringify([]));
        localStorage.removeItem('globalCartnull');

        localStorage.setItem('globalCart' + Meteor.userId(), JSON.stringify(globalCart));

        // If haven't check amount or change quantity of product
        if ( !localStorage.getItem('bEnoughtAmount' + Meteor.userId()) || this.state.bHasChangeQty )  {
            this.checkEnoughtCurrentAmount();
        } else {
            Session.set('product', ''); // reset session
            Session.set('product', globalCart);
            globalCart = [];
            util.hide_loading_progress();
            FlowRouter.go('/payment');
        }
    }
    
    handleGetInfor() {
        if (this.validateShoppingCartCheckOut()) {

            if (Meteor.userId()) {
                this.handleCheckout();
            } else {
                localStorage.setItem('globalCart' + Meteor.userId(), JSON.stringify(globalCart));
                this.setState({ bGetInforUser: true});
            }
        }
    }

    checkEnoughtCurrentAmount() {
        util.show_loading_progress();
        if (this.state.bExistAccount) {
            Meteor.call('payment.getCredits', (err, credits) => {
                var shoppingCart = Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch();
                var total = 0;
                for (var i = 0; i < shoppingCart.length; i++) {
                    if (checking_promotion_dish(shoppingCart[i].product_id).length > 0) {
                        total += parseFloat(shoppingCart[i].total_price_per_dish * get_amount_promotion(shoppingCart[i].product_id));
                    } else {
                        total += parseFloat(shoppingCart[i].total_price_per_dish);
                    }
                }
    
                // get Stripe balance
                Meteor.call('payment.getStripeBalance', (err, res) => {
                    let balance = parseFloat(res.account_balance / 100).toFixed(2);
                    Meteor.call('promotion.check_history', (err, res) => {
                        if (Object.keys(res).length == 0) {
                            var promotion_credits = 0;
                        } else {
                            var promotion_credits = res.balance;
                        }
                        localStorage.setItem('sTotalAmount' + Meteor.userId(), total - promotion_credits);
    
                        // check pending order of buyer
                        var pendingOrder = Order_record.find({
                            buyer_id: Meteor.userId(),
                            status: 'Created'
                        }).fetch();
                        var pendingCost = 0;
                        for (var i = 0; i < pendingOrder.length; i++) {
                            if (checking_promotion_dish(pendingOrder[i].product_id).length > 0) {
                                pendingCost += parseFloat(pendingOrder[i].total_price * get_amount_promotion(pendingOrder[i].product_id));
                            } else {
                                pendingCost += pendingOrder[i].total_price;
                            }
                        }
                        var trueBalance = (parseFloat(credits) + parseFloat(balance) + parseFloat(promotion_credits)) - parseFloat(pendingCost);
                        
                        this.checkEnoughtAMount(trueBalance, total);
                    });
                });
            });
        } else {
            var total = 0;
            var shoppingCart = this.state.shoppingCart;
            for (var i = 0; i < shoppingCart.length; i++) {
                if (checking_promotion_dish(shoppingCart[i].product_id).length > 0) {
                    total += parseFloat(shoppingCart[i].total_price_per_dish * get_amount_promotion(shoppingCart[i].product_id));
                } else {
                    total += parseFloat(shoppingCart[i].total_price_per_dish);
                }
            }
            localStorage.setItem('sTotalAmount' + Meteor.userId(), total - this.state.discount);

            this.checkEnoughtAMount(this.state.discount, total);
        }
    }

    checkEnoughtAMount(trueBalance, total) {
         // sum of two wallet is not enough to pay
         if (trueBalance < total) {
            // not enough money to pay
            localStorage.setItem('bEnoughtAmount' + Meteor.userId(), false);
        } else {
            localStorage.setItem('bEnoughtAmount' + Meteor.userId(), true);
        }
        
        this.setState({ bHasChangeQty: false });
        Session.set('product', ''); // reset session
        Session.set('product', globalCart);
        globalCart = [];
        util.hide_loading_progress();
        FlowRouter.go('/payment');
    }
    
    handleOnViewDetailDish(dish_id) {
        FlowRouter.go("/dish/" + dish_id);
    }

    renderSingleProduct(product) {
        return product.map((item, index) => {
            var type = "dish";
            var detail = Dishes.find({ _id: item.product_id }).fetch()[0];
            if (!detail) {
                detail = Menu.find({ _id: item.product_id }).fetch()[0];
                type = "menu";
                var background = Dishes.find({ _id: detail.dishes_id[0] }).fetch()[0].meta.large;
            }
            return (
                (type == "dish") ?
                (
                    <div key={index} className="row detail-product">
                        <div className="col s3 m3 l3 detail-image-product">
                            <div className="detail-thumbnail view-detail-dish" style={{ backgroundImage: "url(" + detail.meta.large + ")" }} onClick={() => this.handleOnViewDetailDish(item.product_id)}></div>
                        </div>
                        <div className="col s9 m9 l9 product-info">
                            <span className="fa fa-times remove-item" onClick={ () => this.removeItem(item._id, item.product_id) }></span>
                            <span className="detail-title view-detail-dish" onClick={() => this.handleOnViewDetailDish(item.product_id)}>{ detail.dish_name }</span>
                            {
                                (checking_promotion_dish(detail._id).length > 0) ?
                                (
                                    <span>
                                        <span className="col l1 m3 s12 detail-price">HK$ { detail.dish_selling_price * get_amount_promotion(detail._id) }</span>
                                        <span className="col l3 m3 s12 detail-old-price">HK$ { detail.dish_selling_price }</span>
                                    </span>
                                )
                                : (
                                    <span className="detail-price">
                                        <span className="detail-price">HK$ { detail.dish_selling_price }</span>
                                    </span>
                                )
                            }
                            <div className="quantity-control">
                                <span onClick={ () => this.decreaseQty(item._id, item.product_id, item.quantity) }><i className="fa fa-minus-circle quantity-icon-format"></i></span>
                                <span>{ item.quantity }</span>
                                <span onClick={ () => this.increaseQty(item._id, item.product_id, item.quantity) }><i className="fa fa-plus-circle quantity-icon-format"></i></span>
                            </div>
                        </div>
                    </div>
                )   :
                (
                    <div key={index} className="row detail-product">
                        <div className="col s1 m1 l1 xl1">
                            <div className="detail-thumbnail" style={{ backgroundImage: "url(" + background + ")" }} ></div>
                        </div>
                        <div className="col s11 m11 l11 xl11 product-info">
                            <span className="fa fa-times remove-item" onClick={ () => this.removeItem(item._id) }></span>
                            <span className="detail-title">{ detail.menu_name }</span>
                            <span className="detail-price">HK${ detail.menu_selling_price }</span>
                            <div className="quantity-control">
                                <span onClick={ () => this.decreaseQty(item._id) }>-</span>
                                <span>{ item.quantity }</span>
                                <span onClick={ () => this.increaseQty(item._id) }>+</span>
                            </div>
                        </div>
                    </div>
                )
            )
        });
    }

    renderServingOption(seller_id) {
        var serviceOption = Kitchen_details.find({ user_id: seller_id }).fetch()[0].serving_option;

        return serviceOption.map(function(item, index){
            return <option key={index} value={item}>{item}</option>
        })
    }

    validateDateSelected = (dateSelected, days, callback) => {
        var date_ready = moment().add(days, 'days');
        if (dateSelected.year() > date_ready.year()) {
            this.setState({ bDateReady: false }, () => { callback(true) });
        } else if (dateSelected.month() > date_ready.month()) {
            this.setState({ bDateReady: false }, () => { callback(true) });
        } else if (dateSelected.date() > date_ready.date()) {
            this.setState({ bDateReady: false }, () => { callback(true) });
        } else if (dateSelected.date() == date_ready.date()) {
            this.setState({ bDateReady: true }, () => { callback(true) });
        } else if (dateSelected.date() < date_ready.date()) {
            this.setState({ bDateReady: false }, () => { callback(false) });
        }
    };


    validateTimeSelected = (timeSelected, hours, mins) => {
        var time_ready = moment().add(hours, 'hours').add(mins, 'minute');
        timeSelected = moment(timeSelected, 'h:mm');
        if (this.state.bDateReady) {
            if (timeSelected.isBefore(time_ready)) {
                return false;
            }
        }
        return true;
    };

    renderKitchen(seller_id, index) {
        var product = this.state.shoppingCart.filter( item => item.seller_id == seller_id );
        var sellerName = product[0].seller_name;
        var curr = new Date();
        var seller_images = '';
        var kitchen_id = '';
        curr.setDate(curr.getDate());
        var address = globalCart[index].address,
            defaultTimePicker = globalCart[index].time,
            defaultDate = this.formatDateOrder(globalCart[index].date),
            id_service = 'select-serving-option' + globalCart[index].id;

        var dish_detail = Dishes.findOne({ _id:  product[0].product_id}),
            days = dish_detail.days ? dish_detail.days : 0,
            hours = dish_detail.hours ? dish_detail.hours : 0,
            mins = dish_detail.mins ? dish_detail.mins : 0,
            time_ready = "Cooking time is: " + days + " day " + hours + " hour " + mins + " min";


        // get user avatar from user_id
        let kitchen_details = Kitchen_details.findOne({ user_id: seller_id });
        if (kitchen_details && kitchen_details.profileImg) {
            seller_images = kitchen_details.profileImg.origin;
            kitchen_id = kitchen_details._id;
        } else {
            var chef_avatar = kitchen_details.profileImg != undefined ? kitchen_details.profileImg.origin : util.getDefaultChefImage();
            seller_images = chef_avatar;
            kitchen_id = kitchen_details._id;
        }

        return (
            <div key={index}>
                <div className="row kitchen-name">
                    <ChefAvatar kitchenId={kitchen_id} profileimages={seller_images} />
                    <p className="chef-name-text">{ sellerName }'s kitchen</p>
                </div>
                <div className="row">
                    <div className="col s12 m6 l6">
                        <div className="service-option-cart">
                            <span className="service-option-icon"></span>
                            <select id={id_service} style={{...this, color: address ? 'rgba(0, 0, 0, 0.87)' : ''}} className="select-serving-option browser-default no-border drop-down-servicing" 
                                defaultValue={globalCart[index].service} onChange={(event) => this.handleChangeServiceOption(event, seller_id)} >
                                <option value="" disabled>How would you like to get your food?</option>
                                { this.renderServingOption(seller_id) }
                            </select>
                        </div>

                        <div className="input-field col s12 m12 l12 icon-position-common">
                            <i className="material-icons prefix location-address icon-cart-format">location_on</i>
                            <textarea id={"address_" + seller_id} name={"address_" + seller_id} defaultValue={address} className="address materialize-textarea" placeholder="Let’s input your delivery address" type="text" 
                                onChange={(event) => this.handleChangeAddress(event, seller_id)} />
                            {/* <label htmlFor={"address_" + seller_id} id={"label_" + seller_id}></label> */}
                        </div>

                        
                        <div className="input-field col s12 m12 l12 icon-position-common date-summary">
                            <i className="material-icons prefix location-address icon-cart-format">date_range</i>
                            <input id={"date" + globalCart[index].id} className="date" type="date" defaultValue={ defaultDate ? defaultDate : ''} 
                                style={{...this, color: defaultDate.indexOf('Invalid date') < 0 ? 'rgba(0, 0, 0, 0.87)' : ''}}
                                onChange={(event) => this.handleChangeDate(event, seller_id, days)} />
                            {/* <label htmlFor="date"></label> */}
                        </div>

                        <div className="input-field col s12 m12 l12 no-background time-cart icon-position-common">
                            <i className="material-icons prefix time-cart-icon icon-cart-format">timer</i>
                            <input type="time" id={"time" + globalCart[index].id} className="time" defaultValue= {defaultTimePicker ? defaultTimePicker : '' } 
                                onChange={(event) => this.handleChangeTime(event, seller_id, hours, mins)}
                                placeholder="What time will be best?"
                            />
                        </div>
                    </div>

                    <div className="col s12 m6 l6">
                        { this.renderSingleProduct(product) }
                    </div>
                </div>
            </div>
        )
    }

    formatDateOrder(dateOrder) {
        var arrDateOrder = dateOrder.split("/"),
            year = arrDateOrder[2],
            month = arrDateOrder[1],
            date = arrDateOrder[0];
        
        return year + "-" + month + "-" + date;
    }

    renderListKitchen() {
        //- get unique seller_id
        globalCart = JSON.parse(localStorage.getItem("globalCart" + Meteor.userId()));
        if (typeof globalCart == 'object' && globalCart == null ) {
            globalCart = [];
        }

        var unique = [];
        unique = [...new Set(this.state.shoppingCart.map(item => item.seller_id))];

        if (unique.length > 0) {
            return (
                unique.map((item, index) => {
                    //- create new object to store all information about this kitchen
                    var kitchen = { id: item, service: "", date: moment(null).format('DD/MM/YYYY'), time: "", timeStamp: '', address: "" };

                    if (globalCart.length > 0) {
                        let bExistDishId = false;
                        globalCart.map( (cartItem, idx) => {
                            if (cartItem.id == item ) {
                                bExistDishId = true;
                            }
                        });

                        if (!bExistDishId) {
                            globalCart.push(kitchen);
                        }

                    } else {
                        globalCart.push(kitchen);
                    }

                    return this.renderKitchen(item, index);
                })
            )
        } else {
            return (
                <div className="row text-center">
                    <div id="empty-shopping-cart"></div>
                    <p className="row empty-text-cart">There is no item in your shopping cart</p>
                    <button id="btn-continue-shopping" onClick={ () => this.handleOnContinueShoppping()}>continue shopping</button>
                </div>
            )
        }
    }

    handleOnContinueShoppping() {
        FlowRouter.go('/main');
    }

    // Internal sms: send order info message to admin when has new order
    sendSummaryCheckoutDish() {
        var checkSellerName ={};
        this.state.shoppingCart.map( (item, index) => {
            var seller_detail = Meteor.users.findOne({_id: item.seller_id});
            var seller_email = seller_detail.emails[0].address;
            var kitchen_contact = Kitchen_details.findOne({user_id: item.seller_id}).kitchen_contact;
            var product_info = " (quantity: " + item.quantity + ", id: " + item.product_id + ", amount: " + item.product_price + ")";

            var order_info = checkSellerName[item.seller_name + " (id: " + item.seller_id + ", email: " + seller_email + ", phone: " + kitchen_contact + ") "];
            if (order_info) {
                let total_info = order_info + ", " + item.product_name + product_info;
                checkSellerName[item.seller_name + " (id: " + item.seller_id + ", email: " + seller_email + ", phone: " + kitchen_contact + ") "] = total_info;
            } else {
                checkSellerName[item.seller_name + " (id: " + item.seller_id + ", email: " + seller_email + ", phone: " + kitchen_contact + ") "] = item.product_name + product_info;
            }
        });

        var profile_detail = Profile_details.findOne({user_id: Meteor.userId()}),
            foodie_name = profile_detail.foodie_name,
            foodies_no = profile_detail.mobile,
            info_buyer = foodie_name + " (id: " + Meteor.userId() + ", email: " + Meteor.user().emails[0].address + ", phone: " + foodies_no + ")";

        for (var chefName in checkSellerName) {
            if (checkSellerName.hasOwnProperty(chefName)) {
                var message = "blueplate notification: " + info_buyer + " has just placed " + checkSellerName[chefName] + " from " + chefName;

                Meteor.call('message.sms', "+84989549437", message.trim(), (err, res) => {
                  if (!err) {
                    console.log('Message sent');
                  }
                });

                var content_message = '\nBuyer infor : ' + info_buyer + '\nSeller infor: ' + chefName + 
                                        '\nProduct infor: ' + checkSellerName[chefName];

                // Send email
                if (!util.filterEmailInternalForNotification()) {
                    Meteor.call(
                        'marketing.create_task_asana',
                        '852791235008277', // projects_id to create task
                        'Buyer : ' + foodie_name,
                        content_message
                    );
                }
            }
        }
    };

    componentDidMount() {
        $(window).scrollTop(0);

        if (Meteor.userId()) {
            Meteor.call('shopping_cart.find_by_buyer', Meteor.userId(), (err, res) => {
                if (!err) {
                    this.setState({ shoppingCart: res });
                }
            });
        } else {
            if (!this.state.dishesLocal) {
                this.setState({ shoppingCart: [] })
            } else {
                this.setState({ shoppingCart: this.state.dishesLocal });
            }
        }

        //- send to Facebook Pixel
        if (location.hostname == 'www.blueplate.co' && !util.filterEmailInternalForNotification()) {
            fbq('track', 'ViewContent', { content_name: 'Shopping Cart', content_ids: Meteor.userId() });
        }
        // check if have already cookies, create a promotion balance for this user
        if (getCookie('promotion')) {
            let amount = parseInt(getCookie('promotion').replace( /^\D+/g, ''));
            if (Meteor.userId()) {
                Meteor.call('promotion.check_history', (err, res) => {
                    if (Object.keys(res).length == 0) { // this user not already have promotion before
                        Meteor.call('promotion.insert_history', Meteor.userId(), getCookie('promotion'), amount, (err, res) => {
                            if (!err) {
                                delete_cookies('promotion');
                                console.log('OK');
                            }
                        });
                    } else {
                        this.setState({ discount: res.balance });
                    }
                });
            } else {
                this.setState({ discount: amount });
            }
        }
    }

    componentWillUpdate() {
        //- run google places autocomplete with timeout to make sure HTML is rendered
        setTimeout(() => {
            var input = document.getElementsByClassName('address');
            for (i = 0; i < input.length; i++) {
                var autocomplete = new google.maps.places.Autocomplete(input[i]);
            }
        }, 500);
    }

    handleBackToShopping() {
        this.setState({ bGetInforUser: false});
    };

    handleOnSaveOrderingInfo() {
        this.setState({ bExistAccount: false }, () => {
           this.handleCheckout(); 
        });
    };

    render() {
        var total = 0,
            subtotal = 0;

        if (this.state.shoppingCart) {
            for (var i = 0; i < this.state.shoppingCart.length; i++ ) {
                subtotal += parseFloat(this.state.shoppingCart[i].total_price_per_dish);
                if (checking_promotion_dish(this.state.shoppingCart[i].product_id).length > 0) {
                    total += parseFloat(this.state.shoppingCart[i].total_price_per_dish * get_amount_promotion(this.state.shoppingCart[i].product_id))
                } else {
                    total += parseFloat(this.state.shoppingCart[i].total_price_per_dish);
                }
            }
        }

        if (this.state.discount > 0) {
            total = total - this.state.discount;
            if (total < 0) {
                total = 0;
            }
        }
        subtotal = subtotal.toFixed(2);
        total = total.toFixed(2);

        return (
            <div className="container shopping-cart-details">
                <ProgressBar step_progress="1" />

                <div className="row">

                { !this.state.bGetInforUser ?
                        <span>
                            <div className="col s12 m8 l8">
                                {
                                    (this.props.listLoading) ?
                                        <span>Loading...</span>
                                    :    
                                        this.renderListKitchen()
                                }
                            </div>

                            {
                                (this.state.shoppingCart.length > 0) ? 
                                    <div id="view-detail-total" className="col s12 m3 l3">
                                        <div id="total-block">
                                            <div className="row subtotal">
                                                <div className="col s6 m6 text-left">Subtotal:</div>
                                                <div className="col s6 m6 text-left">HK$ { subtotal }</div>
                                            </div>

                                            <div className="row discount">
                                                <div className="col s6 m6 text-left">Discount:</div>
                                                <div className="col s6 m6 text-left">HK$ { this.state.discount }</div>
                                            </div>

                                            <div className="row total">
                                                <div className="col s6 m6 text-left total-text">Total:</div>
                                                <div className="col s6 m6 text-left bp-blue-text">HK$ { total }</div>
                                            </div>
                                            <div className="row text-center btn-shopping-cart">
                                                <button id="checkout-shoppingcart" className="btn checkout" disabled={this.state.shoppingCart.length == 0} onClick={ () => this.handleGetInfor() } >next</button>
                                                <p className="no-charge-money">You won’t be charged yet !</p>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                        ''
                            }
                        </span>
                    :
                        <InfoOrder order_obj={this.state.order_obj}
                            handleOnSaveOrderingInfo={() => this.handleOnSaveOrderingInfo()}
                            handleBackToShopping={() => this.handleBackToShopping()}
                        />
                    }

                </div>
            </div>
        )
    }
}

export default withTracker(props => {
    console.time('Start tracker shopping cart');
    Meteor.subscribe('userEmail');
    const handle = Meteor.subscribe('getUserShoppingCart');
    if (handle.ready()) {
        console.timeEnd('Start tracker shopping cart');
    }
    return {
        currentUser: Meteor.user(),
        listLoading: !handle.ready(),
    };
})(ShoppingCart);


$(document).ready(function () {
    $(window).bind("scroll", function(e) {
        var top = $(window).scrollTop();
        if (53 < top && top < 1360) {
          $("#view-detail-total").addClass("cart-scroll-fix-top");
        } else {
          $("#view-detail-total").removeClass("cart-scroll-fix-top");
        } 

        // if (top > 1091) {
        //     $("#detail-dish-info").addClass("dish-scroll-bottom");
        // } else {
        //     $("#detail-dish-info").removeClass("dish-scroll-bottom");
        // }
    });
});