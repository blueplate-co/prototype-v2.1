import React, { Component } from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';

export class PaymentStripeForm extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            bdisableSubmit: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    };

    handleSubmit = (ev) => {
        //- send to Facebook Pixel
        if (location.hostname == 'www.blueplate.co' && !util.filterEmailInternalForNotification()) {
            fbq('trackCustom', 'SelectPayment', { content_name: 'Credits Card', content_ids: Meteor.userId() });
        }
        util.show_loading_progress();
        ev.preventDefault();
        if (this.props.stripe) {
            const errorElement = document.getElementById('card-errors');
             this.props.stripe
                .createToken()
                .then((token) => {
                    if (token.error) {
                        util.hide_loading_progress();
                        // Inform the customer that there was an error.
                        errorElement.textContent = token.error.message;
                    } else {
                        Meteor.call('payment.addCard', token.token.id, (err, res) => {
                            if (res.id) {
                                // Send the token to server.
                                util.hide_loading_progress();
                                localStorage.setItem('sTotalAmount' + Meteor.userId(), 0);
                                this.props.handlePayment(token);
                            } else if (res.code) { // If error
                                util.hide_loading_progress();
                                errorElement.textContent = res.message;
                            }
                        });
                    }
                })
        } else {
          console.log("Stripe.js hasn't loaded yet.");
        }
    };

    handleChange = (event) => {
        var displayError = document.getElementById('card-errors');
        if (event.error) {
            this.setState({ bdisableSubmit: true });
            displayError.textContent = event.error.message;
        } else {
            this.setState({ bdisableSubmit: false });
            displayError.textContent = '';
        }
    };

    render = () => {
        var sTotalAmount = this.props.sTotalAmount;
        var fee = parseFloat((sTotalAmount * 0.034) + 2.35).toFixed(2);

        return (
            <div className="container container-stripe-form">
                <form onSubmit={this.handleSubmit}>
                    <div id="payment-form">
                        <div className="checkout">
                            <div className="form-row inline">
                                <div className="">
                                    <label htmlFor="name" style={{color:'rgba(0, 0, 0, 0.87)'}}>Name</label>
                                    <input id="name_holder_form" name="name" placeholder="card holder name" required />
                                </div>
                            </div>
                            <label style={{color:'rgba(0, 0, 0, 0.87)'}}>Credit or debit card</label>
                            <CardElement onChange={(event) => this.handleChange(event)}/>

                            {/* Used to display form errors */}
                            <div id="card-errors" role="alert"></div>

                            <div className="col payment-number s12 m12 l12 xl12">
                                <img id="payment-stripe-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/stripe.svg" />
                                <img id="payment-mastercard-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/MasterCard+2.svg" />
                                <img id="payment-visa-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/VISA.svg" />
                            </div>

                            <div className="row total-fee-payment">
                                <p className="text-right total-text-payment">Amount: <span className="bp-blue-text total-amount-payment">HK$ {sTotalAmount}</span></p>
                                <p  className="text-right fee-text-payment">Processing fee: <span className="bp-blue-text total-fee-payment">HK$ {fee}</span></p>
                            </div>

                            <div style={{"textAlign":"center"}}>
                                <button id="payment-stripe-form" disabled={this.state.bdisableSubmit ? true : false }>pay now</button>
                                <p id="payment-infor-text">You will only be charged when chef confirm your order</p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    };
}

export default injectStripe(PaymentStripeForm);
