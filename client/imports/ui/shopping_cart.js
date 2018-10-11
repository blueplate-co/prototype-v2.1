import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import ChefAvatar from '../ui/chef_avatar';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { checking_promotion_dish, get_amount_promotion } from '/imports/functions/common/promotion_common';
import { delete_cookies, getCookie } from '/imports/functions/common/promotion_common';
import ProgressBar from './progress_bar.js';

//- empty cart store global in this page
window.globalCart = localStorage.getItem("globalCart");
// var kitchen = { id: item, service: "", date: "", time: "", timeStamp: "", address: "" };

// Shopping cart component
class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        this.renderListKitchen = this.renderListKitchen.bind(this);
        this.renderKitchen = this.renderKitchen.bind(this);
        this.handleChangeServiceOption = this.handleChangeServiceOption.bind(this);
        this.state = {
            discount: 0
        }
    }

    // remove item in shopping cart
    removeItem(id) {
        //- check again, if all products of kitchen are removed. update the global cart
        let unique = [...new Set(this.props.shoppingCart.map(item => item.seller_id))];
        globalCart = [];
        for (var i = 0; i < globalCart.length; i++) {
            for (var j = 0; j < unique.length; j++) {
                if (globalCart[i].id !== unique[j]) {
                    globalCart.splice(i, 1);
                    localStorage.setItem('globalCart', globalCart);
                }
            }
        }

        if (globalCart.length == 0) {
            localStorage.setItem('globalCart', '');
        }
        
        Meteor.call('shopping_cart.remove', id);
    }

    // increaseQty of item in shopping cart
    increaseQty(id) {
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

    // decreaseQty of item in shopping cart
    decreaseQty(id) {
        var item = Shopping_cart.find({ _id: id }).fetch()[0];
        if (item.quantity == 1) { // not allow set quantity = 0
            return true;
        }
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
        $("#select-serving-option").css("color", "rgba(0, 0, 0.87)");
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
    handleChangeTime(value, seller_id) {
        for (var i = 0; i < globalCart.length; i++) {
            if (globalCart[i].id == seller_id) {
                globalCart[i].time = value.format('HH:mm');
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
        var readytime = [];
        this.props.shoppingCart.map(function(item, index){
            var specificReadytime = moment().add(item.ready_time, 'mins').valueOf();
            readytime.push(specificReadytime);
        });

        for (var i = 0; i < readytime.length; i++) {
            if (globalCart[i].timeStamp < readytime[i]) {
                $('.rc-time-picker-input').addClass('invalid');
                Materialize.toast('Preferred Ready Time must be later than the Latest Ready Time', '3000', 'rounded bp-green');
                globalCart[i].timeStamp = '';
                return true;
            } else {
                $('.rc-time-picker-input').removeClass('invalid');
            }
        }
    }

    // when change date for kitchen
    handleChangeDate(event, seller_id) {
        for (var i = 0; i < globalCart.length; i++) {
            if (globalCart[i].id == seller_id) {
                globalCart[i].date = moment(event.target.value).format('DD/MM/YYYY');
                // use old code from Michael to store preferred_time_ms
                var yyyy = globalCart[i].date[6] + globalCart[i].date[7] + globalCart[i].date[8] + globalCart[i].date[9]
                var mm = parseInt(globalCart[i].date[3] + globalCart[i].date[4]) - 1
                var dd = globalCart[i].date[0] + globalCart[i].date[1]
                var hh = globalCart[i].time[0] + globalCart[i].time[1]
                var min = globalCart[i].time[3] + globalCart[i].time[4]
                serve_date = new Date(yyyy, mm, dd, hh, min);
                serve_date = Date.parse(serve_date);
                globalCart[i].timeStamp = serve_date;
            }

        }

        var readytime = [];
        this.props.shoppingCart.map(function(item, index){
            var specificReadytime = moment().add(item.ready_time, 'mins').valueOf();
            readytime.push(specificReadytime);
        });

        for (var i = 0; i < readytime.length; i++) {
            if (globalCart[i].timeStamp < readytime[i]) {
                $('#date').addClass('invalid');
                Materialize.toast('Preferred Ready Time must be later than the Latest Ready Time', '3000', 'rounded bp-green');
                globalCart[i].timeStamp = '';
                return true;
            } else {
                $('#date').removeClass('invalid');
            }
        }
        $("#date").css("color", "rgba(0, 0, 0.87)");
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
        globalCart.forEach((item, index) => {
            for( var key in item ) {
                if (item[key] == '' && key == 'service') {
                    valid = false;
                    this.scrollToFieldRequired('select-serving-option');
                    Materialize.toast('Oops! Please select your service to get your food.', '3000', 'rounded bp-green');
                    return false;
                }

                if (item[key] == '' && key == 'address') {
                    $('#address_' + item.id).addClass('invalid');
                    Materialize.toast('Oops! Please complete your delivery address.', '3000', 'rounded bp-green');
                    this.scrollToFieldRequired('address_' + item.id);
                    valid = false;
                    return false;
                } else {
                    $('#address_' + item.id).removeClass('invalid');
                }

                if ((item[key] == 'Invalid date' || item[key] == '') && key == 'date') {
                    valid = false;
                    this.scrollToFieldRequired('date');
                    Materialize.toast('Oops! Please select your date would you like to be served.', '3000', 'rounded bp-green');
                    return false;
                }

                if (item[key] == '' && key == 'time') {
                    valid = false;
                    this.scrollToFieldRequired('date');
                    Materialize.toast('Oops! Please select your time.', '3000', 'rounded bp-green');
                    return false;
                }


            }
            if (valid) {
                localStorage.setItem('globalCart', JSON.stringify(globalCart));
                Session.set('product', globalCart);
                // globalCart = [];
            }
        });

        return valid;
    }

    // when user click checkout button
    handleCheckout() {
        globalCart.forEach((item, index) => {
            item.address = $('#address_' + item.id).val();
        });
        
        var valid = this.validateShoppingCartCheckOut();

        if (valid) {
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
            
            //- send to Facebook Pixel
            if (location.hostname == 'www.blueplate.co') {
                this.sendSummaryCheckoutDish();
                fbq('track', 'InitiateCheckout', { content_ids: Meteor.userId(), contents: globalCart, num_items: globalCart.length });
            }
            FlowRouter.go('/payment');
        }
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
                            <span className="fa fa-times remove-item" onClick={ () => this.removeItem(item._id) }></span>
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
                                <span onClick={ () => this.decreaseQty(item._id) }><i className="fa fa-minus-circle quantity-icon-format"></i></span>
                                <span>{ item.quantity }</span>
                                <span onClick={ () => this.increaseQty(item._id) }><i className="fa fa-plus-circle quantity-icon-format"></i></span>
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

    renderKitchen(seller_id, index) {
        var product = Shopping_cart.find({ seller_id: seller_id }).fetch();
        var sellerName = product[0].seller_name;
        var curr = new Date();
        var seller_images = '';
        var kitchen_id = '';
        curr.setDate(curr.getDate());
        var address = globalCart[index].address,
            defaultTimePicker = globalCart[index].time,
            defaultDate = this.formatDateOrder(globalCart[index].date);

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
                            <select id="select-serving-option" className="browser-default no-border drop-down-servicing" defaultValue={globalCart[index].service} onChange={(event) => this.handleChangeServiceOption(event, seller_id)} >
                                <option value="" disabled>How would you like to get your food?</option>
                                { this.renderServingOption(seller_id) }
                            </select>
                        </div>

                        <div className="input-field col s12 m12 l12 icon-position-common">
                            <i className="material-icons prefix location-address icon-cart-format">location_on</i>
                            <input id={"address_" + seller_id} name={"address_" + seller_id} defaultValue={address} className="address" placeholder="Let’s input your delivery address" type="text" 
                                onChange={(event) => this.handleChangeAddress(event, seller_id)} />
                            {/* <label htmlFor={"address_" + seller_id} id={"label_" + seller_id}></label> */}
                        </div>

                        
                        <div className="input-field col s12 m12 l12 icon-position-common date-summary">
                            <i className="material-icons prefix location-address icon-cart-format">date_range</i>
                            <input id="date" type="date" onChange={(event) => this.handleChangeDate(event, seller_id)} />
                            <label htmlFor="date"></label>
                        </div>
                        <div className="col s12 m12 l12 no-background time-cart">
                            <i className="material-icons prefix time-cart-icon icon-cart-format">timer</i>
                            <TimePicker
                                showSecond={false}
                                className=""
                                // defaultValue={!defaultTimePicker ? '' : moment(defaultTimePicker, "HH:mm")}
                                onChange={(value) => this.handleChangeTime(value, seller_id)}
                                focusOnOpen={true}
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
        globalCart = localStorage.getItem("globalCart");
        var hasLocalStorage = false;
        if (typeof globalCart != 'object' && globalCart != "" ) {
            hasLocalStorage = true;
            globalCart = JSON.parse(globalCart);
        }

        let unique = [...new Set(this.props.shoppingCart.map(item => item.seller_id))];
        if (unique.length > 0) {
            return (
                unique.map((item, index) => {
                    //- create new object to store all information about this kitchen
                    var kitchen = { id: item, service: "", date: moment(null).format('DD/MM/YYYY'), time: "", timeStamp: '', address: "" };
                    if (!hasLocalStorage) {
                        hasLocalStorage = true;
                        globalCart = [];
                    }

                    if (globalCart.length > 0) {
                        globalCart.map( (cartItem, idx) => {
                            if (cartItem.id != item ) {
                                globalCart.push(kitchen);
                            }
                        });
                    } else {
                        globalCart.push(kitchen);
                    }

                    return this.renderKitchen(item, index);
                })
            )
        } else {
            return <h5>Shopping cart is empty</h5>
        }
    }

    // Internal sms: send order info message to admin when has new order
    sendSummaryCheckoutDish() {
        var checkSellerName ={};
        this.props.shoppingCart.map( (item, index) => {
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
                Meteor.call(
                    'marketing.create_task_asana',
                    '852791235008277', // projects_id to create task
                    'Buyer : ' + foodie_name,
                    content_message
                );
            }
        }
    };

    componentDidMount() {
        $(window).scrollTop(0);
        //- send to Facebook Pixel
        if (location.hostname == 'www.blueplate.co') {
            fbq('track', 'ViewContent', { content_name: 'Shopping Cart', content_ids: Meteor.userId() });
        }
        // check if have already cookies, create a promotion balance for this user
        if (getCookie('promotion')) {
            Meteor.call('promotion.check_history', (err, res) => {
                if (Object.keys(res).length == 0) { // this user not already have promotion before
                    Meteor.call('promotion.insert_history', Meteor.userId(), 'HKD50', (err, res) => {
                        if (!err) {
                            delete_cookies('promotion');
                            console.log('OK');
                        }
                    });
                }
            });
        }
        Meteor.call('promotion.check_history', (err, res) => {
            if (Object.keys(res).length > 0) {
                this.setState({
                    discount: res.balance
                })
            } else {
                this.setState({
                    discount: 0
                })
            }
        });
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

    render() {
        var total = 0,
            subtotal = 0;
        for (var i = 0; i < this.props.shoppingCart.length; i++ ) {
            subtotal += parseFloat(this.props.shoppingCart[i].total_price_per_dish);
            if (checking_promotion_dish(this.props.shoppingCart[i].product_id).length > 0) {
                total += parseFloat(this.props.shoppingCart[i].total_price_per_dish * get_amount_promotion(this.props.shoppingCart[i].product_id))
            } else {
                total += parseFloat(this.props.shoppingCart[i].total_price_per_dish);
            }
        }
        if (this.state.discount > 0) {
            total = total - this.state.discount;
            if (total < 0) {
                total = 0;
            } else {
                total = total.toFixed(2);
            }
        }
        Session.set('product', '');

        return (
            <div className="container">
                <ProgressBar step_progress="1" />
                {
                    (this.props.listLoading) ?
                        <span>Loading...</span>
                    :    
                        this.renderListKitchen()
                }

                <div className="row subtotal">
                    <div className="col s6 m9 text-right">Subtotal:</div>
                    <div className="col s6 m3 text-right">HK$ { subtotal }</div>
                </div>

                <div className="row discount">
                    <div className="col s6 m9 text-right">Discount:</div>
                    <div className="col s6 m3 text-right">HK$ { this.state.discount }</div>
                </div>

                <div className="row total">
                    <div className="col s6 m9 text-right total-text">Total:</div>
                    <div className="col s6 m3 text-right bp-blue-text">HK$ { total }</div>
                </div>
                <div className="row text-center">
                    <button className="btn checkout" disabled={this.props.shoppingCart.length == 0} onClick={ () => this.handleCheckout() } >Checkout</button>
                    <p className="no-charge-money">You won’t be charged yet !</p>
                </div>
            </div>
        )
    }
}

export default withTracker(props => {
    Meteor.subscribe('userEmail');
    const handle = Meteor.subscribe('getUserShoppingCart');
    var discount = 0;
    return {
        currentUser: Meteor.user(),
        listLoading: !handle.ready(),
        shoppingCart: Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch(),
        discount: discount
    };
})(ShoppingCart);