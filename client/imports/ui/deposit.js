import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Shopping cart component
export default class Deposit extends Component {
    constructor(props) {
        super(props);
        this.validationAndCredits = this.validationAndCredits.bind(this);
        this.state = {
            payment: "credits",
            creditPackage: ""
        }
    }

    componentDidMount () {
        //- send to Facebook Pixel
        if (location.hostname == 'www.blueplate.co') {
            fbq('track', 'ViewContent', { content_name: 'TopupPage', content_ids: Meteor.userId() });
        }
    }

    validationAndCredits() {
        var creditPackage = this.state.creditPackage;
        this.setState({
            action: true
        })
        ccNum = $('#card_no').val();
        cvc = $('#cvc_no').val();
        expMo = $('#exp_month').val();
        expYr = $('#exp_year').val();

        // validation card info
        Stripe.card.createToken({
            number: ccNum,
            cvc: cvc,
            exp_month: expMo,
            exp_year: expYr,
        }, function(status, response) {
            if (response.error) {
                Materialize.toast(response.error.message, 4000, 'rounded bp-green');
            } else {
                // use Stripetoken to add this card into Customer account
                Meteor.call('payment.addCard', response.id);
                //- send to Facebook Pixel
                var packageValue = 0;
                switch (creditPackage) {
                    case 1:
                        packageValue = 250;
                        break;
                    case 2:
                        packageValue = 500;
                        break;
                    case 3:
                        packageValue = 1000;
                        break;
                }
                if (location.hostname == 'www.blueplate.co') {
                    fbq('trackCustom', 'SelectCreditPackage', { content_ids: Meteor.userId(), packageValue: packageValue });
                }
                Meteor.call('payment.depositCredits', creditPackage, Meteor.userId(), function(err, response){
                    if (err) {
                        console.log(err);
                        Materialize.toast(err.message, 'rounded bp-green');
                        this.setState({
                            action: false
                        })
                    } else {
                        Materialize.toast("Success! Your credits has been added", 4000, 'rounded bp-green');
                        this.setState({
                            action: false
                        });
                        close();
                    }
                })
            }
        })
    }

    getBuyerInfor() {
        var profile_detail = Profile_details.findOne({user_id: Meteor.userId()}),
            foodie_name = profile_detail.foodie_name,
            foodies_no = profile_detail.mobile,
            info_buyer = foodie_name + " (id: " + Meteor.userId() + ", email: " + Meteor.user().emails[0].address + ", phone: " + foodies_no + ")";

        return info_buyer;
    };

    getSellerInfor(seller_id) {
        var kitchen = Kitchen_details.findOne({user_id: seller_id}),
            kitchen_phone_number = kitchen.kitchen_contact,
            seller_detail = Meteor.users.findOne({_id: kitchen.user_id}),
            seller_email = seller_detail.emails[0].address,
            seller_info = kitchen.chef_name +" (id: " + kitchen._id + ", email: " + seller_email + ", phone no: " + kitchen_phone_number + ")";

        return seller_info;
    };

