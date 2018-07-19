import React, { Component } from 'react';

// App component - represents the whole app
export default class ServingOptionFilter extends Component {

    constructor(props) {
        super(props);
        this.servingOptionPopup = this.servingOptionPopup.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.state = {
            popup: false
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        window.addEventListener("resize", this.updateDimensions);
    }
    
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        this.setState({width: $(window).width(), height: $(window).height()});
    }

    componentWillMount() {
        this.updateDimensions();
    }
    
    setWrapperRef(node) {
        this.wrapperRef = node;
    }
    
    handleClickOutside(event) {
        if ((this.wrapperRef && !this.wrapperRef.contains(event.target))) {
            this.setState({
                popup: false
            })
        }
    }

    servingOptionPopup() {
        let popup = this.state.popup;
        this.setState({
            popup: !popup
        })
    }

    render() {   
        return (
            <span className={(this.state.width<= 768) ? 'filter_wrapper_span_mobile' : 'filter_wrapper_span_dekstop'}>
                <li ref={this.setWrapperRef} onClick={() => this.servingOptionPopup()} className={ (this.state.popup) ? 'date-filter active' : 'date-filter' }>
                    <span>Serving Option</span>
                </li>
                {
                    (this.state.popup) ? (
                        <div ref={this.setWrapperRef} className="filter-popup serving-option-popup-wrapper">
                            <span style={{ padding: '20px', display: 'block' }}>How would you like to get for food?</span>
                            <ul className="list-serving-option">
                                <li className="row">
                                    <div className="col l1 m2 s2">
                                        <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/BP_icon_20180312_Delivery_sq24px.svg" />
                                    </div>
                                    <div className="col l11 m10 s10">
                                        <span className="serving-option-title">Delivery</span>
                                        <span className="serving-option-description">Your food will be delivered to your chosen location </span>
                                    </div>
                                </li>
                                <li className="row">
                                    <div className="col l1 m2 s2">
                                        <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/BP_icon_20180312_Eatin_sq24px.svg" />
                                    </div>
                                    <div className="col l11 m10 s10">
                                        <span className="serving-option-title">Dine in</span>
                                        <span className="serving-option-description">You will eat in chef’s place</span>
                                    </div>
                                </li>
                                <li className="row">
                                    <div className="col l1 m2 s2">
                                        <img src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/BP_icon_20180312_Pickup_sq24px.svg" />
                                    </div>
                                    <div className="col l11 m10 s10">
                                        <span className="serving-option-title">Pickup</span>
                                        <span className="serving-option-description">You will pass by chef’s place and pick up food yourself</span>
                                    </div>
                                </li>
                            </ul>
                            <div className="row">
                                <div className="col l3 m3 s12"><button className="btn" onClick={() => this.clearCriteria()} >Clear</button></div>
                                <div className="col l3 offset-l6 m3 offset-m6 s12"><button onClick={() => { this.apply() } } className="btn" disabled={(this.state.lat == 0 && this.state.lng == 0) ? true : false}>Apply</button></div>
                            </div>
                        </div>
                    ) : (
                        ""
                    )
                }
            </span>
        );
    }
}