import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import { show_loading_progress, hide_loading_progress } from '/imports/functions/common';

class Modal extends React.Component {

	static propTypes = {
		isModalOpen: React.PropTypes.bool.isRequired,
		closeModal: React.PropTypes.func.isRequired,
		style: React.PropTypes.shape({
			modal: React.PropTypes.object,
			overlay: React.PropTypes.object
		})
	};

	constructor(props) {
		super(props);

		this.outerStyle = {
			position: 'fixed',
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			overflow: "auto",
			height: "100%",
			zIndex: 999
		};

		// default style
		this.style = {
			modal: {
				position: "relative",
				width: 500,
				padding: 20,
				boxSizing: 'border-box',
                backgroundColor: '#fff',
                color: '#000',
				margin: '40px auto',
				borderRadius: 3,
				zIndex: 998,
				textAlign: 'left',
				boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
				...this.props.style.modal,
			},
			overlay: {
				position: 'fixed',
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
				width: "100%",
				height: "100%",
                backgroundColor: 'rgba(0,0,0,0.5)',
                textAlign: 'center',
				...this.props.style.overlay
			}
		}
	}

	// render modal
	render() {
		return (<div style={{...this.outerStyle, display: this.props.isModalOpen ? 'block' : 'none'}}>
						<div style={this.style.overlay} onClick={this.props.closeModal}></div>
												<div onClick={this.props.closeModal}></div>
                <div style={this.style.modal}>
                    {this.props.children}
                </div>
            </div>)
	}
}

// overwrite style
const modalStyle = {
	overlay: {
        backgroundColor: 'rgba(0, 0, 0,0.5)'
	}
};

const mainStyle = {
	app: {
		margin: '120px 0'
	},
	button: {
		backgroundColor: '#408cec',
		border: 0,
		padding: '12px 20px',
		color: '#fff',
		margin: '0 auto',
		width: 150,
		display: 'block',
		borderRadius: 3
	}
};

// Shopping cart component
class Payment extends Component {
    constructor(props) {
        super(props);
        this.renderPaymentSelect = this.renderPaymentSelect.bind(this);
        this.choosePayment = this.choosePayment.bind(this);
        this.validationCardAndCharge = this.validationCardAndCharge.bind(this);
        this.validationAndCredits = this.validationAndCredits.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.openModal = this.openModal.bind(this);
        this.state = {
            payment: "",
            creditPackage: "",
            action: false,
            isModalOpen: false,
            isInnerModalOpen: false,
            pendingCost: 0
        }
    }

        // close modal (set isModalOpen, true)
	closeModal() {
		this.setState({
			isModalOpen: false
		})
	}

	// open modal (set isModalOpen, false)
	openModal() {
		this.setState({
			isModalOpen: true
		})
	}

    componentDidMount() {
        if (!Session.get('product')) {
            Materialize.toast('Please complete your order before.', 'rounded bp-green');
            FlowRouter.go('/shopping_cart');
            return true;
        }
    }

