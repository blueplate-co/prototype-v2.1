import React, { Component } from 'react';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
const format = 'h:mm a';
const now = moment().hour(0).minute(0);

// App component - represents the whole app
export default class DateFilter extends Component {

    constructor(props) {
        super(props);
        this.datePopup = this.datePopup.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.state = {
            popup: false,
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

    datePopup() {
        let popup = this.state.popup;
        this.setState({
            popup: !popup
        })
    }

    render() {   
        return (
            <span className={(this.state.width<= 768) ? 'filter_wrapper_span_mobile' : 'filter_wrapper_span_dekstop'}>
                <li ref={this.setWrapperRef} onClick={() => this.datePopup()} className={ (this.state.popup) ? 'date-filter active' : 'date-filter' }>
                    <span>Date</span>
                </li>
                {
                    (this.state.popup) ? (
                        <div ref={this.setWrapperRef} className="filter-popup date-popup-wrapper">
                        </div>
                    ) : (
                        ""
                    )
                }
            </span>
        );
    }
}