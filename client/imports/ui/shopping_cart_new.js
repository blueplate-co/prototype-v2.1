import React, { Component } from 'react';
import ProgressiveImages from './progressive_image';

export default class ShoppingCart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dishDetails: JSON.parse(localStorage.getItem("localCart")),
            cartDishs: []
        };
    };

    componentDidMount() {
        if (this.state.dishDetails != null) {
            this.state.dishDetails.map( (item, idx) => {
                var dish = Dishes.findOne({ _id: item.dish_id});
                console.log(dish);
                var chitken = Kitchen_details.findOne({ user_id: item.seller_id});
                console.log(chitken);
            });
        }
    }

    renderProgressNav() {
        return (
            <div className="row shopping-progress-nav">
                <ul className="col s12 m4 l4 bp-blue-text">
                    <li className="cart-progress-component">
                        <span className="cart-progress-step-number">1</span> 
                        <span className="cart-progress-step-text">Order Summary</span>
                    </li>
                </ul>

                <ul className="col s12 m4 l4 bp-blue-text">
                    <li>
                        <span className="cart-progress-step-number">2</span> 
                        <span className="cart-progress-step-text">Payment</span>
                    </li>
                </ul>

                <ul className="col s12 m4 l4 bp-blue-text">
                    <li>
                        <span className="cart-progress-step-number">3</span> 
                        <span className="cart-progress-step-text">Manage order</span>
                    </li>
                </ul>
            </div>
        );
    }

    render() {
        // console.log(this.state.dishDetails);
        return (
            <div className="container">
                {this.renderProgressNav()}
                <div className="cart-detail-summary">
                    <div className="row cart-kitchen-detail">
                        <div id="cart-kitchen-image" className="text-left">
                            <ProgressiveImages
                                large={ util.getDefaultChefImage() }
                                small={ util.getDefaultChefImage() }
                            />
                        </div>

                        <div id="cart-total-kitchen" className="text-right">
                            <span id="cart-kitchen-total">Total:</span>
                            <span className="bp-blue-text" id="cart-kitchen-price">HK$ 202</span>
                        </div>
                    </div>

                    <div className="row cart-dish-detail">
                        <h5>dish</h5>
                    </div>
                </div>
            </div>
        );
    }
}