    choosePayment(payment) {
        show_loading_progress();
        if (payment == 'credits') {
            // get current credits of user
            Meteor.call('payment.getCredits', (err, credits) => {
                var shoppingCart = Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch();
                var total = 0;
                for (var i = 0; i < shoppingCart.length; i++) {
                    total += parseFloat(shoppingCart[i].total_price_per_dish);
                }
                // get Stripe balance
                Meteor.call('payment.getStripeBalance', (err, res) => {
                    let balance = parseFloat(res.account_balance / 100).toFixed(2);
                    // check pending order of buyer
                    var pendingOrder = Order_record.find({
                        buyer_id: Meteor.userId(),
                        status: 'Created'
                    }).fetch();
                    var pendingCost = 0;
                    for (var i = 0; i < pendingOrder.length; i++) {
                        pendingCost += pendingOrder[i].total_price;
                    }
                    var trueBalance = (parseFloat(credits) + parseFloat(balance)) - parseFloat(pendingCost);
                    // sum of two wallet is not enough to pay
                    if (trueBalance < total) {
                        // not enough money to pay
                        this.setState({
                            pendingCost: parseFloat(pendingCost.toString())
                        },() => {
                            this.openModal();
                        })
                        // Materialize.toast('Not enough credits to pay.', 'rounded bp-green');
                        // self.setState({
                        //     payment: payment
                        // });
                    } else {
                        // enough money to pay
                        var StripeToken = '';
                        var transaction_no = 1;
                        //- add each every product into order collection
                        var shoppingCart = Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch();
                        shoppingCart.map(function (item, index) {
                            var kitchenOrderInfo;
                            //- get information order which user set in previous step
                            for (var i = 0; i < Session.get('product').length; i++) {
                                if (item.seller_id == Session.get('product')[i].id) {
                                    kitchenOrderInfo = Session.get('product')[i];
                                }
                            }

                            var transaction = Transactions.findOne({ 'buyer_id': Meteor.userId(), 'seller_id': kitchenOrderInfo.id }, { sort: { transaction_no: -1 } });
                            if (transaction) {
                                transaction_no = parseInt(transaction.transaction_no) + 1
                            }
                            // no need add card because, if user has credit, thet must have already credit card
                            Meteor.call('order_record.insert', transaction_no, Meteor.userId(), item.seller_id, item.product_id, item.quantity, item.total_price_per_dish, kitchenOrderInfo.address, kitchenOrderInfo.service, kitchenOrderInfo.timeStamp, StripeToken, 'credits', function (err, response) {
                                if (err) {
                                    Materialize.toast('Oops! Error occur. Please try again.' + err, 4000, 'rounded bp-green');
                                } else {
                                    Meteor.call('shopping_cart.remove', item._id);
                                    Meteor.call('notification.place_order', item.seller_id, Meteor.userId(), item.product_id, item.quantity);
                                    Session.clear;
                                    Materialize.toast("Your order has been sent to chef. Please wait for chef's confirmation and track your order here.", 8000, 'rounded bp-green');
                                    FlowRouter.go('/orders_tracking');
                                }
                            })
                        })
                    }
                    hide_loading_progress();
                });
            });
        } else {
            // if choose credit card is payment method
            this.setState({
                payment: payment
            });
            hide_loading_progress();
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
        }, function (status, response) {
            if (response.error) {
                Materialize.toast(response.error.message, 'rounded bp-green');
            } else {
                // use Stripetoken to add this card into Customer account
                Meteor.call('payment.addCard', response.id);
                console.log('Package to choose' + creditPackage);
                Meteor.call('payment.depositCredits', creditPackage, Meteor.userId(), function (err, response) {
                    if (err) {
                        console.log(err);
                        Materialize.toast(err.message, 'rounded bp-green');
                        this.setState({
                            action: false
                        })
                    } else {
                        // complete add to credits and charge credit card
                        // enough money to pay
                        var StripeToken = '';
                        var transaction_no = 1;
                        //- add each every product into order collection
                        var shoppingCart = Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch();
                        shoppingCart.map(function (item, index) {
                            var kitchenOrderInfo;
                            //- get information order which user set in previous step
                            for (var i = 0; i < Session.get('product').length; i++) {
                                if (item.seller_id == Session.get('product')[i].id) {
                                    kitchenOrderInfo = Session.get('product')[i];
                                }
                            }
                            var transaction = Transactions.findOne({ 'buyer_id': Meteor.userId(), 'seller_id': kitchenOrderInfo.id }, { sort: { transaction_no: -1 } });
                            if (transaction) {
                                transaction_no = parseInt(transaction.transaction_no) + 1
                            }
                            // no need add card because, if user has credit, thet must have already credit card
                            Meteor.call('order_record.insert', transaction_no, Meteor.userId(), item.seller_id, item.product_id, item.quantity, item.total_price_per_dish, kitchenOrderInfo.address, kitchenOrderInfo.service, kitchenOrderInfo.timeStamp, StripeToken, 'credits', function (err, response) {
                                if (err) {
                                    Materialize.toast('Oops! Error occur. Please try again.' + err, 4000, 'rounded bp-green');
                                    this.setState({
                                        action: false
                                    })
                                } else {
                                    Meteor.call('shopping_cart.remove', item._id)
                                    Meteor.call('notification.place_order', item.seller_id, Meteor.userId(), item.product_id, item.quantity);
                                    Session.clear;
                                    Materialize.toast("Credit added sucessfully, we are now processing your order. please wait for chef's confirmation", 8000, 'rounded bp-green');
                                    FlowRouter.go('/orders_tracking');
                                }
                            })
                        })
                    }
                })
            }
        })
    }

    validationCardAndCharge() {
        ccNum = $('#card_no').val();
        cvc = $('#cvc_no').val();
        expMo = $('#exp_month').val();
        expYr = $('#exp_year').val();

        this.setState({
            action: true
        })

        // validation card info
        Stripe.card.createToken({
            number: ccNum,
            cvc: cvc,
            exp_month: expMo,
            exp_year: expYr,
        }, function (status, response) {
            if (response.error) {
                Materialize.toast(response.error.message, 'rounded bp-green');
                this.setState({
                    action: false
                })
            } else {
                var StripeToken = response.id;
                var transaction_no = 1;
                //- add each every product into order collection
                var shoppingCart = Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch();
                shoppingCart.map(function (item, index) {
                    var kitchenOrderInfo;
                    //- get information order which user set in previous step
                    for (var i = 0; i < Session.get('product').length; i++) {
                        if (item.seller_id == Session.get('product')[i].id) {
                            kitchenOrderInfo = Session.get('product')[i];
                        }
                    }

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
                    <div className="container" style={{ paddingTop: '40px' }} onKeyDown={
                        (event) => {
                            if (event.keyCode == 13) {
                                this.validationCardAndCharge()
                            }
                        }
                    }>
                        <div className="row">
                            <span id="back-payment" className="fa fa-arrow-left" onClick={() => this.backPayment()}></span>
                        </div>
                        <div className="row">
                            <h2>Lets add more credits</h2>
                        </div>
                        <div className="row credit-title">
                            <div className="col s6 text-left">Credit balance:</div>
                            <div className="col s6 text-right">${Session.get('credits')}</div>
                        </div>
                        <div className="row">
                            <div className="col s4 m4 l4 xl4 credit-option">
                                <span className={(this.state.creditPackage == 1) ? 'credit-wrapper active' : 'credit-wrapper'} onClick={() => this.setState({ creditPackage: 1 })}>
                                    <p>$250</p>
                                </span>
                                <span className="bonus">get $10 free</span>
                            </div>
                            <div className="col s4 m4 l4 xl4 credit-option">
                                <span className={(this.state.creditPackage == 2) ? 'credit-wrapper active' : 'credit-wrapper'} onClick={() => this.setState({ creditPackage: 2 })}>
                                    <p>$500</p>
                                </span>
                                <span className="bonus">get $50 free</span>
                            </div>
                            <div className="col s4 m4 l4 xl4 credit-option">
                                <span className={(this.state.creditPackage == 3) ? 'credit-wrapper active' : 'credit-wrapper'} onClick={() => this.setState({ creditPackage: 3 })}>
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
                                <button className="btn" disabled={this.state.action} onClick={() => this.validationAndCredits()} style={{ marginTop: '30px' }}>Next</button>
                            </div>
                        </div>
                    </div>
                )
                break;
            case 'credit-card':
                return (
                    <div className="container" style={{ paddingTop: '40px' }} onKeyDown={
                        (event) => {
                            if (event.keyCode == 13) {
                                this.validationCardAndCharge()
                            }
                        }
                    }>
                        <div className="row">
                            <span id="back-payment" className="fa fa-arrow-left" onClick={() => this.backPayment()}></span>
                        </div>
                        <div className="row">
                            <h2>Your card details</h2>
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
                                <button className="btn" disabled={this.state.action} onClick={() => this.validationCardAndCharge()} style={{ marginTop: '30px' }}>Next</button>
                            </div>
                        </div>
                    </div>
                )
                break;
        }
    }

    backPayment() {
        this.setState({
            payment: ""
        })
    }

    renderPaymentSelect() {
        var shoppingCart = Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch();
        var total = 0;
        for (var i = 0; i < shoppingCart.length; i++) {
            total += parseFloat(shoppingCart[i].total_price_per_dish);
        }
        var fee = parseFloat((total * 0.034) + 2.35).toFixed(2);
        return (
            <div className="container" style={{ marginTop: '50px' }}>
                <Modal
                    isModalOpen={this.state.isModalOpen}
                    closeModal={this.closeModal}
                    style={modalStyle}>
                        <span>You currently have ${this.state.pendingCost} pending order.</span><br/>
                        <span>Therefore there is no credits left for this order.</span>
                        <div className="row" style={{marginTop: '50px'}}>
                            <div className="col l6" style={{width: '50%'}}>
                                <button className="btn" onClick={ () => this.setState({ payment: 'credits' }) }>Topup</button>
                            </div>
                            <div className="col l6" style={{width: '50%'}}>
                                <button className="btn" onClick={ () => this.setState({ payment: 'credit-card' }) }>Credit Card</button>
                            </div>
                        </div>
                </Modal>
                <div className="row">
                    <div className="col s12 m12 l12 xl12" style={{ textAlign: 'center', marginBottom: '80px' }}>
                        <h6>This will be processing free charged by Payment gateway.</h6>
                        <h6>Let's save it by adding Blueplate credit!</h6>
                    </div>
                    <div className="col s12 m6 l6 xl6">
                        <div className="payment-wrapper" onClick={() => this.choosePayment('credits')}>
                            <div className="col s12 payment-method" id="credits"></div>
                            <span className="text">Credits</span>
                            <span className="sub-text">Processing fee: 0$</span>
                        </div>
                    </div>
                    <div className="col s12 m6 l6 xl6">
                        <div className="payment-wrapper" onClick={() => this.choosePayment('credit-card')}>
                            <div className="col s12 payment-method" id="card"></div>
                            <span className="text">Credit card</span>
                            <span className="sub-text">Processing fee: {fee}$</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        Meteor.call('payment.getCredits', function (err, credits) {
            Session.set('credits', credits);
        });
        return (
            (this.state.payment == "") ?
                this.renderPaymentSelect()
                : this.renderPayment(this.state.payment)
        )
    }
}

export default withTracker(props => {
    const handle = Meteor.subscribe('getUserShoppingCart');
    return {
        currentUser: Meteor.user(),
        listLoading: !handle.ready(),
        shoppingCart: Shopping_cart.find({ buyer_id: Meteor.userId() }).fetch()
    };
})(Payment);