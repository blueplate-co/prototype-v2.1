import React, { Component } from 'react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

class Modal extends React.Component {

	static propTypes = {
		isModalOpen: React.PropTypes.bool.isRequired,
		closeModal: React.PropTypes.func.isRequired,
		style: React.PropTypes.shape({
			modal: React.PropTypes.object,
			overlay: React.PropTypes.object
		})
	};

	constructor(props) {
		super(props);

		this.outerStyle = {
			position: 'fixed',
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			overflow: "auto",
			height: "100%",
			zIndex: 999
		};

		// default style
		this.style = {
			modal: {
				position: "relative",
				width: 500,
				padding: 20,
				boxSizing: 'border-box',
                backgroundColor: '#56AACD',
                color: '#fff',
				margin: '40px auto',
				borderRadius: 3,
				zIndex: 998,
				textAlign: 'left',
				boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
				...this.props.style.modal,
			},
			overlay: {
				position: 'fixed',
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
				width: "100%",
				height: "100%",
				backgroundColor: 'rgba(0,0,0,0.5)',
				...this.props.style.overlay
			}
		}
	}

	// render modal
	render() {
		return (<div style={{...this.outerStyle, display: this.props.isModalOpen ? 'block' : 'none'}}>
						<div style={this.style.overlay} onClick={this.props.closeModal}></div>
												<div onClick={this.props.closeModal}></div>
                <div style={this.style.modal}>
                    {this.props.children}
                </div>
            </div>)
	}
}

// overwrite style
const modalStyle = {
	overlay: {
		backgroundColor: 'rgba(0, 0, 0,0.5)'
	}
};

const mainStyle = {
	app: {
		margin: '120px 0'
	},
	button: {
		backgroundColor: '#408cec',
		border: 0,
		padding: '12px 20px',
		color: '#fff',
		margin: '0 auto',
		width: 150,
		display: 'block',
		borderRadius: 3
	}
};

