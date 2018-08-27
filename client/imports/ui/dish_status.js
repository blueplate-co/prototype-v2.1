import React, { Component } from 'react';

const onlineContent = {
        color: '#56AACD'
    },
    offlineContent = {
        color: '#B6B6B6'
    },
    dishStatusText = {
        marginLeft: '-10px'
    }

export default class DishStatus extends Component {
    constructor (props) {
        super(props);

    }

    render() {
        var status = this.props.status;
        return (
            <span>
                {status ?
                    <li style={onlineContent} className="small brightness_1 text-right">
                    <span style={dishStatusText}>online</span>
                    </li>
                :
                    <li style={offlineContent} className="small brightness_1 text-right">
                    <span style={dishStatusText}>offline</span>
                    </li>
                }
            </span>
        );
    }
}