import React, { Component } from 'react';
import './bouncing_loader.css';


export default class BouncingLoader extends Component {
    constructor(props) {
        super(props);
    }

    render = () => {

        return (
            <div className="bouncing-loader">
                <div></div>
                <div></div>
                <div></div>
            </div>
        )
    }
}
