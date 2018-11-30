import React, { Component } from 'react';
import Rating from '../rating/rating';
import './dish_card_item.css';

export default class DishCardItem extends Component {
    constructor(props) {
        super(props);
    }

    renderTagList() {
        if (!this.props.tags || Object.keys(this.props.tags).length == 0) {
            return <li>No tag displayed</li>
        } else {
            return this.props.tags.map((item, index) => {
                if (index < 3) {
                    return <li key={index}>{item.tag}</li>
                }
            });
        }
    }

    render() {
        return (
            <a target="_blank" href={"/dish/" + this.props.id}>
                <div className="dish-card">
                    {
                        (this.props.banner) ? (
                            <div className="thumbnail" style={{ backgroundImage: "url("+ this.props.banner + ")" }}>
                            </div>
                        ) : (
                            <div className="thumbnail" style={{ backgroundImage: "url(https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/bottle-decorations-fruits-1128426.png)" }}>
                            </div>
                        )

                    }
                    <h5 className="dish-card-title" title={this.props.name}>{this.props.name}</h5>
                    <ul className="dish-tags">
                        {this.renderTagList()}
                    </ul>
                    <div className="dish-meta-price-option">
                        {this.props.price}
                    </div>
                    <div className="rating-wrapper">
                        <Rating rating={this.props.rating} />
                    </div>
                </div>
            </a>
        )
    }
}