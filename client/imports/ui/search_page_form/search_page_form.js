import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './search_page_form.css';

export default class SearchPageForm extends Component {
    constructor(props) {
        super(props);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.state = {
            serving_option: '',
            district: '',
            showMap: true
        }
    }

    componentDidMount() {
        setTimeout(() => {
            let url = new URL(location.href);
            let serving_option = url.searchParams.get("option");
            let district = url.searchParams.get("district");
            this.setState({
                serving_option: serving_option,
                district: district
            })
        }, 500);
    }

    handleChangeSelect(event) {
        let url = new URL(location.href);
        let serving_option = url.searchParams.get("option");
        let district = url.searchParams.get("district");
        if (event.target.id == 'servingOption') {
            serving_option = event.target.value;
            this.setState({
                serving_option: serving_option
            });
            FlowRouter.go('/search?option=' + serving_option + '&district=' + district);
            this.props.changeUrl(district, serving_option);
        } else {
            district = event.target.value;
            this.setState({
                district: district
            })
            FlowRouter.go('/search?option=' + serving_option + '&district=' + district);
            this.props.changeUrl(district, serving_option);
        }
    }

    render() {
        return (
            <div className="row col l12 m12 s12 search-page-form">
                <div className="col s12 m4 l5">
                    <label>I want to</label>
                    <select className="browser-default" id="servingOption" value={this.state.serving_option} onChange={(event) => this.handleChangeSelect(event)}>
                        <option value="all">All serving options</option>
                        <option value="Dine-in">Dine in</option>
                        <option value="Delivery">Delivery</option>
                        <option value="Pick-up">Pick up</option>
                    </select>
                </div>
                <div className="col s12 m4 l5">
                    <label>at</label>
                    <select className="browser-default" id="district-selector" value={this.state.district} onChange={(event) => this.handleChangeSelect(event)}>
                        <option value="" disabled defaultValue>Choose your district</option>
                        {
                            window.util.listDistrict().map((item, index) => {
                                return (
                                    <option key={index} value={item.name}>{item.name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="col s12 m4 l2">
                    <button className={(this.state.showMap) ? "btn toggle-search-map close" : "btn toggle-search-map open"} onClick={() => { this.props.toggleMap(); this.setState({ showMap: !this.state.showMap }) }} >
                        {
                            (this.state.showMap) ?
                                (
                                    <span style={{ display: 'inline-flex' }}>
                                        Close Map <img style={{ marginLeft: '10px' }} src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/map_search_icon_black.svg"/>
                                    </span>
                                )
                            :   (
                                <span style={{ display: 'inline-flex' }}>
                                    Show Map <img style={{ marginLeft: '10px' }} src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/images/map_search_icon_white.svg"/>
                                </span>
                            )
                        }
                    </button>
                </div>
            </div>
        )
    }
}