import React, { Component } from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';

var stripe = Stripe('pk_live_mqXbgtwXmodOMRSKycYVgsl6');
var elements = stripe.elements();

export class PaymentStripeForm extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            bdisableSubmit: false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    };

    handleSubmit = (ev) => {
        util.show_loading_progress();
        ev.preventDefault();
        if (this.props.stripe) {
          this.props.stripe
            .createToken()
            .then((token) => {
                if (token.code) {
                    util.hide_loading_progress();
                    // Inform the customer that there was an error.
                    const errorElement = document.getElementById('card-errors');
                    errorElement.textContent = error.message;
                } else {
                    // Send the token to your server.
                    this.props.handlePayment(token);
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
        return (
            <div className="container container-stripe-form">
                <form onSubmit={this.handleSubmit}>
                    <div id="payment-form">
                        <div className="form-row inline">
                            <div className="col">
                                <label htmlFor="name">Name</label>
                                <input id="name_holder_form" name="name" placeholder="card holder name" required />
                            </div>
                        </div>
                        <div className="checkout">
                            <p>Credit or debit card</p>
                            <CardElement onChange={(event) => this.handleChange(event)}/>

                            {/* Used to display form errors */}
                            <div id="card-errors" role="alert"></div>
                            <div style={{"textAlign":"center"}}>
                                <button id="payment-stripe-form" >pay now</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    };
}

export default injectStripe(PaymentStripeForm);
