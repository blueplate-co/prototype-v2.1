import React, { Component } from 'react';

const progressNavBar = {
    marginTop: '-22px',
    paddingTop: '0px'
}

export default class ProgressBar extends Component {
    constructor(props) {
        super(props);

        this.disableProgressText = {
            
        }
    }

    render() {

        return (
            <div className="row shopping-progress-nav" style={progressNavBar}>
                <ul className={this.props.step_progress == '1' ? "col s12 m4 l4 bp-blue-text step-progress"  : 'col s12 m4 l4 bp-blue-text display-on-device-step'}>

                    <li className="cart-progress-component">
                        <span className="cart-progress-step-number">1</span> 
                        <span className="cart-progress-step-text">Order Summary</span>
                    </li>
                </ul>

                <ul className={this.props.step_progress == '2' ? "col s12 m4 l4 bp-blue-text step-progress"  : 'col s12 m4 l4 bp-blue-text display-on-device-step'}>
                    <li>
                        <span className="cart-progress-step-number">2</span> 
                        <span className="cart-progress-step-text">Payment</span>
                    </li>
                </ul>

                <ul className={this.props.step_progress == '3' ? "col s12 m4 l4 bp-blue-text step-progress"  : 'col s12 m4 l4 bp-blue-text display-on-device-step'}>
                    <li>
                        <span className="cart-progress-step-number">3</span> 
                        <span className="cart-progress-step-text">Manage order</span>
                    </li>
                </ul>
            </div>
        );
    }

}