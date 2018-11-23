import React, {Component} from 'react';

export default class FAQs extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="faqs-container">
                <div className = "faq_section valign-wrapper">
                    <div className = "container faq_container">
                        <div className = "section">
                            <div className = "row">
                                <h4 className = "bp-blue-text">Frequently asked questions</h4>
                            </div>
                            <div className = "row">
                                <div className = "col l6 m12 s12">
                                    <div className = "row">
                                        <h6>FOODIES</h6>
                                    </div>
                                    <div className = "row">
                                        <ul className="collapsible" data-collapsible="expandable">
                                            <li>
                                                <h5 className="collapsible-header bp-blue-text"><i className="material-icons faq_aarow">keyboard_arrow_down</i>What about food safety?</h5>
                                                <div className="collapsible-body detail"><span className = "detail">We are developing a new innovative online food safety verification system with our trusted partner <a href="http://www.intertek.com.hk/" target="_blank">Intertek</a> that guarantees all our dishes are safe.</span></div>
                                            </li>
                                            <li>
                                                <h5 className="collapsible-header bp-blue-text"><i className="material-icons faq_aarow">keyboard_arrow_down</i>How much in advance can I order?</h5>
                                                <div className="collapsible-body detail"><span className = "detail">Depending on your chosen Blueplate kitchen, the advance order time is shown directly on the dish details.</span></div>
                                            </li>
                                            <li>
                                                <h5 className="collapsible-header bp-blue-text"><i className="material-icons faq_aarow">keyboard_arrow_down</i>How do I receive my food?</h5>
                                                <div className="collapsible-body detail"><span>Currently you can either pick up your meal from your chef or they can deliver it straight to your door. We are starting to implement a delivery system where you will have the choice to pick your delivery option.</span></div>
                                            </li>
                                            <li>
                                                <h5 className="collapsible-header bp-blue-text"><i className="material-icons faq_aarow">keyboard_arrow_down</i>How to make last minute changes?</h5>
                                                <div className="collapsible-body detail"><span>We have a built-in messaging system, so you can contact the chef in case you have some last minute changes.</span></div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className = "col l6 m12 s12">
                                    <div className = "row">
                                        <h6>CHEFS</h6>
                                    </div>
                                    <div className = "row">
                                        <ul className="collapsible" data-collapsible="expandable">
                                            <li>
                                                <h5 className="collapsible-header bp-blue-text"><i className="material-icons faq_aarow">keyboard_arrow_down</i>Do I need a food license?</h5>
                                                <div className="collapsible-body"><span className = "detail">Airbnb and Uber don’t ask for it, so why should we? Just kidding, your safety is our number 1 priority, that’s why we developed our own authentic verification process.</span></div>
                                            </li>
                                            <li>
                                                <h5 className="collapsible-header bp-blue-text"><i className="material-icons faq_aarow">keyboard_arrow_down</i>How do I receive orders?</h5>
                                                <p className="collapsible-body detail">We will notify you whenever you receive an order via our platform or SMS.</p>
                                            </li>
                                            <li>
                                                <h5 className="collapsible-header bp-blue-text"><i className="material-icons faq_aarow">keyboard_arrow_down</i>How do I get paid?</h5>
                                                <div className="collapsible-body detail"><span>All payments are processed securely through Blueplate’s online payment system. Chefs can claim back the money they earned last month on every 15th.</span></div>
                                            </li>
                                            <li>
                                                <h5 className="collapsible-header bp-blue-text"><i className="material-icons faq_aarow">keyboard_arrow_down</i>How to make last minute changes?</h5>
                                                <div className="collapsible-body detail"><span>We have a built-in messaging system, so you can contact the foodie in case you have some last minute changes.</span></div>
                                            </li>
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