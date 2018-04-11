import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Shopping cart component
class Payment extends Component {
    constructor(props) {
        super(props);
        this.renderPaymentSelect = this.renderPaymentSelect.bind(this);
        this.choosePayment = this.choosePayment.bind(this);
        this.validationCardAndCharge = this.validationCardAndCharge.bind(this);
        this.state = {
            payment: ""
        }
    }

    componentDidMount() {
        if (!Session.get('product')) {
            Materialize.toast('Please complete your order before.', 'rounded bp-green');
            FlowRouter.go('/shopping_cart');
            return true;
        }
    }

    choosePayment(payment) {
        if (payment == 'credits') {

        } else {
            this.setState({
                payment: payment
            });
        }
    }

    validationCardAndCharge() {
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
                Materialize.toast(response.error.message, 'rounded bp-green');
            } else {
                var StripeToken = response.id;
                var transaction_no = 1;
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

                    var transaction = Transactions.findOne({ 'buyer_id': Meteor.userId(), 'seller_id': kitchenOrderInfo.id }, { sort: { transaction_no: -1 } });
                    if (transaction) {
                        transaction_no = parseInt(transaction.transaction_no) + 1
                    }

                    Meteor.call('order_record.insert', transaction_no, Meteor.userId(), item.seller_id, item.product_id, item.quantity, item.total_price_per_dish, kitchenOrderInfo.address, kitchenOrderInfo.service, kitchenOrderInfo.timeStamp, StripeToken, function (err, response) {
                        if (err) {
                            Materialize.toast('Oops! Error occur. Please try again.' + err, 4000, 'rounded bp-green');
                        } else {
                            Meteor.call('shopping_cart.remove', item._id)
                            Meteor.call('notification.place_order', kitchenOrderInfo.id, Meteor.userId(), item.product_id, item.quantity)
                            Session.clear;
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
                    <h1>No support now</h1>
                )
                break;
            case 'credit-card':
                return (
                    <div className="container" style={{ paddingTop: '40px' }} onKeyDown = {
                            (event) => {
                                if (event.keyCode == 13) {
                                    this.validationCardAndCharge()
                                }
                            }
                        }>
                        <div className="row">
                            <h2>Your card details</h2>
                        </div>
                        <div className="row">
                            <div className="col s12 m12 l12 xl12">
                                <input type="text" placeholder="card holder name" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12 m12 l12 xl12">
                                <input id="card_no" type="number" placeholder="your credit card number" />
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
                                <button className="btn" onClick={ () => this.validationCardAndCharge() } style={{ marginTop: '30px' }}>Next</button>
                            </div>
                        </div>
                    </div>
                )
                break;
        }
    }

    renderPaymentSelect() {
        return (
            <div className="container" style={{ marginTop: '50px' }}>
                <div className="row">
                    <div className="col s12 m6 l6 xl6">
                        <div className="payment-wrapper" onClick={ () => this.choosePayment('credits') }>
                            <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/card.svg" />
                            <span className="text">Credits</span>
                        </div>
                    </div>
                    <div className="col s12 m6 l6 xl6">
                        <div className="payment-wrapper" onClick={ () => this.choosePayment('credit-card') }>
                            <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/credits.svg" />
                            <span className="text">Credit card</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            (this.state.payment == "") ?
                this.renderPaymentSelect()
            :   this.renderPayment(this.state.payment)
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
})(Payment);