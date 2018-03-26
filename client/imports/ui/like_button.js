import React, { Component } from 'react';

// App component - represents the whole app
export default class Like extends Component {

    constructor(props) {
        super(props);
        this.state = {
            like: false
        }
    }

    actionLike = (event) => {
        // not excute parent click event
        event.stopPropagation();
        if (this.props.type == 'dish') {
            if (this.state.like) {
                Meteor.call('dish.unlike', this.props.id , (error, result) => {
                    if (!error) {
                        this.setState({
                            like: false
                        })
                    }
                })
            } else {
                Meteor.call('dish.like', this.props.id , (error, result) => {
                    if (!error) {
                        this.setState({
                            like: true
                        })
                    }
                })
            }
        } else {
            if (this.state.like) {
                Meteor.call('menu.unlike', this.props.id , (error, result) => {
                    if (!error) {
                        this.setState({
                            like: false
                        })
                    }
                })
            } else {
                Meteor.call('menu.like', this.props.id , (error, result) => {
                    if (!error) {
                        this.setState({
                            like: true
                        })
                    }
                })
            }
        }
    }

    componentWillReceiveProps = () => {
        var self = this;
        if (this.props.type == 'dish') {
            let count = Dishes.find( { _id: this.props.id , like: { $in : [ Meteor.userId() ]} }).count();
            if (count > 0) {
                self.setState({
                    like: true
                })
            } else {
                self.setState({
                    like: false
                })
            }
        }
    }

    componentDidMount = () => {
        var self = this;
        if (this.props.type == 'dish') {
            let count = Dishes.find( { _id: this.props.id , like: { $in : [ Meteor.userId() ]} }).count();
            if (count > 0) {
                self.setState({
                    like: true
                })
            } else {
                self.setState({
                    like: false
                })
            }
        }
    }

    render() {
        return (
            <span onClick={ this.actionLike } title="like" className={ (this.state.like ? 'like-container like' : 'like-container unlike') }>
                <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                        <g id="ic/favorite/line/GY" stroke="#FFFFFF" strokeWidth="2">
                            <path d="M12,8 C11.33,6.268 9.453,5 7.5,5 C4.957,5 3,6.932 3,9.5 C3,16.0145833 9.79433594,21 12,21 C14.2056641,21 21,16.0139974 21,9.5 C21,6.932 19.043,5 16.5,5 C14.545,5 12.67,6.268 12,8 Z" id="Shape"></path>
                        </g>
                    </g>
                </svg>
            </span>
        );
    }
}