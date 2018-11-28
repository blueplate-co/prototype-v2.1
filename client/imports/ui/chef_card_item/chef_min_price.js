import React from 'react';
import BouncingLoader from '../bouncing_loader/bouncing_loader';

export default class ChefMinPrice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            price: 0,
            loading: true
        }
    }

    componentDidMount() {
        if (this.props.chefId) {
            Meteor.call('getMinPriceRange', this.props.chefId, (err, res) => {
                if (!err) {
                    this.setState({
                        price: res,
                        loading: false
                    })
                }
            });
        }
    }

    render() {
        return (
            <span className="dish-price">
            {
                (this.state.loading) ? (<BouncingLoader />) : (<span>From: ${this.state.price}</span>)
            }
            </span>
        )
    }
}