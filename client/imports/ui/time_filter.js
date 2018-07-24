import React, { Component } from 'react';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
const format = 'h:mm a';

// App component - represents the whole app
export default class TimeFilter extends Component {

    constructor(props) {
        super(props);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            popup: false,
            width: 0,
            height: 0,
            time: null
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
        if (event.target.offsetParent.offsetParent) {
            if ((this.wrapperRef && !this.wrapperRef.contains(event.target)) && (!event.target.offsetParent.offsetParent.classList.contains('rc-time-picker-panel-inner'))) {
                this.setState({
                    popup: false
                })
            }
        } else {
            if ((this.wrapperRef && !this.wrapperRef.contains(event.target))) {
                this.setState({
                    popup: false
                })
            }
        }
    }

    timePopup() {
        let popup = this.state.popup;
        this.setState({
            popup: !popup
        })
    }

    onChange(value) {
        this.setState({
            time: value
        })
    }

    clearCriteria() {
        this.props.actionFilter(null);
        this.setState({
            popup: false
        })
    }

    apply() {
        if (Session.get('search_result')) {
            this.props.actionFilter(this.state.time);
            this.setState({
                popup: false
            })
        } else {
            Materialize.toast('No data for filter.', 4000, 'rounded bp-green');
        }
    }

    render() {   
        return (
            <span className={(this.state.width<= 768) ? 'filter_wrapper_span_mobile' : 'filter_wrapper_span_dekstop'}>
                <li ref={this.setWrapperRef} onClick={() => this.timePopup()} className={ (this.state.popup) ? 'time-filter active' : 'time-filter' }>
                    <span>Time</span>
                </li>
                {
                    (this.state.popup) ? (
                        <div ref={this.setWrapperRef} className="filter-popup time-popup-wrapper">
                            <span style={{ padding: '20px', display: 'block' }}>When you want to be served?</span>
                            <TimePicker
                                showSecond={false}
                                defaultValue={null}
                                className="xxx"
                                onChange={this.onChange}
                                format={format}
                                use12Hours
                            />
                            <div className="row">
                                <div className="col l12 m12 s12"><button className="btn" onClick={() => this.clearCriteria()} >Clear</button></div>
                                <div className="col l12 m12 s12"><button onClick={() => { this.apply() } } className="btn" disabled={(!this.state.time) ? true : false}>Apply</button></div>
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