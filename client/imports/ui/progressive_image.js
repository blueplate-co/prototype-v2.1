import React, { Component } from 'react';

export default class ProgressiveImages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            background: '',
            loaded: false
        }
    }

    componentWillReceiveProps = (nextProps, nextState) => {
        if (this.props !== nextProps && this.state.loaded == false) {
            var placeholder = document.querySelector('.placeholder');
            var that = this;
    
            // 1: load small image and show it
            var img = new Image();
            img.src = this.props.small;
            img.onload = function () {
                that.setState({
                    background: that.props.small
                },() => {
                    // loaded
                })
            };
    
            // 2: load large image
            if (placeholder != undefined && placeholder.dataset) {
                var imgLarge = new Image();
                imgLarge.src = placeholder.dataset.large;
                imgLarge.onload = function () {
                    setTimeout(() => {
                        that.setState({
                            background: that.props.large
                        },() => {
                            that.setState({
                                loaded: true
                            })
                            // loaded
                        })
                    }, 200);
                };
            }
        }
    }

    componentDidMount = () => {
        var placeholder = document.querySelector('.placeholder');
        var that = this;

        // 1: load small image and show it
        var img = new Image();
        img.src = this.props.small;
        img.onload = function () {
            that.setState({
                background: that.props.small
            },() => {
                // loaded
            })
        };

        // 2: load large image
        if ( (typeof placeholder) !== 'undefined' && placeholder !== null && placeholder.dataset) {
            var imgLarge = new Image();
            imgLarge.src = placeholder.dataset.large;
            imgLarge.onload = function () {
                setTimeout(() => {
                    that.setState({
                        background: that.props.large
                    },() => {
                        that.setState({
                            loaded: true
                        })
                        // loaded
                    })
                }, 1000);
            };
        }
    }

    render() {
        return (
            <div className="placeholder" data-large={this.props.large}>
                <div className={(this.state.loaded) ? 'background' : 'background blur'} style={{backgroundImage: "url(" + this.state.background + ")"}}></div>
            </div>
        )
    }
}
