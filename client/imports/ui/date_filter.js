import React, { Component } from 'react';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
const now = moment().hour(0).minute(0);

// App component - represents the whole app
export default class DateFilter extends Component {

    constructor(props) {
        super(props);
        this.datePopup = this.datePopup.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.state = {
            popup: false,
            date: null,
            focused: false
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

    clearCriteria() {
        this.setState({
            popup: false,
            date: null
        });
        // should set to current date, not null
        this.props.actionFilter(null);
    }

    apply() {
        this.setState({
            popup: false
        });
        this.props.actionFilter(this.state.date);
    }

    render() {   
        return (
            <span className={(this.state.width<= 768) ? 'filter_wrapper_span_mobile' : 'filter_wrapper_span_dekstop'}>
                <li ref={this.setWrapperRef} onClick={() => this.datePopup()} className={ (this.state.date) ? 'date-filter active' : 'date-filter' }>
                    <span>Date</span>
                </li>
                {
                    (this.state.popup) ? (
                        <div ref={this.setWrapperRef} className="filter-popup date-popup-wrapper">
                            <span style={{ padding: '20px', display: 'block' }}>When you want to be served?</span>
                            <SingleDatePicker
                                date={this.state.date} // momentPropTypes.momentObj or null
                                onDateChange={date => {this.setState({date: date})}} // PropTypes.func.isRequired
                                focused={this.state.focused} // PropTypes.bool
                                onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                                numberOfMonths={1}
                                noBorder={true}
                                id="date-picker-filter" // PropTypes.string.isRequired,
                            />
                            <div className="row">
                                <div className="col l12 m12 s12"><button className="btn" onClick={() => this.clearCriteria()} >Clear</button></div>
                                <div className="col l12 m12 s12"><button onClick={() => { this.apply() } } className="btn" disabled={(!this.state.date) ? true : false}>Apply</button></div>
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