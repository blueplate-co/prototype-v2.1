import React, { Component } from 'react';
import Like from '../like_button';
import Rating from '../rating/rating';
import DishDistance from '../dish-distance/dish-distance';
import './chef_card_item.css';

export default class DishItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="dish-card">
                <div className="thumbnail" style={{ backgroundImage: "url(https://www.telegraph.co.uk/content/dam/Travel/2017/February/italy-food-Ribollita-AP.jpg)" }}>
                    <Like type="dish" />
                    <DishDistance />
                </div>
                <h5 className="dish-card-title" title="Dish name goes here long text now">Dish name goes here long text now</h5>
                <ul className="dish-tags">
                    <li>Dine in</li>
                    <li>Delivery</li>
                    <li>Pickup</li>
                </ul>
                <div className="dish-meta-price-option">
                    <span className="dish-price">From: $100</span>
                </div>
                <div className="rating-wrapper">
                    <Rating rating={5} />
                </div>
            </div>
        )
    }
}