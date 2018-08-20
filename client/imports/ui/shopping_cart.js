import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import ProgressiveImages from './progressive_image';
import ChefAvatar from '../ui/chef_avatar';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

//- empty cart store global in this page
window.globalCart = [];
// var kitchen = { id: item, service: "", date: "", time: "", timeStamp: "", address: "" };

// Shopping cart component
class ShoppingCart extends Component {
    constructor(props) {
        super(props);
        this.renderListKitchen = this.renderListKitchen.bind(this);
        this.renderKitchen = this.renderKitchen.bind(this);
        this.handleChangeServiceOption = this.handleChangeServiceOption.bind(this);
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
                }
            }
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
    }

    // when change address for kitchen
    handleChangeAddress(event, seller_id) {
        for (var i = 0; i < globalCart.length; i++) {
            if (globalCart[i].id == seller_id) {
                globalCart[i].address = $("#address_" + seller_id).val();
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
        }
    }

    // when user click checkout button
    handleCheckout() {
        var valid = true;
        globalCart.forEach((item, index) => {
            item.address = $('#address_' + item.id).val();
        });
        globalCart.forEach((item, index) => {
            for( var key in item ) {
                if (item[key] == '') {
                    $('#address_' + item.id).addClass('invalid');
                    Materialize.toast('Oops! Please complete your address.', '3000', 'rounded bp-green');
                    $('#address_' + item.id).prepend($('#address_' + item.id));
                    $('#address_' + item.id).focus();
                    valid = false;
                    return false;
                } else {
                    $('#address_' + item.id).removeClass('invalid');
                }
            }
            if (valid) {
                Session.set('product', globalCart);
            }
        });
        if (valid) {
            console.log(globalCart);
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
            FlowRouter.go('/payment');
        }
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
                        <div className="col s3 m3 l1 xl1">
                            <div className="detail-thumbnail" style={{ backgroundImage: "url(" + detail.meta.large + ")" }} ></div>
                        </div>
                        <div className="col s9 m9 l11 xl11 product-info">
                            <span className="fa fa-times remove-item" onClick={ () => this.removeItem(item._id) }></span>
                            <span className="detail-title">{ detail.dish_name }</span>
                            <span className="detail-price">HK${ detail.dish_selling_price }</span>
                            <div className="quantity-control">
                                <span onClick={ () => this.decreaseQty(item._id) }>-</span>
                                <span>{ item.quantity }</span>
                                <span onClick={ () => this.increaseQty(item._id) }>+</span>
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
        var subtotal = 0;
        var curr = new Date();
        curr.setDate(curr.getDate());
        var date = curr.toISOString().substr(0,10);
        for (var i = 0; i < product.length; i++) {
            subtotal += parseFloat(product[i].total_price_per_dish);
        }
        return (
            <div key={index}>
                <div className="row kitchen-name">
                    { sellerName }'s kitchen
                    <ChefAvatar userId={seller_id} />
                </div>
                <div className="row">
                    <div className="col s4">
                        <select className="browser-default no-border" onChange={(event) => this.handleChangeServiceOption(event, seller_id)} >
                            <option value="" disabled selected>Service Options</option>
                            { this.renderServingOption(seller_id) }
                        </select>
                    </div>
                    <div className="col s4">
                        <input defaultValue={ date } id="date" type="date" placeholder="date" onChange={(event) => this.handleChangeDate(event, seller_id)} />
                    </div>
                    <div className="col s4 no-background">
                        <TimePicker
                            showSecond={false}
                            className=""
                            defaultValue={moment().add(1, 'hours')}
                            onChange={(value) => this.handleChangeTime(value, seller_id)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <label htmlFor={"address_" + seller_id} id={"label_" + seller_id}></label>
                        <input id={"address_" + seller_id} name={"address_" + seller_id} className="address" placeholder=" " type="text" onChange={(event) => this.handleChangeAddress(event, seller_id)} />
                    </div>
                </div>
                { this.renderSingleProduct(product) }
                <div className="row subtotal">
                    <div className="col s4 text-left">subtotal</div>
                    <div className="col s8 text-right">HK${ subtotal }</div>
                </div>
            </div>
        )
    }

    renderListKitchen() {
        //- get unique seller_id
        globalCart = [];
        let unique = [...new Set(this.props.shoppingCart.map(item => item.seller_id))];
        if (unique.length > 0) {
            return (
                unique.map((item, index) => {
                    //- create new object to store all information about this kitchen
                    var kitchen = { id: item, service: "", date: moment(event.target.value).format('DD/MM/YYYY'), time: moment().add(1, 'hours').format('HH:mm'), timeStamp: moment().add(moment.duration(1, 'hours')).valueOf(), address: "" };
                    globalCart.push(kitchen);
                    return this.renderKitchen(item, index);
                })
            )
        } else {
            return <h5>Shopping cart is empty</h5>
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

    render() {
        var total = 0;
        for (var i = 0; i < this.props.shoppingCart.length; i++ ) {
            total += parseFloat(this.props.shoppingCart[i].total_price_per_dish);
        }
        Session.set('product', '');
        return (
            <div className="container">
                <h3>Order summary</h3>
                {
                    (this.props.listLoading) ?
                        <span>Loading...</span>
                    :    
                        this.renderListKitchen()
                }
                <div className="row total">
                    <div className="col s4 text-left">Total</div>
                    <div className="col s8 text-right">HK${ total }</div>
                </div>
                <div className="row text-center">
                    <button className="btn checkout" disabled={this.props.shoppingCart.length == 0} onClick={ () => this.handleCheckout() } >Checkout</button>
                </div>
            </div>
        )
    }
}

export default withTracker(props => {
    const handle = Meteor.subscribe('getUserShoppingCart');
    return {
        currentUser: Meteor.user(),
        listLoading: !handle.ready(),
        shoppingCart: Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch(),
    };
})(ShoppingCart);