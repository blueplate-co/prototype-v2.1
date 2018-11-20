import React, { Component } from 'react';
import Rating from '../rating/rating';
import DishDistance from '../dish-distance/dish-distance';
import './chef_card_item.css';

export default class DishItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <a target="_blank" href={"/kitchen/" + this.props.id}>
                <div className="dish-card">
                    {
                        (this.props.banner) ? (
                            <div className="thumbnail" style={{ backgroundImage: "url("+ this.props.banner.large + ")" }}>
                                <DishDistance location={this.props.location} currentLat={this.props.currentLat} currentLng={this.props.currentLng} />
                            </div>
                        ) : (
                            <div className="thumbnail" style={{ backgroundImage: "url(https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/bottle-decorations-fruits-1128426.png)" }}>
                                <DishDistance location={this.props.location} currentLat={this.props.currentLat} currentLng={this.props.currentLng} />
                            </div>
                        )

                    }
                    <h5 className="dish-card-title" title={this.props.name}>{this.props.name}</h5>
                    <ul className="dish-tags">
                        <li>Dine in</li>
                        <li>Delivery</li>
                        <li>Pickup</li>
                    </ul>
                    <div className="dish-meta-price-option">
                        <span className="dish-price">From: $100</span>
                    </div>
                    <div className="rating-wrapper">
                        <Rating rating={this.props.rating} />
                    </div>
                </div>
            </a>
        )
    }
}