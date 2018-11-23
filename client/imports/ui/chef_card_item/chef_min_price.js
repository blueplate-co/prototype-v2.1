import React from 'react';

export default class ChefMinPrice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            price: 0
        }
    }

    componentDidMount() {
        if (this.props.chefId) {
            Meteor.call('getMinPriceRange', this.props.chefId, (err, res) => {
                if (!err) {
                    this.setState({
                        price: res
                    })
                }
            });
        }
    }

    render() {
        return (
            <span className="dish-price">From: ${this.state.price}</span>
        )
    }
}