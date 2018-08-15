import React, { Component } from 'react';

// Dish detail component
export default class Dish_Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        }
    }

    componentDidMount() {
        Meteor.call('dish.get_detail', this.props.id, (error, res) => {
            if (!error) {
                this.setState({
                    data: res
                })
            } else {
                Materialize.toast('Error occur when fetch data. Please try again.', 4000, 'rounded bp-green');
            }
        });
    }

    render() {
        return (
            <h3>{this.state.data.dish_name}</h3>
        )
    }
}