    validationCardAndCharge() {
        ccNum = $('#card_no').val();
        cvc = $('#cvc_no').val();
        expMo = $('#exp_month').val();
        expYr = $('#exp_year').val();
        var that = this;

        this.setState({
            action: true
        })

        // validation card info
        Stripe.card.createToken({
            number: ccNum,
            cvc: cvc,
            exp_month: expMo,
            exp_year: expYr,
        }, function(status, response) {
            if (response.error) {
                Materialize.toast(response.error.message, 'rounded bp-green');
                this.setState({
                    action: false
                })
            } else {
                var StripeToken = response.id;
                var transaction_no = 1;
                var info_buyer = that.getBuyerInfor();

                //- add each every product into order collection
                var shoppingCart = Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch();
                shoppingCart.map(function(item, index) {
                    var kitchenOrderInfo;
                    //- get information order which user set in previous step
                    for (var i = 0 ; i < Session.get('product').length; i++) {
                        if (item.seller_id == Session.get('product')[i].id) {
                            kitchenOrderInfo = Session.get('product')[i];
                        }
                    }
                    var seller_info = that.getSellerInfor(kitchenOrderInfo.id);

                    var transaction = Transactions.findOne({ 'buyer_id': Meteor.userId(), 'seller_id': kitchenOrderInfo.id }, { sort: { transaction_no: -1 } });
                    if (transaction) {
                        transaction_no = parseInt(transaction.transaction_no) + 1
                    }
                    Meteor.call('payment.addCard', StripeToken);
                    Meteor.call('order_record.insert', transaction_no, Meteor.userId(), item.seller_id, item.product_id, item.quantity, item.total_price_per_dish, kitchenOrderInfo.address, kitchenOrderInfo.service, kitchenOrderInfo.timeStamp, StripeToken, 'card', function (err, response) {
                        if (err) {
                            Materialize.toast('Oops! Error occur. Please try again.' + err, 4000, 'rounded bp-green');
                            this.setState({
                                action: false
                            })
                        } else {
                            Meteor.call('shopping_cart.remove', item._id)
                            Meteor.call('notification.place_order', item.seller_id, Meteor.userId(), item.product_id, item.quantity);
                            Session.clear;
                            Materialize.toast("Your order has been sent to chef. Please wait for chef's confirmation and track your order here.", 8000, 'rounded bp-green');

                            if (location.hostname !== 'localhost') {
                                var product_info = item.product_name + " (id: " + item.product_id + ", quantity: "  + item.quantity + ", amount: $" + item.total_price_per_dish + ")";
                                var content_message = '\nBuyer infor : ' + info_buyer + '\nSeller infor: ' + seller_info + 
                                            '\nProduct infor: ' + product_info;
    
                                // Send email
                                Meteor.call(
                                    'marketing.create_task_asana',
                                    '852791235008291', // projects_id to create task
                                    'Buyer : ' + item.buyer_name,
                                    content_message
                                );
                            }
                            
                            FlowRouter.go('/orders_tracking');
                        }
                    })
                })
            }
        })
    }

    renderPayment(payment) {
        switch (payment) {
            case 'credits':
            return (
                <div className="container" style={{ paddingTop: '40px' }} onKeyDown = {
                        (event) => {
                            if (event.keyCode == 13) {
                                this.validationCardAndCharge()
                            }
                        }
                    }>
                    <div className="row">
                        <h2>Lets add more credits</h2>
                    </div>
                    <div className="row">
                        <div className="col s4 m4 l4 xl4 credit-option">
                            <span className={ (this.state.creditPackage == 1) ? 'credit-wrapper active' : 'credit-wrapper' } onClick={ () => this.setState({ creditPackage: 1 }) }>
                                <p>$250</p>
                            </span>
                            <span className="bonus">get $10 free</span>
                        </div>
                        <div className="col s4 m4 l4 xl4 credit-option">
                            <span className={ (this.state.creditPackage == 2) ? 'credit-wrapper active' : 'credit-wrapper' } onClick={ () => this.setState({ creditPackage: 2 }) }>
                                <p>$500</p>
                            </span>
                            <span className="bonus">get $50 free</span>
                        </div>
                        <div className="col s4 m4 l4 xl4 credit-option">
                            <span className={ (this.state.creditPackage == 3) ? 'credit-wrapper active' : 'credit-wrapper' } onClick={ () => this.setState({ creditPackage: 3 }) }>
                                <p>$1000</p>
                            </span>
                            <span className="bonus">get $100 free</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12 m12 l12 xl12">
                            <input type="text" placeholder="card holder name" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col payment-number s12 m12 l12 xl12">
                            <input id="card_no" type="number" placeholder="your credit card number" />
                            <img id="visa-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/VISA.svg" />
                            <img id="mastercard-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/MasterCard+2.svg" />
                            <img id="stripe-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/stripe.svg" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s4 m4 l4 xl4">
                            <input id="exp_month" type="number" maxLength="2" size="2" placeholder="MM" />
                        </div>
                        <div className="col s4 m4 l4 xl4">
                            <input id="exp_year" type="number" maxLength="2" size="2" placeholder="YY" />
                        </div>
                        <div className="col s4 m4 l4 xl4">
                            <input id="cvc_no" type="number" maxLength="3" size="3" placeholder="CVC" />
                        </div>
                    </div>
                    <div className="row text-center">
                        <div className="col s12 m6 offset-m3 l6 offset-l3 xl6 offset-xl3">
                            <button className="btn" disabled={this.state.action} onClick={ () => this.validationAndCredits() } style={{ marginTop: '30px' }}>Next</button>
                        </div>
                    </div>
                </div>
            )
            break;
        }
    }

    render() {
        Meteor.call('payment.getCredits', function(err, credits){
            Session.set('credits', credits);
        });
        return (
            this.renderPayment(this.state.payment)
        )
    }
}