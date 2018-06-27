import React, { Component } from 'react';

class Popup extends React.Component {
    render() {
        return (
        <div className='popup'>
            <div className='popup_inner'>
            <h1>{this.props.text}</h1>
            <button onClick={this.props.closePopup}>close me</button>
            </div>
        </div>
        );
    }
}

// Claim component
export default class Claim extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: 'info',
            validProfit: 0,
            currentProfit: 0
        }
        this.getprofit = this.getprofit.bind(this);
    }

    componentDidMount() {
        this.getprofit();
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

    getprofit() {
        Meteor.call('claim.validProfit', (err, res) => {
            if (!err) {
                this.setState({
                    validProfit: res.available_profit,
                    currentProfit: res.current_profit
                });
            }
        });
    }

    transfer() {
        let placeholder_name = $('#placeholder_name').val();
        let bank_info = $('#bank_name').val();
        let bank_account_number = $('#bank_account_number').val();
        let amount = $('#amount').val();
        if (placeholder_name.trim().length <= 0) {
            Materialize.toast('Invalid card name', 3000, "rounded bp-red");
        } else if (bank_info == '0'){
            Materialize.toast('Please choose your bank name', 3000, "rounded bp-red");
        } else if (bank_account_number.trim().length < 9 || bank_account_number.trim().length > 12) {
            Materialize.toast('Invalid card number format', 3000, "rounded bp-red");
        } else if (amount == 0){    
            Materialize.toast('Invalid amount to claim', 3000, "rounded bp-red");
        } else {
            Meteor.call('claim.request', Meteor.userId(), placeholder_name, bank_info, bank_account_number, amount, function(err, res) {
                // success a response for request a claim request
            });
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
                        <div className="container-claim">
                            <div className="row">
                                <div className="col s6 m3 l3"><img className="transfer-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/credits-background.svg" /></div>
                                <div className="col s6 m9 l9"><h6>Available profit last month:</h6><span className="available-price">${this.state.validProfit}</span></div>
                            </div>
                            <div className="row">
                                <div className="col s6 m3 l3"><img className="transfer-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/credits-background.svg" /></div>
                                <div className="col s6 m9 l9"><h6>Available profit this month:</h6><span className="available-price">${this.state.currentProfit}</span></div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12 m12 l12 xl12">
                                <input id="placeholder_name" type="text" placeholder="card holder name" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12 m12 l12 xl12">
                                <select id="bank_name" name="bank_name" className="browser-default">
                                    <option value="0" disabled="" selected="">Bank name</option>
                                    <option value="HSBCHKHH - Hongkong and Shanghai Banking Corporation - 香港上海滙豐銀行有限公司">Hongkong and Shanghai Banking Corporation - 香港上海滙豐銀行有限公司</option>
                                    <option value="BKCHHKHH - Bank of China (Hong Kong) - 中國銀行(香港)有限公司">Bank of China (Hong Kong) - 中國銀行(香港)有限公司</option>
                                    <option value="HASEHKHH - Hang Seng Bank - 恒生銀行有限公司">Hang Seng Bank - 恒生銀行有限公司</option>
                                    <option value="COMMHKHH - Bank of Communications - 交通银行">Bank of Communications - 交通银行</option>
                                    <option value="BEASHKHH - The Bank of East Asia - 東亞銀行有限公司">The Bank of East Asia - 東亞銀行有限公司</option>
                                    <option value="KWHKHKHH - China CITIC Bank International - 中信銀行國際有限公司">China CITIC Bank International - 中信銀行國際有限公司</option>
                                    <option value="PCBCHKHH - China Construction Bank (Asia) - 中國建設銀行(亞洲)股份有限公司">China Construction Bank (Asia) - 中國建設銀行(亞洲)股份有限公司</option>
                                    <option value="CIYUHKHH - Chiyu Banking Corporation - 集友銀行有限公司">Chiyu Banking Corporation - 集友銀行有限公司</option>
                                    <option value="LCHBHKHH - Chong Hing Bank - 創興銀行有限公司">Chong Hing Bank - 創興銀行有限公司</option>
                                    <option value="CITIHKAX - Citibank (Hong Kong) - 花旗銀行(香港)有限公司">Citibank (Hong Kong) - 花旗銀行(香港)有限公司</option>
                                    <option value="DSBAHKHH - Dah Sing Bank - 大新銀行有限公司">Dah Sing Bank - 大新銀行有限公司</option>
                                    <option value="DBSSHKHH - DBS Bank (Hong Kong) - 星展銀行(香港)有限公司">DBS Bank (Hong Kong) - 星展銀行(香港)有限公司</option>
                                    <option value="TPBKHKHH - Fubon Bank (Hong Kong)- 富邦銀行(香港)有限公司">Fubon Bank (Hong Kong)- 富邦銀行(香港)有限公司</option>
                                    <option value="ICBKHKHH - Industrial and Commercial Bank of China (Asia) - 中國工商銀行(亞洲)有限公司">Industrial and Commercial Bank of China (Asia) - 中國工商銀行(亞洲)有限公司</option>
                                    <option value="NYCBHKHH - Nanyang Commercial Bank - 南洋商業銀行有限公司">Nanyang Commercial Bank - 南洋商業銀行有限公司</option>
                                    <option value="OCBC Wing Hang Bank - 華僑銀行有限公司">OCBC Wing Hang Bank - 華僑銀行有限公司</option>
                                    <option value="PBBEHKHH - Public Bank (Hong Kong) - 大眾銀行(香港)有限公司">Public Bank (Hong Kong) - 大眾銀行(香港)有限公司</option>
                                    <option value="SCBKHKHH - Shanghai Commercial Bank - 上海商業銀行有限公司">Shanghai Commercial Bank - 上海商業銀行有限公司</option>
                                    <option value="SCBLHKHH - Standard Chartered Hong Kong - 渣打銀行(香港)有限公司">Standard Chartered Hong Kong - 渣打銀行(香港)有限公司</option>
                                    <option value="TSBLHKHH - Dah Sing Bank Limited - 大生銀行有限公司">Dah Sing Bank Limited - 大生銀行有限公司</option>
                                    <option value="Tai Yau Bank - 大有銀行有限公司">Tai Yau Bank - 大有銀行有限公司</option>
                                    <option value="WUBAHKHH - Wing Lung Bank - 永隆銀行有限公司">Wing Lung Bank - 永隆銀行有限公司</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12 m12 l12 xl12">
                                <input type="text" id="bank_account_number" placeholder="account number" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s12 m12 l12 xl12">
                                <input type="number" id="amount" placeholder="amount" />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: '100px' }}>
                            <div className="col s12 form-section"><button className="btn" onClick={() => this.transfer()}>Transfer</button></div>
                            {/* <div className="col s12 m6 l6 form-section"><button className="btn secondary">History</button></div> */}
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