// Claim component
export default class Claim extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: 'info',
            amount: 0,
            placeholder_name: '',
            bank_info: '',
            bank_account_number: '',
            validProfit: 0,
            currentProfit: 0,
            history: [],
            isModalOpen: false,
			isInnerModalOpen: false
        }
        // bind functions
		this.closeModal = this.closeModal.bind(this);
		this.openModal = this.openModal.bind(this);
        this.getprofit = this.getprofit.bind(this);
    }

    componentDidMount() {
        this.getprofit();
        Meteor.call('claim.getListRequest', (err, res) => {
            if (!err) {
                this.setState({
                    history: res
                })
            }
        })
    }

    // close modal (set isModalOpen, true)
	closeModal() {
		this.setState({
			isModalOpen: false
		})
	}

	// open modal (set isModalOpen, false)
	openModal() {
		this.setState({
			isModalOpen: true
		})
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
        Meteor.call("payment.getStripeBalance", (err, response) => {
            this.setState({
                validProfit: parseInt(response.account_balance) / 100,
            });
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
        } else if (bank_account_number.replace(/\s/g, "").length < 9 || bank_account_number.replace(/\s/g, "").length > 12 || isNaN(bank_account_number)) {
            Materialize.toast('Invalid card number format', 3000, "rounded bp-red");
        } else if (amount == 100 || amount > this.state.validProfit){    
            Materialize.toast('Invalid amount to claim. Must greater than 100$', 3000, "rounded bp-red");
        } else if (this.state.validProfit == 0) {
            Materialize.toast('No have available amount to claim', 3000, "rounded bp-red");
        } else if (amount > this.state.validProfit) {
            Materialize.toast('Not enough balance to claim', 3000, "rounded bp-red");
        } else {
            this.setState({
                screen: 'claim',
                amount: amount,
                placeholder_name: placeholder_name,
                bank_info: bank_info,
                bank_account_number: bank_account_number
            })
        }
    }

    claim() {
        var chef_name = Kitchen_details.findOne({ user_id: Meteor.userId() }).chef_name;
        var profile_detail = Profile_details.findOne({user_id: Meteor.userId()});
        var buyer_info = chef_name + " (id: " + Meteor.userId() + ", email: " + Meteor.user().emails[0].address + ", phone no: " + profile_detail.mobile + ")";
        var content_message = '\nBuyer infor : ' + buyer_info + 
        '\nAmount: ' + this.state.amount +
        '\nPlaceholder name: ' + this.state.placeholder_name +
        '\nBank info: ' + this.state.bank_info +
        '\nBank number: ' + this.state.bank_account_number;
        Meteor.call(
            'marketing.create_task_asana',
            '861003196091238', // projects_id to create task
            'Claim request: ' + chef_name,
            content_message
        );
        Meteor.call('claim.request', Meteor.userId(), this.state.placeholder_name, this.state.bank_info, this.state.bank_account_number, this.state.amount, (err, res) => {
            // success a response for request a claim request
            if (err) {
                console.log(err);
            } else {
                console.log('Claim successful');
                FlowRouter.go('/cooking/dashboard');
            }
        });
    }

    showHistory() {
        this.setState({
            screen: 'history'
        })
    }

    renderListHistory() {
        return this.state.history.map((item, index) => {
            var dateFormat = moment(item.createdAt).format('ddd Do MMMM YYYY');
            return (
                <tr key={index}>
                    <td>{dateFormat}</td>
                    <td>{item.amount}</td>
                    <td>{item.status}</td>
                </tr>
            )
        })
    }

    renderScreen() {
        switch (this.state.screen) {
            case 'info':
                return (
                    <div>
                        <Modal
                            isModalOpen={this.state.isModalOpen}
                            closeModal={this.closeModal}
                            style={modalStyle}>
                                <h4 style={{ color: '#fff', textAlign: 'center', fontSize: '4.5em' }}>${this.state.validProfit}</h4>
                                <span>Earning can only be claim on or after 15th of every month. Please come back later.</span>
                        </Modal>
                        <div className="row">
                            <div className="col s6"><h5>Available deposit credits</h5></div>
                            <div onClick={this.openModal} className="col s6" style={{ textAlign: 'right' }}><img title="Tips & info" className="tips-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Infoh.svg" /></div>
                        </div>
                        <div className="container-claim">
                            <div className="row">
                                <div className="col s6 m3 l3"><img className="transfer-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/credits-background.svg" /></div>
                                <div className="col s6 m9 l9"><h6>Available profit:</h6><span className="available-price">${this.state.validProfit}</span></div>
                            </div>
                            {/* <div className="row">
                                <div className="col s6 m3 l3"><img className="transfer-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/credits-background.svg" /></div>
                                <div className="col s6 m9 l9"><h6>Available profit this month:</h6><span className="available-price">${this.state.currentProfit}</span></div>
                            </div> */}
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
                var endMonth = moment().endOf("month");
                var midNextMonth = endMonth.add(15, 'days');
                var payday = midNextMonth.format('ddd Do MMMM YYYY');
                return (
                    <div>
                        <Modal
                            isModalOpen={this.state.isModalOpen}
                            closeModal={this.closeModal}
                            style={modalStyle}>
                                <img style={{ display: 'block', margin: '0px auto', marginBottom: '50px'}} src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/info+copy.svg" />
                                <span>Earning will automaticlly transfer to balance, but you have the option to tranfer earnings to your bank account on 15th of every month.</span>
                        </Modal>
                        <div className="row">
                            <div className="col s6"><h5>Transfered date</h5></div>
                            <div onClick={this.openModal} className="col s6" style={{ textAlign: 'right' }}><img title="Tips & info" className="tips-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Infoh.svg" /></div>
                        </div>
                        <img className="transfer-icon" src="https://s3-ap-southeast-1.amazonaws.com/blueplate-images/icons/Transfer.svg" />
                        <span className="amount-price">${this.state.amount}</span>
                        <h6 className="time-transfer">will be transfered to your account on <b>{payday}</b></h6>
                        <div className="row" style={{ marginTop: '100px' }}>
                            <div className="col s12 m6 l6 form-section"><button className="btn" onClick={() => this.claim()}>Claim</button></div>
                            <div className="col s12 m6 l6 form-section"><button className="btn secondary" onClick={() => this.showHistory()}>History</button></div>
                        </div>
                    </div>
                )
            case 'history':
                return (
                    <div>
                        <div className="row">
                            <div className="col s6 no-padding"><h5>History</h5></div>
                        </div>
                        <div className="row">
                            <table className="striped">
                                <thead>
                                    <tr>
                                        <th>Transfer date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>{ this.renderListHistory() }</tbody>
                            </table>
                        </div>
                        <div className="row" style={{ marginTop: '100px' }}>
                            <div className="col s12 m6 l6 form-section"><button className="btn" onClick={() => { FlowRouter.go('/cooking/dashboard') }}>Done</button></div>
                            <div className="col s12 m6 l6 form-section"><button className="btn secondary" onClick={() => { this.setState({ screen: 'claim' }) }} >Back</button></div>
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