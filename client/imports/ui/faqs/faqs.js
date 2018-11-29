import React, {Component} from 'react';
import './faqs.css';

class CollapseItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false
        }
    }

    createMarkup(description) {
        return {__html: description};
    }

    render() {
        return (
            <li>
                <h5 className="collapsible-header bp-blue-text" onClick={() => this.setState({ collapse: !this.state.collapse }) }>
                    {this.props.title}
                    {
                        (this.state.collapse) ? <i className="material-icons">expand_more</i> : <i className="material-icons">chevron_right</i>
                    }
                </h5>
                <div className="collapsible-body detail"><span className = "detail" dangerouslySetInnerHTML={this.createMarkup(this.props.description)}></span></div>
            </li>
        )
    }
}

export default class FAQs extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $('.collapsible').collapsible();
    }

    render() {
        return (
            <section className="faqs-container">
                <div className = "faq_section valign-wrapper">
                    <div className = "container faq_container">
                        <div className = "section">
                            <div className = "row">
                                <h4 className = "bp-blue-text">FAQs</h4>
                            </div>
                            <div className = "row">
                                <div className = "col l6 m12 s12">
                                    <div className = "row">
                                        <h6>FOODIES</h6>
                                    </div>
                                    <div className = "row">
                                        <ul className="collapsible">
                                            <CollapseItem
                                                title="What about food safety?"
                                                description="We are developing a new innovative online food safety verification system with our trusted partner <a href='http://www.intertek.com.hk/' target='_blank'>Intertek</a> that guarantees all our dishes are safe."
                                            />
                                            <CollapseItem
                                                title="How much in advance can I order?"
                                                description="Depending on your chosen Blueplate kitchen, the advance order time is shown directly on the dish details."
                                            />
                                            <CollapseItem
                                                title="How do I receive my food?"
                                                description="Currently you can either pick up your meal from your chef or they can deliver it straight to your door. We are starting to implement a delivery system where you will have the choice to pick your delivery option."
                                            />
                                            <CollapseItem
                                                title="How to make last minute changes?"
                                                description="We have a built-in messaging system, so you can contact the chef in case you have some last minute changes."
                                            />
                                        </ul>
                                    </div>
                                </div>
                                <div className = "col l6 m12 s12">
                                    <div className = "row">
                                        <h6>CHEFS</h6>
                                    </div>
                                    <div className = "row">
                                        <ul className="collapsible">
                                            <CollapseItem
                                                title="Do I need a food license?"
                                                description="Airbnb and Uber don’t ask for it, so why should we? Just kidding, your safety is our number 1 priority, that’s why we developed our own authentic verification process."
                                            />
                                            <CollapseItem
                                                title="How do I receive orders?"
                                                description="We will notify you whenever you receive an order via our platform or SMS."
                                            />
                                            <CollapseItem
                                                title="How do I get paid?"
                                                description="All payments are processed securely through Blueplate’s online payment system. Chefs can claim back the money they earned last month on every 15th."
                                            />
                                            <CollapseItem
                                                title="How to make last minute changes?"
                                                description="We have a built-in messaging system, so you can contact the foodie in case you have some last minute changes."
                                            />
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}