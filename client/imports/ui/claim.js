import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Claim component
export default class Claim extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: 'history'
        }
    }

    renderTips() {
        switch (this.state.screen) {
            case 'lost-cycle':
                return (
                    <div className="shadow-wrapper">
                        <div className="tips-wrapper">
                        </div>
                    </div>
                )
        }
    }

    renderScreen() {
        switch (this.state.screen) {
            case 'info':
                return (
                    <div>
                        <div className="row">
                            <div className="col s6"><h5>Available deposit credits</h5></div>
                            <div className="col s6" style={{ textAlign: 'right' }}><img title="Tips & info" className="tips-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Infoh.svg" /></div>
                        </div>
                        <img className="transfer-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/credits-background.svg" />
                        <span className="available-price">$700.00</span>
                        <div className="row">
                            <div className="col s12 m12 l12 xl12">
                                <input type="text" placeholder="card holder name" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12 m12 l12 xl12">
                                <input type="text" placeholder="bank name" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12 m12 l12 xl12">
                                <input type="text" placeholder="account number" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12 m12 l12 xl12">
                                <input type="text" placeholder="ammount" />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: '100px' }}>
                            <div className="col s12 m6 l6 form-section"><button className="btn">Claim</button></div>
                            <div className="col s12 m6 l6 form-section"><button className="btn secondary">History</button></div>
                        </div>
                        {this.renderTips()}
                    </div>
                )
            case 'claim':
                return (
                    <div>
                        <div className="row">
                            <div className="col s6"><h5>Transfered date</h5></div>
                            <div className="col s6" style={{ textAlign: 'right' }}><img title="Tips & info" className="tips-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Infoh.svg" /></div>
                        </div>
                        <img className="transfer-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Transfer.svg" />
                        <span className="available-price">$700.00</span>
                        <div className="row" style={{ marginTop: '100px' }}>
                            <div className="col s12 m6 l6 form-section"><button className="btn">Claim</button></div>
                            <div className="col s12 m6 l6 form-section"><button className="btn secondary">History</button></div>
                        </div>
                    </div>
                )
            case 'history':
                return (
                    <div>
                        <div className="row">
                            <div className="col s6 no-padding">
                                <i className="small material-icons black-text text-darken-1">arrow_back</i>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s6 no-padding"><h5>History</h5></div>
                        </div>
                        <div className="row">
                            <table className="striped">
                                <thead>
                                    <tr>
                                        <th>Transfer date</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>Alvin</td>
                                        <td>$0.87</td>
                                    </tr>
                                    <tr>
                                        <td>Alan</td>
                                        <td>$3.76</td>
                                    </tr>
                                    <tr>
                                        <td>Jonathan</td>
                                        <td>$7.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="row" style={{ marginTop: '100px' }}>
                            <div className="col s12 m6 l6 form-section"><button className="btn">Done</button></div>
                            <div className="col s12 m6 l6 form-section"><button className="btn secondary">History</button></div>
                        </div>
                    </div>
                )
        }
    }

    render() {
        return (
            <div className="container claim-wrapper">
                {this.renderScreen()}
            </div>
        )
    }
}