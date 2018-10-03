import React, { Component } from 'react';

export default class ShoppingCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dishDetails: JSON.parse(localStorage.getItem("localCart"))
        };
    };


    render() {
        console.log(this.state.dishDetails);
        return (
            <div className="container">
                <h4>New shopping card</h4>

            </div>
        );
    }
}