import React, { Component } from 'react';
import Like from '../like_button';
import Rating from '../rating/rating';
import PreOrder from '../pre-order/pre-order';
import './dish_card_item.css';

export default class DishItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="dish-card col l3 m6 s12">
                <div className="thumbnail" style={{ backgroundImage: "url(https://www.telegraph.co.uk/content/dam/Travel/2017/February/italy-food-Ribollita-AP.jpg)" }}>
                    <Like type="dish" />
                    <PreOrder />
                </div>
                <h5 className="dish-card-title" title="Dish name goes here long text now">Dish name goes here long text now</h5>
                <div className="rating-wrapper">
                    <Rating rating={5} />
                    <span className="rating-number">15</span>
                </div>
                <div className="dish-meta-price-option">
                    <span className="dish-price">$100</span>
                    <ul className="dish-serving-option">
                        <li>Dine in</li>
                        <li>Delivery</li>
                        <li>Pickup</li>
                    </ul>
                </div>
            </div>
        )
    }
}