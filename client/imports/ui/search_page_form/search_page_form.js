import React, { Component } from 'react';
import './search_page_form.css';

export default class SearchPageForm extends Component {
    constructor(props) {
        super(props);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.state = {
            serving_option: '',
            district: ''
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
            })
            location.href = '/search?option=' + serving_option + '&district=' + district;
        } else {
            district = event.target.value;
            this.setState({
                district: district
            })
            location.href = '/search?option=' + serving_option + '&district=' + district;
        }
    }

    render() {
        return (
            <div className="row col l8 search-page-form">
                <div className="col s12 m6 l4">
                    <label>I want to</label>
                    <select className="browser-default" id="servingOption" value={this.state.serving_option} onChange={(event) => this.handleChangeSelect(event)}>
                        <option value="all">All serving options</option>
                        <option value="Dine-in">Dine in</option>
                        <option value="Delivery">Delivery</option>
                        <option value="Pick-up">Pick up</option>
                    </select>
                </div>
                <div className="col s12 m6 l4">
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
            </div>
        )
    }
}